import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '../../theme/colors';

const RADIUS = 20;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CircularProgress({ consumed, target }) {
  const pct = Math.min(consumed / target, 1);
  const offset = CIRCUMFERENCE * (1 - pct);
  return (
    <Svg width={48} height={48} viewBox="0 0 48 48">
      <Circle
        cx="24" cy="24" r={RADIUS}
        fill="none"
        stroke={colors.neutral.border}
        strokeWidth="4"
      />
      <Circle
        cx="24" cy="24" r={RADIUS}
        fill="none"
        stroke={colors.primary[500]}
        strokeWidth="4"
        strokeDasharray={`${CIRCUMFERENCE}`}
        strokeDashoffset={`${offset}`}
        strokeLinecap="round"
        transform="rotate(-90 24 24)"
      />
    </Svg>
  );
}

function MacroBar({ consumed, target, color, label }) {
  const pct = Math.min(consumed / target, 1);
  return (
    <View style={styles.macroItem}>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={styles.macroLabel}>{label}</Text>
      <Text style={styles.macroValue}>{consumed}/{target}g</Text>
    </View>
  );
}

export default function CaloriesCard({ consumed, target, protein, carbs, fat }) {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.cardLabel}>Calorias hoje</Text>
          <Text style={styles.caloriesValue}>{consumed.toLocaleString('pt-BR')}</Text>
          <Text style={styles.caloriesTarget}>/ {target.toLocaleString('pt-BR')} kcal</Text>
        </View>
        <CircularProgress consumed={consumed} target={target} />
      </View>
      <View style={styles.macroRow}>
        <MacroBar consumed={protein.consumed} target={protein.target} color={colors.primary[500]} label="Proteína" />
        <MacroBar consumed={carbs.consumed} target={carbs.target} color={colors.accent[500]} label="Carbo" />
        <MacroBar consumed={fat.consumed} target={fat.target} color={colors.warning.base} label="Gordura" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 14,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardLabel: { fontSize: 12, color: colors.neutral.muted },
  caloriesValue: { fontSize: 20, fontWeight: '600', color: colors.neutral.primary, marginTop: 2 },
  caloriesTarget: { fontSize: 13, color: colors.neutral.muted },
  macroRow: { flexDirection: 'row', gap: 12 },
  macroItem: { flex: 1 },
  barBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.neutral.border,
    overflow: 'hidden',
  },
  barFill: { height: 4, borderRadius: 2 },
  macroLabel: { fontSize: 11, fontWeight: '500', color: colors.neutral.secondary, marginTop: 4 },
  macroValue: { fontSize: 10, color: colors.neutral.muted },
});
