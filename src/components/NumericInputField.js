import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function NumericInputField({ label, value, onChangeText, placeholder, unit, optional, error }) {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        {optional && <Text style={styles.optional}> (opcional)</Text>}
      </View>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral.muted}
          keyboardType="numeric"
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: colors.neutral.secondary,
  },
  optional: {
    fontSize: 12,
    color: colors.neutral.muted,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.bg,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.neutral.primary,
    padding: 0,
  },
  inputError: {
    borderColor: colors.error.base,
  },
  unit: {
    fontSize: 12,
    color: colors.neutral.muted,
    marginLeft: 8,
  },
  error: {
    fontSize: 12,
    color: colors.error.base,
    marginTop: 4,
  },
});
