import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HomeScreen from '../screens/main/HomeScreen';
import DietScreen from '../screens/main/DietScreen';
import TrainingScreen from '../screens/main/TrainingScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 24,         // ← distância do fundo da tela
          marginHorizontal: 20,
          width: '90%',       // ← largura da barra — ajuste left junto se mudar este valor
          borderRadius: 28,
          borderTopWidth: 0,
          height: 64,
          paddingTop: 10,
          paddingBottom: 14,
          backgroundColor: colors.neutral.white,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 15,
          elevation: 5,
        },
        tabBarLabelStyle: { fontSize: 10 },
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.neutral.muted,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'home' : 'home-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Dieta"
        component={DietScreen}
        options={{
          tabBarLabel: 'Dieta',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="silverware-fork-knife"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Treino"
        component={TrainingScreen}
        options={{
          tabBarLabel: 'Treino',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="dumbbell"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'account' : 'account-outline'}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
