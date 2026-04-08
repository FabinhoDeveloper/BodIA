import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function ToggleSelector({ options, value, onChange }) {
  // options: [{ label: 'Masculino', value: 'M' }, { label: 'Feminino', value: 'F' }]
  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.value}
          style={[styles.button, value === opt.value && styles.buttonActive]}
          onPress={() => onChange(opt.value)}
          activeOpacity={0.8}
        >
          <Text style={[styles.text, value === opt.value && styles.textActive]}>
            {opt.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonActive: {
    backgroundColor: colors.primary[500],
  },
  text: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral.secondary,
  },
  textActive: {
    color: colors.neutral.white,
  },
});
