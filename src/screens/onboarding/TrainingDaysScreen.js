import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const DAYS = [2, 3, 4, 5, 6];

export default function TrainingDaysScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const selected = onboardingData.trainingDaysPerWeek;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Dias de treino"
            subtitle="Quantos dias por semana você pode treinar?"
          />
          <View style={styles.daysRow}>
            {DAYS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.dayBtn, selected === d && styles.dayBtnActive]}
                onPress={() => updateOnboarding('trainingDaysPerWeek', d)}
                activeOpacity={0.8}
              >
                <Text style={[styles.dayText, selected === d && styles.dayTextActive]}>
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        <NavigationFooter
          currentStep={6}
          totalSteps={12}
          onNext={() => navigation.navigate('PhysicalRestrictions')}
          onBack={() => navigation.goBack()}
          nextDisabled={!selected}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56 },
  scroll: { flexGrow: 1 },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayBtn: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBtnActive: {
    backgroundColor: colors.primary[500],
  },
  dayText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.neutral.secondary,
  },
  dayTextActive: {
    color: colors.neutral.white,
  },
  description: {
    fontSize: 14,
    color: colors.neutral.secondary,
    textAlign: 'center',
    marginTop: 8,
  },
});
