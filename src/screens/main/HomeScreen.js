import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TextInput, TouchableOpacity, Animated, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useAuth } from '../../contexts/AuthContext';
import HomeHeader from '../../components/main/HomeHeader';
import ActionCard from '../../components/main/ActionCard';
import CaloriesCard from '../../components/main/CaloriesCard';
import HydrationCard from '../../components/main/HydrationCard';
import TrainingTodayCard from '../../components/main/TrainingTodayCard';
import MiniStatCard from '../../components/main/MiniStatCard';
import { fetchHydration, addHydration, fetchWeightHistory, addWeight, fetchTrainingToday, fetchDietToday } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

function getNextAction() {
  const hour = new Date().getHours();
  if (hour < 10) return 'Hora do café da manhã';
  if (hour < 14) return 'Hora do almoço';
  if (hour < 18) return 'Hora do lanche';
  return 'Hora do jantar';
}

function formatWeightDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });
  return `${day} ${month}`;
}

const EMPTY_CALORIES = {
  consumed: 0,
  target: 0,
  protein: { consumed: 0, target: 0 },
  carbs: { consumed: 0, target: 0 },
  fat: { consumed: 0, target: 0 },
};

// Deriva calorias/macros consumidos (refeições registradas hoje) e metas (plano completo)
function resumoCaloriasDoPlano(plano) {
  const refeicoes = plano?.refeicoes ?? [];
  const consumido = refeicoes
    .filter((r) => r.registradoHoje)
    .reduce(
      (acc, r) => ({
        calorias: acc.calorias + r.calorias,
        proteinas: acc.proteinas + r.proteinas,
        carboidratos: acc.carboidratos + r.carboidratos,
        gorduras: acc.gorduras + r.gorduras,
      }),
      { calorias: 0, proteinas: 0, carboidratos: 0, gorduras: 0 },
    );

  return {
    consumed: Math.round(consumido.calorias),
    target: Math.round(plano?.totalCalorias ?? 0),
    protein: { consumed: Math.round(consumido.proteinas), target: Math.round(plano?.totalProteinas ?? 0) },
    carbs: { consumed: Math.round(consumido.carboidratos), target: Math.round(plano?.totalCarboidratos ?? 0) },
    fat: { consumed: Math.round(consumido.gorduras), target: Math.round(plano?.totalGorduras ?? 0) },
  };
}

