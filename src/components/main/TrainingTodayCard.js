import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

function ChevronRight() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path
        d="M9 18l6-6-6-6"
        stroke={colors.neutral.muted}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function DumbbellIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.5 6.5h11M6.5 17.5h11M4 8v8M20 8v8M2 10v4M22 10v4"
        stroke={colors.accent[700]}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function TrainingTodayCard({ title, exerciseCount, estimatedMinutes, onPress, isRestDay }) {
  if (isRestDay) {
    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Text style={styles.restIcon}>🌙</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Treino de hoje</Text>
          <Text style={styles.title}>Hoje é dia de descanso</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconContainer, { backgroundColor: colors.accent[50] }]}>
        <DumbbellIcon />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Treino de hoje</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{exerciseCount} exercícios · ~{estimatedMinutes} min</Text>
      </View>
      <ChevronRight />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restIcon: { fontSize: 20 },
  textContainer: { flex: 1 },
  label: { fontSize: 12, color: colors.neutral.muted },
  title: { fontSize: 14, fontWeight: '600', color: colors.neutral.primary, marginTop: 2 },
  subtitle: { fontSize: 11, color: colors.neutral.muted, marginTop: 2 },
});
