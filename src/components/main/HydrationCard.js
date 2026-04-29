import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

function formatLiters(ml) {
  return (ml / 1000).toFixed(1).replace('.', ',');
}

export default function HydrationCard({ consumed, target, onAdd }) {
  const pct = Math.min(consumed / target, 1);
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>Hidratação</Text>
          <Text style={styles.value}>{formatLiters(consumed)} / {formatLiters(target)} L</Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(200)} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>+200</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => onAdd(500)} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>+500</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
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
    marginBottom: 10,
  },
  label: { fontSize: 12, color: colors.neutral.muted },
  value: { fontSize: 16, fontWeight: '600', color: colors.neutral.primary, marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 4 },
  addBtn: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addBtnText: { fontSize: 11, fontWeight: '600', color: colors.primary[900] },
  barBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral.border,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 3, backgroundColor: colors.primary[500] },
});
