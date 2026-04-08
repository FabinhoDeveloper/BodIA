import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import ScreenHeader from '../../components/ScreenHeader';
import TextInputField from '../../components/TextInputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { isValidEmail, isValidPassword, isValidName, isValidDate } from '../../utils/validators';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [errors, setErrors] = useState({});

  function formatDate(text) {
    const digits = text.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
  }

  function validate() {
    const e = {};
    if (!isValidName(name)) e.name = 'Informe seu nome';
    if (!isValidEmail(email)) e.email = 'E-mail inválido';
    if (!isValidPassword(password)) e.password = 'Senha deve ter no mínimo 8 caracteres';
    if (!isValidDate(birthDate)) e.birthDate = 'Data inválida (DD/MM/AAAA)';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSignUp() {
    if (validate()) {
      Alert.alert('Conta criada!', 'Sua conta foi criada com sucesso.');
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <ScreenHeader title="Criar sua conta" subtitle="Pra salvar seu plano personalizado" />
            <TextInputField
              label="Nome completo"
              placeholder="Seu nome"
              value={name}
              onChangeText={setName}
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
            <TextInputField
              label="Data de nascimento"
              placeholder="DD/MM/AAAA"
              value={birthDate}
              onChangeText={(t) => setBirthDate(formatDate(t))}
              keyboardType="numeric"
              error={errors.birthDate}
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
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 },
  loginLink: { alignItems: 'center', marginTop: 20 },
  loginText: { fontSize: 14, color: colors.neutral.muted },
  loginHighlight: { color: colors.primary[500], fontWeight: '600' },
});
