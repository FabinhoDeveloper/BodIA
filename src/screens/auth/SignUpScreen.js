import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import TextInputField from '../../components/TextInputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Informe seu nome';
    if (!email.includes('@') || !email.includes('.')) e.email = 'E-mail inválido';
    if (password.length < 8) e.password = 'Senha deve ter no mínimo 8 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSignUp() {
    if (validate()) {
      navigation.navigate('PlanLoading');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <View style={styles.logoWrap}>
              <Text style={styles.logo}>
                <Text style={styles.logoBod}>Bod</Text>
                <Text style={styles.logoIA}>IA</Text>
              </Text>
            </View>
            <ScreenHeader title="Criar sua conta" subtitle="Seu plano está quase pronto" />
            <TextInputField
              label="Nome completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              error={errors.name}
            />
            <TextInputField
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <TextInputField
              label="Senha"
              placeholder="Mínimo 8 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.password}
            />
            <PrimaryButton title="Criar conta" onPress={handleSignUp} />
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginText}>Já tem conta? <Text style={styles.loginHighlight}>Entrar</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  logo: { fontSize: 32, fontWeight: '700' },
  logoBod: { color: colors.neutral.primary },
  logoIA: { color: colors.primary[500] },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: colors.neutral.muted },
  loginHighlight: { color: colors.primary[500], fontWeight: '600' },
});
