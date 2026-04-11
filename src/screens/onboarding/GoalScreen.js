import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import SelectionCard from '../../components/SelectionCard';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const GOALS = [
  { icon: '↑', title: 'Ganhar massa', subtitle: 'Foco em hipertrofia', value: 'muscle_gain' },
  { icon: '—', title: 'Manter peso', subtitle: 'Equilíbrio e saúde', value: 'maintenance' },
  { icon: '↓', title: 'Perder gordura', subtitle: 'Definição corporal', value: 'fat_loss' },
];

export default function GoalScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();

  function handleNext() {
    navigation.navigate('PhysicalData');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Qual seu objetivo?"
            subtitle="Isso vai guiar seu plano personalizado"
          />
          {GOALS.map((g) => (
            <SelectionCard
              key={g.value}
              icon={g.icon}
              title={g.title}
              subtitle={g.subtitle}
              selected={onboardingData.goal === g.value}
              onPress={() => updateOnboarding('goal', g.value)}
            />
          ))}
        </ScrollView>
        <NavigationFooter
          currentStep={2}
          totalSteps={12}
          onNext={handleNext}
          onBack={() => navigation.goBack()}
          nextDisabled={!onboardingData.goal}
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
