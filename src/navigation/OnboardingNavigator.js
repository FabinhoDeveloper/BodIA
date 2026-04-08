import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NameScreen from '../screens/onboarding/NameScreen';
import GoalScreen from '../screens/onboarding/GoalScreen';
import PhysicalDataScreen from '../screens/onboarding/PhysicalDataScreen';
import ActivityLevelScreen from '../screens/onboarding/ActivityLevelScreen';
import ExperienceScreen from '../screens/onboarding/ExperienceScreen';
import TrainingDaysScreen from '../screens/onboarding/TrainingDaysScreen';
import PhysicalRestrictionsScreen from '../screens/onboarding/PhysicalRestrictionsScreen';
import DietStyleScreen from '../screens/onboarding/DietStyleScreen';
import DietaryRestrictionsScreen from '../screens/onboarding/DietaryRestrictionsScreen';
import FoodExclusionsScreen from '../screens/onboarding/FoodExclusionsScreen';
import LegalDisclaimerScreen from '../screens/onboarding/LegalDisclaimerScreen';
import SummaryScreen from '../screens/onboarding/SummaryScreen';

const Stack = createStackNavigator();

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Name" component={NameScreen} />
      <Stack.Screen name="Goal" component={GoalScreen} />
      <Stack.Screen name="PhysicalData" component={PhysicalDataScreen} />
      <Stack.Screen name="ActivityLevel" component={ActivityLevelScreen} />
      <Stack.Screen name="Experience" component={ExperienceScreen} />
      <Stack.Screen name="TrainingDays" component={TrainingDaysScreen} />
      <Stack.Screen name="PhysicalRestrictions" component={PhysicalRestrictionsScreen} />
      <Stack.Screen name="DietStyle" component={DietStyleScreen} />
      <Stack.Screen name="DietaryRestrictions" component={DietaryRestrictionsScreen} />
      <Stack.Screen name="FoodExclusions" component={FoodExclusionsScreen} />
      <Stack.Screen name="LegalDisclaimer" component={LegalDisclaimerScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
    </Stack.Navigator>
  );
}
