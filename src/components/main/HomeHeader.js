import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
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

export default function HomeHeader({ userName, onReload }) {
  return (
    <View style={styles.container}>
      <View style={styles.textBlock}>
        <Text style={styles.date}>{getFormattedDate()}</Text>
        <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
      </View>
      {onReload ? (
        <TouchableOpacity style={styles.reloadBtn} onPress={onReload} activeOpacity={0.7}>
          <Ionicons name="refresh" size={18} color={colors.neutral.secondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  textBlock: { flex: 1 },
  reloadBtn: { padding: 4 },
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
