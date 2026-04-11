import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import ToggleSelector from '../../components/ToggleSelector';
import NumericInputField from '../../components/NumericInputField';
import DatePickerField from '../../components/DatePickerField';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';
import { isValidWeight, isValidHeight, isValidBodyFat } from '../../utils/validators';

const SEX_OPTIONS = [
  { label: 'Masculino', value: 'M' },
  { label: 'Feminino', value: 'F' },
];

export default function PhysicalDataScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!isValidWeight(onboardingData.weight)) e.weight = 'Peso inválido (30–300 kg)';
    if (!isValidHeight(onboardingData.height)) e.height = 'Altura inválida (100–250 cm)';
    if (!onboardingData.birthDate) e.birthDate = 'Informe sua data de nascimento';
    if (onboardingData.bodyFatPercentage && !isValidBodyFat(onboardingData.bodyFatPercentage)) {
      e.bodyFat = 'Gordura inválida (3–60%)';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleNext() {
    if (validate()) navigation.navigate('ActivityLevel');
  }

  const isComplete = onboardingData.biologicalSex && onboardingData.weight &&
    onboardingData.height && onboardingData.birthDate;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <ScreenHeader title="Seus dados físicos" subtitle="Precisamos disso pra calcular seu plano" />
            <ToggleSelector
              options={SEX_OPTIONS}
              value={onboardingData.biologicalSex}
              onChange={(v) => updateOnboarding('biologicalSex', v)}
            />
            <NumericInputField
              label="Peso"
              unit="kg"
              placeholder="75"
              value={onboardingData.weight}
              onChangeText={(v) => updateOnboarding('weight', v)}
              error={errors.weight}
            />
            <NumericInputField
              label="Altura"
              unit="cm"
              placeholder="175"
              value={onboardingData.height}
              onChangeText={(v) => updateOnboarding('height', v)}
              error={errors.height}
            />
            <DatePickerField
              label="Data de nascimento"
              value={onboardingData.birthDate}
              onChange={(date) => updateOnboarding('birthDate', date)}
              error={errors.birthDate}
            />
            <NumericInputField
              label="Gordura corporal"
              unit="%"
              placeholder="15"
              optional
              value={onboardingData.bodyFatPercentage}
              onChangeText={(v) => updateOnboarding('bodyFatPercentage', v)}
              error={errors.bodyFat}
            />
          </ScrollView>
          <NavigationFooter
            currentStep={3}
            totalSteps={12}
            onNext={handleNext}
            onBack={() => navigation.goBack()}
            nextDisabled={!isComplete}
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
});
