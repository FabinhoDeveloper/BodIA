import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ProfileAvatar from '../../components/main/ProfileAvatar';
import ProfileStatsCard from '../../components/main/ProfileStatsCard';
import MenuSection from '../../components/main/MenuSection';
import MenuItem from '../../components/main/MenuItem';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

function UserIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="8" r="4" stroke={colors.neutral.secondary} strokeWidth={2} />
      <Path d="M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2" stroke={colors.neutral.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ActivityIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M22 12h-4l-3 9L9 3l-3 9H2" stroke={colors.neutral.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function BellIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke={colors.neutral.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function ShieldIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke={colors.neutral.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function LogoutIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" stroke={colors.error.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function TrashIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
      <Path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={colors.error.dark} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

function calculateAge(birthDate) {
  if (!birthDate) return null;
  const birth = birthDate instanceof Date ? birthDate : new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export default function ProfileScreen() {
  const { onboardingData } = useOnboarding();
  const name = onboardingData.name || 'Fábio';
  const weight = onboardingData.weight || '75';
  const height = onboardingData.height || '175';
  const age = calculateAge(onboardingData.birthDate) || 25;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <ProfileAvatar name={name} size={72} />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>bodiatcc@gmail.com</Text>
        </View>
        <View style={styles.content}>
          <ProfileStatsCard weight={weight} height={height} age={age} />
          <View style={styles.spacer} />
          <MenuSection title="Meus dados">
            <MenuItem icon={<UserIcon />} label="Editar perfil" onPress={() => console.log('edit profile')} />
            <MenuItem icon={<ActivityIcon />} label="Peso e medidas" onPress={() => console.log('weight measures')} isLast />
          </MenuSection>
          <MenuSection title="Configurações">
            <MenuItem icon={<BellIcon />} label="Notificações" onPress={() => console.log('notifications')} />
            <MenuItem icon={<ShieldIcon />} label="Privacidade" onPress={() => console.log('privacy')} isLast />
          </MenuSection>
          <MenuSection>
            <MenuItem icon={<LogoutIcon />} label="Sair" onPress={() => console.log('logout')} variant="danger" />
            <MenuItem icon={<TrashIcon />} label="Excluir conta" onPress={() => console.log('delete account')} variant="danger" isLast />
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
