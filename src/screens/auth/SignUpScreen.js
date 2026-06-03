import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import ScreenHeader from '../../components/ScreenHeader';
import TextInputField from '../../components/TextInputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

// Política de senha forte: 8+ caracteres, com maiúscula, minúscula e caractere especial.
// Retorna a mensagem do primeiro requisito não atendido, ou null se a senha for válida.
function getPasswordError(senha) {
  if (senha.length < 8) return 'Senha deve ter no mínimo 8 caracteres';
  if (!/[A-Z]/.test(senha)) return 'Inclua ao menos uma letra maiúscula';
  if (!/[a-z]/.test(senha)) return 'Inclua ao menos uma letra minúscula';
  if (!/[^A-Za-z0-9]/.test(senha)) return 'Inclua ao menos um caractere especial';
  return null;
}

export default function SignUpScreen({ route, navigation }) {
  const onboardingData = route.params?.onboardingData || {};
  const { signUp } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    const passwordError = getPasswordError(password);
    if (passwordError) e.password = passwordError;
    if (!confirmPassword) e.confirmPassword = 'Confirme sua senha';
    else if (confirmPassword !== password) e.confirmPassword = 'As senhas não conferem';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSignUp() {
    if (!validate()) return;

    setLoading(true);
    try {
      console.log('[BodIA] Enviando para /user:', JSON.stringify(onboardingData, null, 2));

      const serverData = await signUp(onboardingData, email.trim(), password, name.trim());

      console.log('[BodIA] Cadastro concluído com token');

      navigation.navigate('PlanLoading', {
        serverData,
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
              rightIcon={
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={showPassword ? colors.primary[500] : colors.neutral.muted}
                />
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
              rightIconVisible={showPassword}
            />
            {!errors.password ? (
              <Text style={styles.passwordHint}>
                Use 8+ caracteres, com letra maiúscula, minúscula e um caractere especial.
              </Text>
            ) : null}
            <TextInputField
              label="Confirmar senha"
              placeholder="Repita a senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoCapitalize="none"
              error={errors.confirmPassword}
              rightIcon={
                <Ionicons
                  name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={showConfirmPassword ? colors.primary[500] : colors.neutral.muted}
                />
              }
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
              rightIconVisible={showConfirmPassword}
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
  passwordHint: { fontSize: 12, color: colors.neutral.muted, marginTop: -8, marginBottom: 12 },
});