function estimarMinutos(exercicios) {
  const seg = exercicios.reduce((acc, e) => acc + e.series * (e.tempoDescanso + 40), 0);
  return Math.max(1, Math.round(seg / 60));
}

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const userName = user?.nome || 'Fábio';
  const usuarioId = user?.id;

  const [hydration, setHydration] = useState({ consumed: 0, target: 2600 });
  const [training, setTraining] = useState(null);
  const [calories, setCalories] = useState(EMPTY_CALORIES);
  const [refreshing, setRefreshing] = useState(false);

  const [weight, setWeight] = useState(null);
  const [weightHistory, setWeightHistory] = useState([]);
  const [weightModalVisible, setWeightModalVisible] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [weightToast, setWeightToast] = useState(null);
  const weightToastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!weightToast) return;
    Animated.sequence([
      Animated.timing(weightToastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(weightToastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => setWeightToast(null));
    return () => weightToastOpacity.setValue(0);
  }, [weightToast]);

  useEffect(() => {
    return () => weightToastOpacity.setValue(0);
  }, []);

  const loadHydration = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const response = await fetchHydration(usuarioId);
      setHydration({ consumed: response.data.consumidoMl, target: response.data.metaMl });
    } catch (error) {
      console.log('[BodIA] Erro ao carregar hidratação:', error.message);
    }
  }, [usuarioId]);

  const loadWeight = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const response = await fetchWeightHistory(usuarioId);
      const data = response.data;
      setWeight(data.atual);
      setWeightHistory(data.historico || []);
    } catch (error) {
      console.log('[BodIA] Erro ao carregar peso:', error.message);
    }
  }, [usuarioId]);

  const loadTraining = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const response = await fetchTrainingToday(usuarioId);
      setTraining(response.data);
    } catch (error) {
      console.log('[BodIA] Erro ao carregar treino de hoje:', error.message);
    }
  }, [usuarioId]);

  const loadDiet = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const response = await fetchDietToday(usuarioId);
      setCalories(resumoCaloriasDoPlano(response.data));
    } catch (error) {
      console.log('[BodIA] Erro ao carregar calorias do dia:', error.message);
    }
  }, [usuarioId]);

  const refreshAll = useCallback(
    () => Promise.all([loadHydration(), loadWeight(), loadTraining(), loadDiet()]),
    [loadHydration, loadWeight, loadTraining, loadDiet],
  );

  // Recarrega sempre que a Home ganha foco (ex.: ao voltar da aba Dieta após
  // registrar/desfazer uma refeição), para refletir o consumido atualizado.
  useFocusEffect(
    useCallback(() => {
      refreshAll();
    }, [refreshAll]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refreshAll();
    setRefreshing(false);
  }, [refreshAll]);

  const handleAddHydration = useCallback(async (ml) => {
    if (!usuarioId) return;
    try {
      const response = await addHydration(usuarioId, ml);
      setHydration({ consumed: response.data.consumidoMl, target: response.data.metaMl });
    } catch (error) {
      console.log('[BodIA] Erro ao registrar hidratação:', error.message);
    }
  }, [usuarioId]);

  const handleSaveWeight = useCallback(async () => {
    const pesoNum = parseFloat(newWeight.replace(',', '.'));
    if (!pesoNum || pesoNum <= 0) return;

    try {
      const response = await addWeight(usuarioId, pesoNum);
      const data = response.data;
      setWeight(data.atual);
      setWeightHistory(data.historico || []);
      setNewWeight('');
      setWeightModalVisible(false);
      setWeightToast('Peso registrado! Continue acompanhando');
    } catch (error) {
      console.log('[BodIA] Erro ao salvar peso:', error.message);
    }
  }, [usuarioId, newWeight]);

  const weightDisplay = weight != null ? `${weight.toFixed(1).replace('.', ',')} kg` : '-- kg';
  const lastWeightDate = weightHistory.length > 0 ? formatWeightDate(weightHistory[0].registradoEm) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      >
        <HomeHeader userName={userName} onReload={onRefresh} />
        <View style={styles.content}>
          <ActionCard
            label="Próxima ação"
            title={getNextAction()}
            icon={<MaterialCommunityIcons name="silverware-fork-knife" size={20} color={colors.neutral.white} />}
            onPress={() => navigation.navigate('Dieta')}
          />
          <CaloriesCard
            consumed={calories.consumed}
            target={calories.target}
            protein={calories.protein}
            carbs={calories.carbs}
            fat={calories.fat}
          />
          <HydrationCard
            consumed={hydration.consumed}
            target={hydration.target}
            onAdd={handleAddHydration}
          />
          <TrainingTodayCard
            isRestDay={training != null && (!training.temFicha || !training.plano)}
            title={training?.plano?.foco || ''}
            exerciseCount={training?.exercicios?.length || 0}
            estimatedMinutes={training?.exercicios ? estimarMinutos(training.exercicios) : 0}
            onPress={() => navigation.navigate('Treino')}
          />
          <View>
            <MiniStatCard
              label="Peso atual"
              value={weightDisplay}
              subtitle={lastWeightDate}
              actionLabel="Atualizar"
              onActionPress={() => setWeightModalVisible(true)}
            />
            {weightToast ? (
              <Animated.View style={[styles.weightToast, { opacity: weightToastOpacity }]}>
                <Text style={styles.weightToastText}>{weightToast}</Text>
              </Animated.View>
            ) : null}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={weightModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setWeightModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setWeightModalVisible(false)}
        >
          <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
            <Text style={styles.modalTitle}>Atualizar peso</Text>

            <Text style={styles.modalCurrent}>
              Peso atual: <Text style={styles.modalCurrentValue}>{weightDisplay}</Text>
            </Text>

            <TextInput
              style={styles.modalInput}
              value={newWeight}
              onChangeText={setNewWeight}
              placeholder="Novo peso (kg)"
              placeholderTextColor={colors.neutral.muted}
              keyboardType="decimal-pad"
              autoFocus
            />

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => { setNewWeight(''); setWeightModalVisible(false); }}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSaveWeight}
                activeOpacity={0.7}
              >
                <Text style={styles.modalSaveBtnText}>Salvar</Text>
              </TouchableOpacity>
            </View>

            {weightHistory.length > 0 ? (
              <>
                <Text style={styles.historyTitle}>Histórico</Text>
                {weightHistory.slice(0, 5).map((entry) => (
                  <View key={entry.id} style={styles.historyRow}>
                    <Text style={styles.historyDate}>{formatWeightDate(entry.registradoEm)}</Text>
                    <Text style={styles.historyWeight}>
                      {entry.peso.toFixed(1).replace('.', ',')} kg
                    </Text>
                  </View>
                ))}
              </>
            ) : null}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  scroll: { flexGrow: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    gap: 12,
    paddingBottom: 104,
  },
  weightToast: {
    marginTop: 10,
    backgroundColor: colors.success.light,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  weightToastText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success.dark,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.neutral.primary,
    marginBottom: 8,
  },
  modalCurrent: {
    fontSize: 13,
    color: colors.neutral.muted,
    marginBottom: 12,
  },
  modalCurrentValue: {
    color: colors.neutral.primary,
    fontWeight: '600',
  },
  modalInput: {
    backgroundColor: colors.neutral.bg,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.neutral.primary,
    marginBottom: 14,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: colors.neutral.surface,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.secondary,
  },
  modalSaveBtn: {
    flex: 1,
    backgroundColor: colors.primary[500],
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.secondary,
    marginTop: 18,
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.neutral.border,
  },
  historyDate: {
    fontSize: 13,
    color: colors.neutral.muted,
  },
  historyWeight: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.neutral.primary,
  },
});
