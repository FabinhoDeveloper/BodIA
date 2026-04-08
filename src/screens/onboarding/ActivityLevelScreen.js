import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import SelectionCard from '../../components/SelectionCard';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const LEVELS = [
  { icon: '🪑', title: 'Sedentário', subtitle: 'Trabalho sentado, sem exercício', value: 'sedentary' },
  { icon: '🚶', title: 'Levemente ativo', subtitle: 'Exercício leve 1-3x/semana', value: 'lightly_active' },
  { icon: '🏃', title: 'Moderadamente ativo', subtitle: 'Exercício moderado 3-5x/semana', value: 'moderately_active' },
  { icon: '💪', title: 'Muito ativo', subtitle: 'Exercício intenso 6-7x/semana', value: 'very_active' },
  { icon: '🏋️', title: 'Extremamente ativo', subtitle: 'Atleta ou trabalho físico pesado', value: 'extremely_active' },
];

export default function ActivityLevelScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();

  function handleNext() {
    navigation.navigate('Experience');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Seu nível de atividade"
            subtitle="Como é sua rotina no dia a dia?"
          />
          {LEVELS.map((l) => (
            <SelectionCard
              key={l.value}
              icon={l.icon}
              title={l.title}
              subtitle={l.subtitle}
              selected={onboardingData.activityLevel === l.value}
              onPress={() => updateOnboarding('activityLevel', l.value)}
            />
          ))}
        </ScrollView>
        <NavigationFooter
          currentStep={4}
          totalSteps={12}
          onNext={handleNext}
          onBack={() => navigation.goBack()}
          nextDisabled={!onboardingData.activityLevel}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56 },
  scroll: { flexGrow: 1 },
});
