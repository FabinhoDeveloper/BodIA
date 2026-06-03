import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import ScreenHeader from '../../components/ScreenHeader';
import SegmentedTabs from '../../components/main/SegmentedTabs';
import TrainingInfoBanner from '../../components/main/TrainingInfoBanner';
import ExerciseListItem from '../../components/main/ExerciseListItem';
import PrimaryButton from '../../components/PrimaryButton';
import { useAuth } from '../../contexts/AuthContext';
import { fetchTrainingToday, fetchTrainingHistory, startSession } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

// Estimativa grosseira de duração: séries × (descanso + ~40s de execução)
function estimarMinutos(exercicios) {
  const seg = exercicios.reduce((acc, e) => acc + e.series * (e.tempoDescanso + 40), 0);
  return Math.max(1, Math.round(seg / 60));
}

function formatarData(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatarDuracao(segundos) {
  if (segundos == null) return '—';
  const min = Math.round(segundos / 60);
  return min <= 0 ? '<1 min' : `${min} min`;
}

export default function TrainingScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState(0);
  const [today, setToday] = useState(null);
  const [loadingToday, setLoadingToday] = useState(true);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [starting, setStarting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      let active = true;
      setLoadingToday(true);
      setLoadingHistory(true);

      fetchTrainingToday(user.id)
        .then((res) => { if (active) setToday(res.data); })
        .catch((e) => console.log('[BodIA] Erro treino de hoje:', e.message))
        .finally(() => { if (active) setLoadingToday(false); });

      fetchTrainingHistory(user.id)
        .then((res) => { if (active) setHistory(res.data || []); })
        .catch((e) => console.log('[BodIA] Erro histórico:', e.message))
        .finally(() => { if (active) setLoadingHistory(false); });

      return () => { active = false; };
    }, [user?.id])
  );

  async function handleStart() {
    if (!user?.id || !today?.plano) return;
    setStarting(true);
    try {
      if (today.sessaoEmAndamento) {
        navigation.navigate('ActiveSession', { session: today.sessaoEmAndamento });
      } else {
        const res = await startSession(user.id, today.plano.id);
        navigation.navigate('ActiveSession', { session: res.data });
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Não foi possível iniciar o treino.';
      Alert.alert('Erro', message);
    } finally {
      setStarting(false);
    }
  }

  function renderToday() {
    if (loadingToday) {
      return <ActivityIndicator color={colors.primary[500]} style={styles.loading} />;
    }
    if (!today?.temFicha || !today?.plano) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Nenhum treino disponível ainda</Text>
        </View>
      );
    }

    const exercicios = today.exercicios || [];
    const totalSeries = exercicios.reduce((acc, e) => acc + e.series, 0);
    const info = `${exercicios.length} exercícios · ~${estimarMinutos(exercicios)} min · ${totalSeries} séries totais`;
    const emAndamento = !!today.sessaoEmAndamento;

    return (
      <View style={styles.todayContent}>
        <TrainingInfoBanner
          title={today.plano.foco}
          dayLabel={`Dia ${today.plano.letra}`}
          info={info}
        />
        <View style={styles.exerciseList}>
          {exercicios.map((ex) => (
            <ExerciseListItem
              key={ex.exercicioPrescritoId}
              number={ex.ordem + 1}
              name={ex.nome}
              sets={ex.series}
              repRange={String(ex.repeticoes)}
              restSeconds={ex.tempoDescanso}
              completed={false}
            />
          ))}
        </View>
        <PrimaryButton
          title={starting ? 'Aguarde...' : emAndamento ? 'Continuar treino' : 'Iniciar treino'}
          onPress={handleStart}
          disabled={starting}
        />
      </View>
    );
  }

  function renderHistory() {
    if (loadingHistory) {
      return <ActivityIndicator color={colors.primary[500]} style={styles.loading} />;
    }
    if (history.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Seus treinos passados aparecerão aqui</Text>
        </View>
      );
    }
    return (
      <View style={styles.historyList}>
        {history.map((s) => (
          <TouchableOpacity
            key={s.id}
            style={styles.historyItem}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('SessionDetail', { sessaoId: s.id, nome: s.nome })}
          >
            <View style={styles.historyLeft}>
              <Text style={styles.historyName}>{s.nome}</Text>
              <Text style={styles.historyMeta}>
                {formatarData(s.iniciadoEm)} · {formatarDuracao(s.duracaoSegundos)} · {s.seriesConcluidas}/{s.totalSeries} séries
              </Text>
            </View>
            {s.status !== 'CONCLUIDA' && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{s.status === 'EM_ANDAMENTO' ? 'em andamento' : 'abandonado'}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ScreenHeader title="Treino" />
        </View>
        <View style={styles.content}>
          <SegmentedTabs
            tabs={['Hoje', 'Histórico']}
            activeIndex={activeTab}
            onTabPress={setActiveTab}
          />
          {activeTab === 0 ? renderToday() : renderHistory()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  scroll: { flexGrow: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  content: { paddingHorizontal: spacing.lg, gap: 12, paddingBottom: 104 },
  todayContent: { gap: 12 },
  exerciseList: { gap: 8 },
  loading: { paddingVertical: 48 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  emptyText: { fontSize: 14, color: colors.neutral.muted, textAlign: 'center' },
  historyList: { gap: 8 },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
  },
  historyLeft: { flex: 1 },
  historyName: { fontSize: 13, fontWeight: '600', color: colors.neutral.primary },
  historyMeta: { fontSize: 11, color: colors.neutral.muted, marginTop: 2 },
  badge: {
    backgroundColor: colors.warning.light,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '600', color: colors.warning.dark },
});
