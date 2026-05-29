import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import TextInputField from '../../components/TextInputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      Alert.alert('Atenção', 'Preencha e-mail e senha');
      return;
    }

    setLoading(true);
    try {
      await signIn(email.trim(), password);
      navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] });
    } catch (error) {
      const message =
        error.response?.data?.error ||
        (error.code === 'ERR_NETWORK' || error.message?.includes('Network')
          ? 'Sem conexão com o servidor. Verifique sua internet.'
          : 'Erro ao entrar. Verifique suas credenciais.');

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
            <ScreenHeader title="Bem-vindo de volta" subtitle="Entre na sua conta" />
            <TextInputField
              label="E-mail"
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInputField
              label="Senha"
              placeholder="Sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              rightIcon={
                <Text style={[styles.eyeIcon, showPassword && styles.eyeIconActive]}>
                  👁
                </Text>
              }
              onRightIconPress={() => setShowPassword(!showPassword)}
              rightIconVisible={showPassword}
            />
            <PrimaryButton
              title={loading ? 'Entrando...' : 'Entrar'}
              onPress={handleLogin}
              disabled={loading}
            />
            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.linkText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signupText}>
                Não tem conta? <Text style={styles.linkHighlight}>Criar conta</Text>
              </Text>
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
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 },
  forgotLink: { alignItems: 'center', marginTop: 16 },
  signupLink: { alignItems: 'center', marginTop: 12 },
  linkText: { fontSize: 14, color: colors.primary[500], fontWeight: '500' },
  signupText: { fontSize: 14, color: colors.neutral.muted },
  linkHighlight: { color: colors.primary[500], fontWeight: '600' },
  eyeIcon: {
    fontSize: 20,
    color: colors.neutral.muted,
  },
  eyeIconActive: {
    color: colors.primary[500],
  },
});
