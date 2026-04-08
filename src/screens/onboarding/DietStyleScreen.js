import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import SelectionCard from '../../components/SelectionCard';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const OPTIONS = [
  { icon: '🏠', title: 'Comida caseira', subtitle: 'Arroz, feijão, carne, salada...', value: 'homemade' },
  { icon: '⏱️', title: 'Prática e rápida', subtitle: 'Marmitas, lanches, praticidade', value: 'practical' },
  { icon: '🎯', title: 'Dieta restritiva', subtitle: 'Frango, batata doce, ovo, brócolis...', value: 'strict' },
  { icon: '✔️', title: 'Flexível', subtitle: 'Como de tudo, sem frescura', value: 'flexible' },
];

export default function DietStyleScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Estilo de dieta"
            subtitle="Como você prefere se alimentar?"
          />
          {OPTIONS.map((opt) => (
            <SelectionCard
              key={opt.value}
              icon={opt.icon}
              title={opt.title}
              subtitle={opt.subtitle}
              selected={onboardingData.dietStyle === opt.value}
              onPress={() => updateOnboarding('dietStyle', opt.value)}
            />
          ))}
        </ScrollView>
        <NavigationFooter
          currentStep={8}
          totalSteps={12}
          onNext={() => navigation.navigate('DietaryRestrictions')}
          onBack={() => navigation.goBack()}
          nextDisabled={!onboardingData.dietStyle}
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
