import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import PlanLoadingScreen from '../screens/auth/PlanLoadingScreen';
import PlanPreviewScreen from '../screens/main/PlanPreviewScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="PlanLoading" component={PlanLoadingScreen} />
      <Stack.Screen name="PlanPreview" component={PlanPreviewScreen} />
    </Stack.Navigator>
  );
}
