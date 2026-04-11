import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import MultiSelectChip from '../../components/MultiSelectChip';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';
const OTHER_OPTION = 'other';

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
  const otherSelected = excluded.includes(OTHER_OPTION);
  const autoExcluded = useMemo(
    () => getAutoExcluded(onboardingData.dietaryRestrictions),
    [onboardingData.dietaryRestrictions]
  );

  function toggleFood(value) {
    if (autoExcluded.has(value)) return;
    if (excluded.includes(value)) {
      updateOnboarding('excludedFoods', excluded.filter((v) => v !== value));
      if (value === OTHER_OPTION) {
        updateOnboarding('excludedFoodsOther', '');
      }
    } else {
      updateOnboarding('excludedFoods', [...excluded, value]);
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
            <Text style={styles.categoryLabel}>Outro</Text>
            <View style={styles.chips}>
              <MultiSelectChip
                label="Outro"
                selected={otherSelected}
                onPress={() => toggleFood(OTHER_OPTION)}
              />
            </View>
            {otherSelected ? (
              <View style={styles.otherContainer}>
                <Text style={styles.otherLabel}>Qual alimento você quer excluir?</Text>
                <TextInput
                  style={styles.textArea}
                  value={onboardingData.excludedFoodsOther}
                  onChangeText={(value) => updateOnboarding('excludedFoodsOther', value)}
                  placeholder="Descreva o alimento ou ingrediente"
                  placeholderTextColor={colors.neutral.muted}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            ) : null}
          </ScrollView>
          <NavigationFooter
            currentStep={10}
            totalSteps={12}
            onNext={() => navigation.navigate('LegalDisclaimer')}
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
  otherContainer: {
    marginTop: 4,
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
