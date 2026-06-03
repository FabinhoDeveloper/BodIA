import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';

// Linha de uma série. Em modo leitura (histórico) mostra os valores salvos;
// no modo ativo os campos são controlados pela tela (reps/carga) e o check é só
// indicador — a conclusão é feita pelos botões do exercício.
export default function SetRow({
  numeroSerie,
  repeticoesAlvo,
  repsValue,
  cargaValue,
  onChangeReps,
  onChangeCarga,
  concluido,
  readOnly,
  repeticoes,
  carga,
}) {
  if (readOnly) {
    return (
      <View style={styles.row}>
        <Text style={styles.serieLabel}>Série {numeroSerie}</Text>
        <Text style={styles.readValue}>
          {repeticoes != null ? `${repeticoes} reps` : '—'} · {carga != null ? `${carga} kg` : '—'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.row, concluido && styles.rowDone]}>
      <Text style={styles.serieLabel}>Série {numeroSerie}</Text>
      <View style={styles.inputs}>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={repsValue}
            onChangeText={onChangeReps}
            placeholder={repeticoesAlvo != null ? String(repeticoesAlvo) : 'reps'}
            placeholderTextColor={colors.neutral.muted}
            keyboardType="numeric"
          />
          <Text style={styles.unit}>reps</Text>
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            style={styles.input}
            value={cargaValue}
            onChangeText={onChangeCarga}
            placeholder="0"
            placeholderTextColor={colors.neutral.muted}
            keyboardType="numeric"
          />
          <Text style={styles.unit}>kg</Text>
        </View>
        <View style={[styles.check, concluido && styles.checkDone]}>
          {concluido ? <Ionicons name="checkmark" size={16} color={colors.neutral.white} /> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  rowDone: { opacity: 0.9 },
  serieLabel: { fontSize: 12, color: colors.neutral.secondary, width: 60 },
  readValue: { fontSize: 12, color: colors.neutral.primary, fontWeight: '500' },
  inputs: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.bg,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 4,
  },
  input: { width: 38, fontSize: 14, color: colors.neutral.primary, padding: 0, textAlign: 'center' },
  unit: { fontSize: 10, color: colors.neutral.muted },
  check: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.surface,
  },
  checkDone: { backgroundColor: colors.primary[500] },
});
