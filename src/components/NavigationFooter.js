import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import ProgressDots from './ProgressDots';
import { colors } from '../theme/colors';

export default function NavigationFooter({
  currentStep,
  totalSteps,
  onNext,
  onBack,
  nextLabel,
  nextDisabled,
  showBack = true,
}) {
  return (
    <View style={styles.container}>
      <ProgressDots current={currentStep} total={totalSteps} />
      <View style={styles.buttons}>
        {showBack && (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} activeOpacity={0.7}>
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextBtn, nextDisabled && styles.nextDisabled]}
          onPress={onNext}
          disabled={nextDisabled}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>{nextLabel || 'Próximo'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    marginTop: 8,
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backBtn: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.secondary,
  },
  nextBtn: {
    height: 40,
    paddingHorizontal: 22,
    borderRadius: 12,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextDisabled: {
    opacity: 0.5,
  },
  nextText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.white,
  },
});
