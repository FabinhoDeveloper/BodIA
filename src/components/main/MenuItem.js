import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';

export default function MenuItem({ icon, label, onPress, isLast, variant = 'default' }) {
  const isDanger = variant === 'danger';
  return (
    <TouchableOpacity
      style={[styles.item, !isLast && styles.itemBorder]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        {icon}
        <Text style={[styles.label, isDanger && styles.labelDanger]}>{label}</Text>
      </View>
      {!isDanger && <Ionicons name="chevron-forward" size={16} color={colors.neutral.muted} />}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  itemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.neutral.border,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  label: { fontSize: 13, color: colors.neutral.primary },
  labelDanger: { color: colors.error.dark },
});
