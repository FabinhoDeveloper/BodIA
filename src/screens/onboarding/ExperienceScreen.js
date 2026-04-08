import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import SelectionCard from '../../components/SelectionCard';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const LEVELS = [
  { icon: '🌱', title: 'Iniciante', subtitle: 'Menos de 6 meses treinando', value: 'beginner' },
  { icon: '⚡', title: 'Intermediário', subtitle: '6 meses a 2 anos treinando', value: 'intermediate' },
  { icon: '🏆', title: 'Avançado', subtitle: 'Mais de 2 anos treinando', value: 'advanced' },
];

export default function ExperienceScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Experiência com treino"
            subtitle="Há quanto tempo você treina?"
          />
          {LEVELS.map((l) => (
            <SelectionCard
              key={l.value}
              icon={l.icon}
              title={l.title}
              subtitle={l.subtitle}
              selected={onboardingData.experienceLevel === l.value}
              onPress={() => updateOnboarding('experienceLevel', l.value)}
            />
          ))}
        </ScrollView>
        <NavigationFooter
          currentStep={5}
          totalSteps={12}
          onNext={() => navigation.navigate('TrainingDays')}
          onBack={() => navigation.goBack()}
          nextDisabled={!onboardingData.experienceLevel}
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
