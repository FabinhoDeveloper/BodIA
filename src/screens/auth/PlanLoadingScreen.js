import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';

const MESSAGES = [
  'Analisando seu perfil...',
  'Calculando suas necessidades calóricas...',
  'Montando seu plano de treino...',
  'Criando seu cardápio personalizado...',
  'Finalizando seu plano ✓',
];

export default function PlanLoadingScreen({ navigation }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timers = [];
    for (let i = 1; i < MESSAGES.length; i++) {
      timers.push(setTimeout(() => setIndex(i), i * 1000));
    }
    timers.push(
      setTimeout(() => navigation.replace('PlanPreview'), MESSAGES.length * 1000)
    );
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.logo}>
          <Text style={styles.logoBod}>Bod</Text>
          <Text style={styles.logoIA}>IA</Text>
        </Text>
        <Text style={styles.intro}>Nossa IA está gerando seu plano personalizado</Text>
        <Text style={styles.message}>{MESSAGES[index]}</Text>
        <View style={styles.dotsRow}>
          {MESSAGES.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: { fontSize: 32, fontWeight: '700', marginBottom: 48 },
  logoBod: { color: colors.neutral.primary },
  logoIA: { color: colors.primary[500] },
  intro: {
    fontSize: 14,
    color: colors.neutral.muted,
    textAlign: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.neutral.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: { backgroundColor: colors.primary[500] },
  dotInactive: { backgroundColor: colors.neutral.border },
});
