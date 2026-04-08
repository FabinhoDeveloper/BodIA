import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

export default function LegalDisclaimerScreen({ navigation }) {
  const { onboardingData, updateOnboarding } = useOnboarding();
  const accepted = onboardingData.legalAccepted;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader
            title="Aviso importante"
            subtitle="Leia com atenção antes de continuar"
          />
          <View style={styles.card}>
            <Text style={styles.text}>
              O BodIA oferece recomendações de treino e alimentação para fins informativos e educacionais.
              As sugestões geradas pelo aplicativo <Text style={styles.bold}>NÃO substituem</Text> a orientação
              de profissionais de saúde habilitados, como médicos, nutricionistas e educadores físicos.
            </Text>
            <Text style={[styles.text, { marginTop: 12 }]}>
              Consulte um profissional antes de iniciar qualquer programa de exercícios ou dieta,
              especialmente se você possui condições de saúde pré-existentes.
            </Text>
            <Text style={[styles.text, { marginTop: 12 }]}>
              Ao continuar, você declara que compreendeu e aceita estes termos.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkRow}
            onPress={() => updateOnboarding('legalAccepted', !accepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxActive]}>
              {accepted && <Text style={styles.checkMark}>✓</Text>}
            </View>
            <Text style={styles.checkLabel}>Li e aceito os termos de uso</Text>
          </TouchableOpacity>
        </ScrollView>
        <NavigationFooter
          currentStep={11}
          totalSteps={12}
          onNext={() => navigation.navigate('Summary')}
          onBack={() => navigation.goBack()}
          nextDisabled={!accepted}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56 },
  scroll: { flexGrow: 1 },
  card: {
    backgroundColor: colors.neutral.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  text: {
    fontSize: 14,
    color: colors.neutral.secondary,
    lineHeight: 22,
  },
  bold: {
    fontWeight: '700',
    color: colors.neutral.primary,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.neutral.border,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  checkMark: {
    color: colors.neutral.white,
    fontSize: 14,
    fontWeight: '700',
  },
  checkLabel: {
    fontSize: 14,
    color: colors.neutral.primary,
  },
});
