import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TrainingScreen from '../screens/main/TrainingScreen';
import ActiveSessionScreen from '../screens/main/ActiveSessionScreen';
import SessionDetailScreen from '../screens/main/SessionDetailScreen';

const Stack = createStackNavigator();

export default function TrainingStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TrainingMain" component={TrainingScreen} />
      <Stack.Screen name="ActiveSession" component={ActiveSessionScreen} />
      <Stack.Screen name="SessionDetail" component={SessionDetailScreen} />
    </Stack.Navigator>
  );
}
