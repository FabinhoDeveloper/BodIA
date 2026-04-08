import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
  { label: 'Nenhuma', value: 'none' },
];

export default function DietaryRestrictionsScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const selected = onboardingData.dietaryRestrictions;

  function toggleOption(value) {
    if (value === 'none') {
      updateOnboarding('dietaryRestrictions', ['none']);
      return;
    }
    const without = selected.filter((v) => v !== 'none');
    if (without.includes(value)) {
      updateOnboarding('dietaryRestrictions', without.filter((v) => v !== value));
    } else {
      updateOnboarding('dietaryRestrictions', [...without, value]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
          </View>
        </ScrollView>
        <NavigationFooter
          currentStep={9}
          totalSteps={12}
          onNext={() => navigation.navigate('FoodExclusions')}
          onBack={() => navigation.goBack()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56 },
  scroll: { flexGrow: 1 },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
