import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function MenuSection({ title, children }) {
  return (
    <View style={styles.wrapper}>
      {title ? <Text style={styles.title}>{title}</Text> : null}
      <View style={styles.container}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  title: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: colors.neutral.muted,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  container: {
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
