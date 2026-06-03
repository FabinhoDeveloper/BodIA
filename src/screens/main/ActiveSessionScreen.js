import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { logSet, finishSession } from '../../services/api';
import SetRow from '../../components/main/SetRow';
import RestTimer from '../../components/main/RestTimer';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

// Monta o mapa serieId -> { reps, carga } (strings) a partir da sessão
function buildInputs(session) {
  const map = {};
  (session?.registros || []).forEach((r) => {
    (r.series || []).forEach((s) => {
      map[s.id] = {
        reps: s.repeticoes != null ? String(s.repeticoes) : '',
        carga: s.carga != null ? String(s.carga) : '',
      };
    });
  });
  return map;
}

export default function ActiveSessionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();

  const [session, setSession] = useState(route.params?.session || null);
  const [inputs, setInputs] = useState(() => buildInputs(route.params?.session));
  const [rest, setRest] = useState(null); // { id, seconds, registroId }
  const [busy, setBusy] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const restCounter = useRef(0);

  function startRest(registro) {
    restCounter.current += 1;
    setRest({ id: restCounter.current, seconds: registro.tempoDescanso || 60, registroId: registro.id });
  }

  function setReps(serieId, value) {
    setInputs((prev) => ({ ...prev, [serieId]: { ...prev[serieId], reps: value } }));
  }

  function setCarga(serieId, value) {
    setInputs((prev) => ({ ...prev, [serieId]: { ...prev[serieId], carga: value } }));
  }

  // Resolve reps/carga de uma série: usa o que foi digitado; senão, alvo de reps e 0 de carga
  function resolverValores(serie, registro) {
    const inp = inputs[serie.id] || {};
    const repsRaw = String(inp.reps ?? '').replace(',', '.');
    const cargaRaw = String(inp.carga ?? '').replace(',', '.');

    const reps = repsRaw === '' ? registro.repeticoesAlvo ?? 0 : Number(repsRaw);
    const carga = cargaRaw === '' ? 0 : Number(cargaRaw);

    if (Number.isNaN(reps) || reps < 0 || Number.isNaN(carga) || carga < 0) {
      return null;
    }
    return { reps, carga };
  }

  // Finaliza a primeira série pendente do exercício
  async function handleFinalizarSerie(registro) {
    if (busy) return;
    const serie = (registro.series || []).find((s) => !s.concluido);
    if (!serie) return;

    const valores = resolverValores(serie, registro);
    if (!valores) {
      return Alert.alert('Valores inválidos', 'Confira reps e carga da série.');
    }

    setBusy(true);
    try {
      const res = await logSet(user.id, serie.id, valores.reps, valores.carga);
      setSession(res.data);
      startRest(registro);
    } catch (error) {
      const message = error.response?.data?.error || 'Não foi possível registrar a série.';
      Alert.alert('Erro', message);
    } finally {
      setBusy(false);
    }
  }

  // Finaliza todas as séries pendentes do exercício
  async function handleFinalizarTodas(registro) {
    if (busy) return;
    const pendentes = (registro.series || []).filter((s) => !s.concluido);
    if (pendentes.length === 0) return;

    setBusy(true);
    try {
      let ultima;
      for (const serie of pendentes) {
        const valores = resolverValores(serie, registro);
        if (!valores) {
          Alert.alert('Valores inválidos', 'Confira reps e carga das séries.');
          return;
        }
        ultima = await logSet(user.id, serie.id, valores.reps, valores.carga);
      }
      if (ultima) setSession(ultima.data);
      startRest(registro);
    } catch (error) {
      const message = error.response?.data?.error || 'Não foi possível registrar as séries.';
      Alert.alert('Erro', message);
    } finally {
      setBusy(false);
    }
  }

  async function handleFinish() {
    if (!session?.id) return;
    setFinishing(true);
    try {
      await finishSession(user.id, session.id);
      navigation.goBack();
    } catch (error) {
      const message = error.response?.data?.error || 'Não foi possível finalizar o treino.';
      Alert.alert('Erro', message);
    } finally {
      setFinishing(false);
    }
  }

  const registros = session?.registros || [];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={colors.neutral.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{session?.nome || 'Treino'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {registros.map((registro) => {
            const series = registro.series || [];
            const todasFeitas = series.every((s) => s.concluido);
            const pendentes = series.filter((s) => !s.concluido).length;

            return (
              <View key={registro.id} style={[styles.exerciseCard, registro.concluido && styles.exerciseDone]}>
                {rest?.registroId === registro.id && (
                  <RestTimer key={rest.id} seconds={rest.seconds} onFinish={() => setRest(null)} />
                )}
                <View style={styles.exerciseHeader}>
                  <Text style={styles.exerciseName}>{registro.nome}</Text>
                  <Text style={styles.exerciseTarget}>
                    alvo: {registro.repeticoesAlvo ?? '—'} reps · {registro.tempoDescanso ?? '—'}s descanso
                  </Text>
                </View>

                {series.map((serie) => (
                  <SetRow
                    key={serie.id}
                    numeroSerie={serie.numeroSerie}
                    repeticoesAlvo={registro.repeticoesAlvo}
                    repsValue={inputs[serie.id]?.reps ?? ''}
                    cargaValue={inputs[serie.id]?.carga ?? ''}
                    onChangeReps={(v) => setReps(serie.id, v)}
                    onChangeCarga={(v) => setCarga(serie.id, v)}
                    concluido={serie.concluido}
                  />
                ))}

                <View style={styles.actions}>
                  <PrimaryButton
                    title="Finalizar série"
                    onPress={() => handleFinalizarSerie(registro)}
                    disabled={busy || todasFeitas}
                    style={styles.finishSetBtn}
                  />
                  <TouchableOpacity
                    style={[styles.allBtn, (busy || todasFeitas) && styles.allBtnDisabled]}
                    onPress={() => handleFinalizarTodas(registro)}
                    disabled={busy || todasFeitas}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.allBtnText}>Todas{pendentes > 0 ? ` (${pendentes})` : ''}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          <PrimaryButton
            title={finishing ? 'Finalizando...' : 'Finalizar treino'}
            onPress={handleFinish}
            disabled={finishing}
            style={styles.finishWorkoutBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.neutral.primary },
  headerSpacer: { width: 24 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120, gap: 12 },
  exerciseCard: {
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
  },
  exerciseDone: { borderColor: colors.primary[200], backgroundColor: colors.primary[50] },
  exerciseHeader: { marginBottom: 6 },
  exerciseName: { fontSize: 14, fontWeight: '600', color: colors.neutral.primary },
  exerciseTarget: { fontSize: 11, color: colors.neutral.muted, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'stretch', gap: 8, marginTop: 10 },
  finishSetBtn: { flex: 1, paddingVertical: 11, borderRadius: 10 },
  allBtn: {
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.surface,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
  },
  allBtnDisabled: { opacity: 0.5 },
  allBtnText: { fontSize: 13, fontWeight: '600', color: colors.neutral.secondary },
  finishWorkoutBtn: { marginTop: 4 },
});
