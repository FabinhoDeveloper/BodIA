import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import ProfileAvatar from '../../components/main/ProfileAvatar';
import ProfileStatsCard from '../../components/main/ProfileStatsCard';
import MenuSection from '../../components/main/MenuSection';
import MenuItem from '../../components/main/MenuItem';
import { fetchUserProfile, deleteUser } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const navigation = useNavigation();

  const [profile, setProfile] = useState(null);

  // Recarrega o perfil sempre que a tela ganha foco (ex.: ao voltar das edições)
  useFocusEffect(
    useCallback(() => {
      if (!user?.id) return;
      let active = true;
      fetchUserProfile(user.id)
        .then((response) => {
          if (active && response.data) setProfile(response.data);
        })
        .catch((error) => {
          console.log('[BodIA] Erro ao carregar perfil:', error.message);
        });
      return () => {
        active = false;
      };
    }, [user?.id])
  );

  const name = profile?.nome || user?.nome || '';
  const email = profile?.email || user?.email || '';
  const weight = profile?.pesoAtual ?? '--';
  const height = profile?.altura ?? '--';
  const age = profile?.idade ?? '--';

  function resetToWelcome() {
    const root = navigation.getParent('Root') || navigation.getParent()?.getParent();
    root?.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  async function handleLogout() {
    await signOut();
    resetToWelcome();
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Excluir conta',
      'Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              if (user?.id) await deleteUser(user.id);
              await signOut();
              resetToWelcome();
            } catch (error) {
              const message =
                error.response?.data?.error || 'Não foi possível excluir a conta.';
              Alert.alert('Erro', message);
            }
          },
        },
      ]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <ProfileAvatar name={name} size={72} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <View style={styles.content}>
          <ProfileStatsCard weight={weight} height={height} age={age} />
          <View style={styles.spacer} />
          <MenuSection title="Meus dados">
            <MenuItem icon={<Ionicons name="person-outline" size={16} color={colors.neutral.secondary} />} label="Editar perfil" onPress={() => navigation.navigate('EditProfile')} />
            <MenuItem icon={<Ionicons name="barbell-outline" size={16} color={colors.neutral.secondary} />} label="Peso e medidas" onPress={() => navigation.navigate('WeightMeasures')} isLast />
          </MenuSection>
          <MenuSection title="Configurações">
            <MenuItem icon={<Ionicons name="notifications-outline" size={16} color={colors.neutral.secondary} />} label="Notificações" onPress={() => console.log('notifications')} />
            <MenuItem icon={<Ionicons name="shield-checkmark-outline" size={16} color={colors.neutral.secondary} />} label="Privacidade" onPress={() => console.log('privacy')} isLast />
          </MenuSection>
          <MenuSection>
            <MenuItem icon={<Ionicons name="log-out-outline" size={16} color={colors.error.dark} />} label="Sair" onPress={handleLogout} variant="danger" />
            <MenuItem icon={<Ionicons name="trash-outline" size={16} color={colors.error.dark} />} label="Excluir conta" onPress={handleDeleteAccount} variant="danger" isLast />
          </MenuSection>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  scroll: { flexGrow: 1, paddingBottom: 104 },
  avatarSection: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: spacing.lg,
  },
  name: { fontSize: 18, fontWeight: '600', color: colors.neutral.primary, marginTop: 10 },
  email: { fontSize: 12, color: colors.neutral.muted, marginTop: 2 },
  content: { paddingHorizontal: spacing.lg },
  spacer: { height: 16 },
});
