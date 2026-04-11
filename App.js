import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { OnboardingProvider } from './src/contexts/OnboardingContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <OnboardingProvider>
        <AppNavigator />
      </OnboardingProvider>
    </SafeAreaProvider>
  );
}

// Comentario pra testar o git
