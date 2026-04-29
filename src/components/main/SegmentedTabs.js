import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function SegmentedTabs({ tabs, activeIndex, onTabPress }) {
  return (
    <View style={styles.container}>
      {tabs.map((tab, idx) => {
        const isActive = idx === activeIndex;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabPress(idx)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.neutral.surface,
    borderRadius: 10,
    padding: 4,
    flexDirection: 'row',
    gap: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: colors.neutral.white,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  tabText: {
    fontSize: 13,
    textAlign: 'center',
    fontWeight: '500',
    color: colors.neutral.muted,
  },
  tabTextActive: {
    fontWeight: '600',
    color: colors.neutral.primary,
  },
});
