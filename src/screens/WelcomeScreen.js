import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import PrimaryButton from '../components/PrimaryButton';

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.center}>
          <Text style={styles.logo}>
            <Text style={styles.logoBlack}>Bod</Text>
            <Text style={styles.logoGreen}>IA</Text>
          </Text>
          <Text style={styles.subtitle}>Seu plano inteligente de treino e dieta</Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Começar"
            onPress={() => navigation.navigate('Onboarding', { screen: 'Name' })}
          />
          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
          >
            <Text style={styles.loginText}>Já tenho conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
  },
  logoBlack: {
    color: colors.neutral.primary,
  },
  logoGreen: {
    color: colors.primary[500],
  },
  subtitle: {
    fontSize: 14,
    color: colors.neutral.muted,
    marginTop: 8,
    textAlign: 'center',
  },
  actions: {
    gap: 12,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginText: {
    color: colors.primary[500],
    fontSize: 15,
    fontWeight: '500',
  },
});
