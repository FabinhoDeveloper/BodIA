import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'Bom dia';
  if (hour >= 12 && hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getFormattedDate() {
  const raw = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

export default function HomeHeader({ userName }) {
  return (
    <View style={styles.container}>
      <Text style={styles.date}>{getFormattedDate()}</Text>
      <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  date: {
    fontSize: 13,
    color: colors.neutral.muted,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral.primary,
    marginTop: 2,
  },
});
