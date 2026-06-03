import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { updateUser as updateUserApi } from '../../services/api';
import TextInputField from '../../components/TextInputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUser: updateAuthUser } = useAuth();

  const [nome, setNome] = useState(user?.nome || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saving, setSaving] = useState(false);

  const trimmedNome = nome.trim();
  const trimmedEmail = email.trim();
  const canSave =
    !saving &&
    trimmedNome.length > 0 &&
    isValidEmail(trimmedEmail) &&
    (trimmedNome !== (user?.nome || '') || trimmedEmail !== (user?.email || ''));

  async function handleSave() {
    if (!user?.id) return;
    setSaving(true);
    try {
      await updateUserApi(user.id, { nome: trimmedNome, email: trimmedEmail });
      await updateAuthUser({ nome: trimmedNome, email: trimmedEmail });
      navigation.goBack();
    } catch (error) {
      const message =
        error.response?.data?.error || 'Não foi possível salvar. Tente novamente.';
      Alert.alert('Erro', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={colors.neutral.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Editar perfil</Text>
        <View style={styles.headerSpacer} />
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionLabel}>Dados pessoais</Text>
          <TextInputField
            label="Nome"
            placeholder="Seu nome"
            value={nome}
            onChangeText={setNome}
            autoCapitalize="words"
          />
          <TextInputField
            label="E-mail"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={styles.spacer} />
          <PrimaryButton title={saving ? 'Salvando...' : 'Salvar'} onPress={handleSave} disabled={!canSave} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.neutral.primary },
  headerSpacer: { width: 24 },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  sectionLabel: {
    fontSize: 12,
    color: colors.neutral.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  spacer: { height: 8 },
});
