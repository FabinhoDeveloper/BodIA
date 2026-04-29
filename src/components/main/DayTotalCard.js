import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function DayTotalCard({ totalCalories, protein, carbs, fat }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.label}>Total do dia</Text>
        <Text style={styles.calories}>{totalCalories.toLocaleString('pt-BR')} kcal</Text>
      </View>
      <View style={styles.grid}>
        <View style={styles.col}>
          <Text style={styles.value}>{protein}g</Text>
          <Text style={styles.macroLabel}>Proteína</Text>
        </View>
        <View style={[styles.col, styles.colBorder]}>
          <Text style={styles.value}>{carbs}g</Text>
          <Text style={styles.macroLabel}>Carbo</Text>
        </View>
        <View style={[styles.col, styles.colBorder]}>
          <Text style={styles.value}>{fat}g</Text>
          <Text style={styles.macroLabel}>Gordura</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.bg,
    borderRadius: 12,
    padding: 12,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 12, color: colors.neutral.muted },
  calories: { fontSize: 13, fontWeight: '600', color: colors.neutral.primary },
  grid: { flexDirection: 'row' },
  col: { flex: 1, alignItems: 'center' },
  colBorder: {
    borderLeftWidth: 0.5,
    borderLeftColor: colors.neutral.border,
  },
  value: { fontSize: 13, fontWeight: '600', color: colors.neutral.primary },
  macroLabel: { fontSize: 10, color: colors.neutral.muted, marginTop: 2 },
});
