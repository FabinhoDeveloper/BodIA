import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function ExerciseListItem({ number, name, sets, repRange, restSeconds, completed }) {
  return (
    <View style={[styles.item, completed && styles.completed]}>
      <View style={styles.left}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>{sets} × {repRange} · {restSeconds}s descanso</Text>
      </View>
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{number}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  completed: { opacity: 0.5 },
  left: { flex: 1 },
  name: { fontSize: 13, fontWeight: '600', color: colors.neutral.primary },
  details: { fontSize: 11, color: colors.neutral.muted, marginTop: 2 },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  numberText: { fontSize: 12, fontWeight: '600', color: colors.neutral.secondary },
});
