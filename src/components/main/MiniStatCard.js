import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function MiniStatCard({ label, value, actionLabel, onActionPress }) {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {actionLabel ? (
        <TouchableOpacity onPress={onActionPress} activeOpacity={0.7}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.bg,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 11, color: colors.neutral.muted },
  value: { fontSize: 15, fontWeight: '600', color: colors.neutral.primary, marginTop: 2 },
  action: { fontSize: 12, fontWeight: '600', color: colors.primary[500] },
});
