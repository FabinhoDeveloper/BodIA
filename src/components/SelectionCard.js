import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SelectionCard({ icon, title, subtitle, selected, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.iconBox, selected && styles.iconBoxSelected]}>
        <Text style={[styles.iconText, selected && styles.iconTextSelected]}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, selected && styles.subtitleSelected]}>{subtitle}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.neutral.border,
    backgroundColor: colors.neutral.white,
    marginBottom: 10,
  },
  cardSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[500],
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconBoxSelected: {
    backgroundColor: colors.primary[500],
  },
  iconText: {
    fontSize: 18,
    color: colors.neutral.secondary,
  },
  iconTextSelected: {
    color: colors.neutral.white,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral.primary,
  },
  titleSelected: {
    color: colors.primary[900],
  },
  subtitle: {
    fontSize: 12,
    color: colors.neutral.muted,
    marginTop: 2,
  },
  subtitleSelected: {
    color: colors.primary[700],
  },
});
