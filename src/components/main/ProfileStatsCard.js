import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function ProfileStatsCard({ weight, height, age }) {
  return (
    <View style={styles.card}>
      <View style={styles.col}>
        <Text style={styles.value}>{weight} kg</Text>
        <Text style={styles.label}>Peso</Text>
      </View>
      <View style={[styles.col, styles.colBorder]}>
        <Text style={styles.value}>{height} cm</Text>
        <Text style={styles.label}>Altura</Text>
      </View>
      <View style={[styles.col, styles.colBorder]}>
        <Text style={styles.value}>{age} anos</Text>
        <Text style={styles.label}>Idade</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.bg,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
  },
  col: { flex: 1, alignItems: 'center' },
  colBorder: {
    borderLeftWidth: 0.5,
    borderLeftColor: colors.neutral.border,
  },
  value: { fontSize: 14, fontWeight: '600', color: colors.neutral.primary },
  label: { fontSize: 10, color: colors.neutral.muted, marginTop: 2 },
});
