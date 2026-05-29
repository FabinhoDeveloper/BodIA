import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TextInput, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useAuth } from '../../contexts/AuthContext';
import HomeHeader from '../../components/main/HomeHeader';
import ActionCard from '../../components/main/ActionCard';
import CaloriesCard from '../../components/main/CaloriesCard';
import HydrationCard from '../../components/main/HydrationCard';
import TrainingTodayCard from '../../components/main/TrainingTodayCard';
import MiniStatCard from '../../components/main/MiniStatCard';
import { fetchHydration, addHydration, fetchWeightHistory, addWeight } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

function getNextAction() {
  const hour = new Date().getHours();
  if (hour < 10) return 'Hora do café da manhã';
  if (hour < 14) return 'Hora do almoço';
  if (hour < 18) return 'Hora do lanche';
  return 'Hora do jantar';
}

function FoodIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v18M5 8c0-3 3-5 7-5s7 2 7 5-3 5-7 5-7-2-7-5zM12 13c-5 0-7 3-7 6h14c0-3-2-6-7-6z"
        stroke={colors.neutral.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function formatWeightDate(isoString) {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });
  return `${day} ${month}`;
}

// TODO: integrar com API
const MOCK_CALORIES = { consumed: 1240, target: 2400 };
const MOCK_MACROS = {
  protein: { consumed: 82, target: 150 },
  carbs: { consumed: 120, target: 300 },
  fat: { consumed: 43, target: 66 },
};
const MOCK_TRAINING = { title: 'Peito e Tríceps', exerciseCount: 6, estimatedMinutes: 50 };

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const userName = user?.nome || 'Fábio';
  const usuarioId = user?.id;

  const [hydration, setHydration] = useState({ consumed: 0, target: 2600 });

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

  useEffect(() => {
    loadHydration();
    loadWeight();
  }, [loadHydration, loadWeight]);

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
      setWeightToast('Peso registrado! Continue acompanhando 💪');
    } catch (error) {
      console.log('[BodIA] Erro ao salvar peso:', error.message);
    }
  }, [usuarioId, newWeight]);

  const weightDisplay = weight != null ? `${weight.toFixed(1).replace('.', ',')} kg` : '-- kg';
  const lastWeightDate = weightHistory.length > 0 ? formatWeightDate(weightHistory[0].registradoEm) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <HomeHeader userName={userName} />
        <View style={styles.content}>
          <ActionCard
            label="Próxima ação"
            title={getNextAction()}
            icon={<FoodIcon />}
            onPress={() => navigation.navigate('Dieta')}
          />
          <CaloriesCard
            consumed={MOCK_CALORIES.consumed}
            target={MOCK_CALORIES.target}
            protein={MOCK_MACROS.protein}
            carbs={MOCK_MACROS.carbs}
            fat={MOCK_MACROS.fat}
          />
          <HydrationCard
            consumed={hydration.consumed}
            target={hydration.target}
            onAdd={handleAddHydration}
          />
          <TrainingTodayCard
            title={MOCK_TRAINING.title}
            exerciseCount={MOCK_TRAINING.exerciseCount}
            estimatedMinutes={MOCK_TRAINING.estimatedMinutes}
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
