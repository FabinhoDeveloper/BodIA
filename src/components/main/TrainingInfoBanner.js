import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function TrainingInfoBanner({ title, dayLabel, info }) {
  return (
    <View style={styles.banner}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{dayLabel}</Text>
        </View>
      </View>
      <Text style={styles.info}>{info}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primary[50],
    borderWidth: 1.5,
    borderColor: colors.primary[500],
    borderRadius: 14,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  title: { fontSize: 16, fontWeight: '600', color: colors.primary[900] },
  badge: {
    backgroundColor: colors.neutral.white,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  badgeText: { fontSize: 10, fontWeight: '600', color: colors.primary[900] },
  info: { fontSize: 12, color: colors.primary[700] },
});
