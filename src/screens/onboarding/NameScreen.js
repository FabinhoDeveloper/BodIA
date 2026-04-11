import React from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import TextInputField from '../../components/TextInputField';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

export default function NameScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();

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
              title="Como podemos te chamar?"
              subtitle="Seu plano vai ser personalizado pra você"
            />
            <TextInputField
              label="Nome"
              placeholder="Seu nome"
              value={onboardingData.name || ''}
              onChangeText={(v) => updateOnboarding('name', v)}
              autoCapitalize="words"
            />
          </ScrollView>
          <NavigationFooter
            currentStep={1}
            totalSteps={12}
            onNext={() => navigation.navigate('Goal')}
            onBack={() => navigation.navigate('Welcome')}
            nextDisabled={!onboardingData.name || onboardingData.name.trim().length === 0}
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
