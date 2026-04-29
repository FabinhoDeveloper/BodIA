import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors } from '../../theme/colors';

function ChevronRight() {
  return (
    <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
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
      {!isDanger && <ChevronRight />}
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
