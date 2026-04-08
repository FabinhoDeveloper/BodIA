import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

// total: 11 dots (steps 1-11 of onboarding)
export default function ProgressDots({ current, total = 11 }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[styles.dot, i + 1 === current ? styles.active : styles.inactive]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 50,
  },
  active: {
    backgroundColor: colors.primary[500],
  },
  inactive: {
    backgroundColor: colors.neutral.border,
  },
});
