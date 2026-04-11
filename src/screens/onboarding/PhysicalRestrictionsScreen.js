import React from 'react';
import { View, StyleSheet, ScrollView, TextInput, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import MultiSelectChip from '../../components/MultiSelectChip';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const OPTIONS = [
  { label: 'Hérnia de disco', value: 'herniated_disc' },
  { label: 'Lesão no joelho', value: 'knee_injury' },
  { label: 'Lesão no ombro', value: 'shoulder_injury' },
  { label: 'Dor lombar', value: 'lower_back_pain' },
  { label: 'Tendinite', value: 'tendinitis' },
  { label: 'Lesão no punho', value: 'wrist_injury' },
];
const OTHER_OPTION = 'other';

export default function PhysicalRestrictionsScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const selected = onboardingData.physicalRestrictions.filter((value) => value !== 'none');
  const otherSelected = selected.includes(OTHER_OPTION);

  function toggleOption(value) {
    if (selected.includes(value)) {
      const next = selected.filter((v) => v !== value);
      updateOnboarding('physicalRestrictions', next);
      if (value === OTHER_OPTION) {
        updateOnboarding('physicalRestrictionsOther', '');
      }
    } else {
      updateOnboarding('physicalRestrictions', [...selected, value]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ScreenHeader
              title="Restrições físicas"
              subtitle="Tem alguma lesão ou limitação? Seu plano vai respeitar isso"
            />
            <View style={styles.chips}>
              {OPTIONS.map((opt) => (
                <MultiSelectChip
                  key={opt.value}
                  label={opt.label}
                  selected={selected.includes(opt.value)}
                  onPress={() => toggleOption(opt.value)}
                />
              ))}
              <MultiSelectChip
                label="Outro"
                selected={otherSelected}
                onPress={() => toggleOption(OTHER_OPTION)}
              />
            </View>
            {otherSelected ? (
              <View style={styles.otherContainer}>
                <Text style={styles.otherLabel}>Qual restrição física?</Text>
                <TextInput
                  style={styles.textArea}
                  value={onboardingData.physicalRestrictionsOther}
                  onChangeText={(value) => updateOnboarding('physicalRestrictionsOther', value)}
                  placeholder="Descreva sua restrição física"
                  placeholderTextColor={colors.neutral.muted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            ) : null}
          </ScrollView>
          <NavigationFooter
            currentStep={7}
            totalSteps={12}
            onNext={() => navigation.navigate('DietStyle')}
            onBack={() => navigation.goBack()}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  flex: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56 },
  scroll: { flexGrow: 1 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  otherContainer: {
    marginTop: 12,
    marginBottom: 8,
  },
  otherLabel: {
    fontSize: 13,
    color: colors.neutral.secondary,
    marginBottom: 6,
  },
  textArea: {
    minHeight: 112,
    backgroundColor: colors.neutral.bg,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.neutral.primary,
  },
});
