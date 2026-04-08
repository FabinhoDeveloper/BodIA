import 'react-native-gesture-handler';
import React from 'react';
import { OnboardingProvider } from './src/contexts/OnboardingContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <OnboardingProvider>
      <AppNavigator />
    </OnboardingProvider>
  );
}
