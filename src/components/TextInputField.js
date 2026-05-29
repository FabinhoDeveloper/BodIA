import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

export default function TextInputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  secureTextEntry,
  autoCapitalize,
  error,
  rightIcon,
  onRightIconPress,
  rightIconVisible,
}) {
  const hasRightIcon = !!(rightIcon && onRightIconPress);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.inputWrapper}>
        <TextInput
          style={[styles.input, error && styles.inputError, hasRightIcon && styles.inputWithIcon]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.neutral.muted}
          keyboardType={keyboardType || 'default'}
          secureTextEntry={secureTextEntry && !rightIconVisible}
          autoCapitalize={autoCapitalize || 'sentences'}
        />
        {hasRightIcon ? (
          <TouchableOpacity style={styles.iconWrap} onPress={onRightIconPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            {rightIcon}
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.neutral.secondary,
    marginBottom: 6,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  input: {
    backgroundColor: colors.neutral.bg,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.neutral.primary,
  },
  inputWithIcon: {
    paddingRight: 44,
  },
  inputError: {
    borderColor: colors.error.base,
  },
  iconWrap: {
    position: 'absolute',
    right: 4,
    padding: 8,
  },
  error: {
    fontSize: 12,
    color: colors.error.base,
    marginTop: 4,
  },
});
