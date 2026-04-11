import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import MultiSelectChip from '../../components/MultiSelectChip';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const OPTIONS = [
  { label: 'Intolerância à lactose', value: 'lactose_intolerant' },
  { label: 'Alergia a glúten', value: 'gluten_free' },
  { label: 'Vegano', value: 'vegan' },
  { label: 'Vegetariano', value: 'vegetarian' },
  { label: 'Alergia a frutos do mar', value: 'seafood_allergy' },
  { label: 'Alergia a amendoim', value: 'peanut_allergy' },
];
const OTHER_OPTION = 'other';

export default function DietaryRestrictionsScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const selected = onboardingData.dietaryRestrictions.filter((value) => value !== 'none');
  const otherSelected = selected.includes(OTHER_OPTION);

  function toggleOption(value) {
    if (selected.includes(value)) {
      const next = selected.filter((v) => v !== value);
      updateOnboarding('dietaryRestrictions', next);
      if (value === OTHER_OPTION) {
        updateOnboarding('dietaryRestrictionsOther', '');
      }
    } else {
      updateOnboarding('dietaryRestrictions', [...selected, value]);
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
              title="Restrições alimentares"
              subtitle="Alguma alergia ou dieta especial?"
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
                <Text style={styles.otherLabel}>Qual restrição alimentar?</Text>
                <TextInput
                  style={styles.textArea}
                  value={onboardingData.dietaryRestrictionsOther}
                  onChangeText={(value) => updateOnboarding('dietaryRestrictionsOther', value)}
                  placeholder="Descreva sua restrição alimentar"
                  placeholderTextColor={colors.neutral.muted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            ) : null}
          </ScrollView>
          <NavigationFooter
            currentStep={9}
            totalSteps={12}
            onNext={() => navigation.navigate('FoodExclusions')}
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
