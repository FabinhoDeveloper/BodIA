import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import TextInputField from '../../components/TextInputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { buildUserPayload, createUser } from '../../services/api';

export default function SignUpScreen({ route, navigation }) {
  const onboardingData = route.params?.onboardingData || {};

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (onboardingData.name) {
      setName(onboardingData.name);
    }
  }, [onboardingData.name]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Informe seu nome';
    if (!email.includes('@') || !email.includes('.')) e.email = 'E-mail inválido';
    if (password.length < 8) e.password = 'Senha deve ter no mínimo 8 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignUp() {
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = buildUserPayload(onboardingData, email.trim(), password);
      payload.nome = name.trim();

      console.log('[BodIA] Enviando para /user:', JSON.stringify(payload, null, 2));

      const response = await createUser(payload);

      console.log('[BodIA] Resposta do servidor:', JSON.stringify(response, null, 2));

      navigation.navigate('PlanLoading', {
        serverData: response.data,
      });
    } catch (error) {
      console.log('[BodIA] Erro:', error.message);

      let message;
      if (error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        message = 'Sem conexão com o servidor. Verifique sua internet.';
      } else if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        message = 'O servidor demorou para responder. Tente novamente.';
      } else {
        message = 'Erro ao criar conta. Tente novamente.';
      }

      console.log('[BodIA] Mensagem exibida:', message);
      Alert.alert('Erro', message);
    } finally {
      setLoading(false);
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
            <PrimaryButton
              title={loading ? 'Criando conta...' : 'Criar conta'}
              onPress={handleSignUp}
              disabled={loading}
            />
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
