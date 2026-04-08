import React, { useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import MultiSelectChip from '../../components/MultiSelectChip';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const CATEGORIES = [
  {
    label: 'Proteínas',
    items: [
      { label: 'Frango', value: 'chicken' },
      { label: 'Carne vermelha', value: 'red_meat' },
      { label: 'Peixe', value: 'fish' },
      { label: 'Ovo', value: 'egg' },
      { label: 'Porco', value: 'pork' },
      { label: 'Camarão', value: 'shrimp' },
    ],
  },
  {
    label: 'Carboidratos',
    items: [
      { label: 'Arroz', value: 'rice' },
      { label: 'Batata doce', value: 'sweet_potato' },
      { label: 'Macarrão', value: 'pasta' },
      { label: 'Pão', value: 'bread' },
      { label: 'Aveia', value: 'oats' },
    ],
  },
  {
    label: 'Vegetais',
    items: [
      { label: 'Brócolis', value: 'broccoli' },
      { label: 'Espinafre', value: 'spinach' },
      { label: 'Abobrinha', value: 'zucchini' },
      { label: 'Beterraba', value: 'beet' },
    ],
  },
  {
    label: 'Frutas',
    items: [
      { label: 'Banana', value: 'banana' },
      { label: 'Abacate', value: 'avocado' },
      { label: 'Morango', value: 'strawberry' },
    ],
  },
  {
    label: 'Laticínios/Outros',
    items: [
      { label: 'Leite', value: 'milk' },
      { label: 'Queijo', value: 'cheese' },
      { label: 'Amendoim/Castanhas', value: 'nuts' },
    ],
  },
];

function getAutoExcluded(dietaryRestrictions) {
  const excluded = new Set();
  if (dietaryRestrictions.includes('vegan')) {
    ['chicken', 'red_meat', 'fish', 'egg', 'pork', 'shrimp', 'milk', 'cheese'].forEach((v) => excluded.add(v));
  }
  if (dietaryRestrictions.includes('vegetarian')) {
    ['chicken', 'red_meat', 'fish', 'pork', 'shrimp'].forEach((v) => excluded.add(v));
  }
  if (dietaryRestrictions.includes('lactose_intolerant')) {
    ['milk', 'cheese'].forEach((v) => excluded.add(v));
  }
  if (dietaryRestrictions.includes('seafood_allergy')) {
    ['fish', 'shrimp'].forEach((v) => excluded.add(v));
  }
  if (dietaryRestrictions.includes('peanut_allergy')) {
    excluded.add('nuts');
  }
  return excluded;
}

export default function FoodExclusionsScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const excluded = onboardingData.excludedFoods;
  const autoExcluded = useMemo(
    () => getAutoExcluded(onboardingData.dietaryRestrictions),
    [onboardingData.dietaryRestrictions]
  );

  function toggleFood(value) {
    if (autoExcluded.has(value)) return;
    if (excluded.includes(value)) {
      updateOnboarding('excludedFoods', excluded.filter((v) => v !== value));
    } else {
      updateOnboarding('excludedFoods', [...excluded, value]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Alimentos que você não come"
            subtitle="Toque pra excluir do seu plano"
          />
          {CATEGORIES.map((cat) => (
            <View key={cat.label}>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
              <View style={styles.chips}>
                {cat.items.map((item) => {
                  const isAuto = autoExcluded.has(item.value);
                  const isSelected = isAuto || excluded.includes(item.value);
                  return (
                    <MultiSelectChip
                      key={item.value}
                      label={item.label}
                      selected={isSelected}
                      onPress={() => toggleFood(item.value)}
                      disabled={isAuto}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
        <NavigationFooter
          currentStep={10}
          totalSteps={12}
          onNext={() => navigation.navigate('LegalDisclaimer')}
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
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.secondary,
    marginTop: 16,
    marginBottom: 8,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
