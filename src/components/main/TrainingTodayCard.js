import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors } from '../../theme/colors';

export default function TrainingTodayCard({ title, exerciseCount, estimatedMinutes, onPress, isRestDay }) {
  if (isRestDay) {
    return (
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="weather-night" size={20} color={colors.neutral.secondary} />
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
        <MaterialCommunityIcons name="dumbbell" size={20} color={colors.accent[700]} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>Treino de hoje</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{exerciseCount} exercícios · ~{estimatedMinutes} min</Text>
      </View>
      <Ionicons name="chevron-forward" size={16} color={colors.neutral.muted} />
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
  textContainer: { flex: 1 },
  label: { fontSize: 12, color: colors.neutral.muted },
  title: { fontSize: 14, fontWeight: '600', color: colors.neutral.primary, marginTop: 2 },
  subtitle: { fontSize: 11, color: colors.neutral.muted, marginTop: 2 },
});
