import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
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
  { label: 'Nenhuma', value: 'none' },
];

export default function PhysicalRestrictionsScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const selected = onboardingData.physicalRestrictions;

  function toggleOption(value) {
    if (value === 'none') {
      updateOnboarding('physicalRestrictions', ['none']);
      return;
    }
    const without = selected.filter((v) => v !== 'none');
    if (without.includes(value)) {
      updateOnboarding('physicalRestrictions', without.filter((v) => v !== value));
    } else {
      updateOnboarding('physicalRestrictions', [...without, value]);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
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
          </View>
        </ScrollView>
        <NavigationFooter
          currentStep={7}
          totalSteps={12}
          onNext={() => navigation.navigate('DietStyle')}
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
