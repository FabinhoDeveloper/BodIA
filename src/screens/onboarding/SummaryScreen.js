import React from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useOnboarding } from '../../contexts/OnboardingContext';
import ScreenHeader from '../../components/ScreenHeader';
import NavigationFooter from '../../components/NavigationFooter';
import { colors } from '../../theme/colors';

const GOAL_LABELS = { muscle_gain: 'Ganhar massa', maintenance: 'Manter peso', fat_loss: 'Perder gordura' };
const SEX_LABELS = { M: 'Masculino', F: 'Feminino' };
const ACTIVITY_LABELS = {
  sedentary: 'Sedentário',
  lightly_active: 'Levemente ativo',
  moderately_active: 'Moderadamente ativo',
  very_active: 'Muito ativo',
  extremely_active: 'Extremamente ativo',
};
const EXPERIENCE_LABELS = { beginner: 'Iniciante', intermediate: 'Intermediário', advanced: 'Avançado' };
const DIET_LABELS = {
  homemade: 'Comida caseira',
  practical: 'Prática e rápida',
  strict: 'Dieta restritiva',
  flexible: 'Flexível',
};
const DIETARY_RESTRICTION_LABELS = {
  lactose_intolerant: 'Intolerância à lactose',
  gluten_free: 'Alergia a glúten',
  vegan: 'Vegano',
  vegetarian: 'Vegetariano',
  seafood_allergy: 'Alergia a frutos do mar',
  peanut_allergy: 'Alergia a amendoim',
};
const SPLIT_LABELS = {
  2: 'Full Body',
  3: 'Push/Pull/Legs',
  4: 'Upper/Lower',
  5: 'ABCDE',
  6: 'PPL x2',
};
const PHYSICAL_RESTRICTION_LABELS = {
  herniated_disc: 'Hérnia de disco',
  knee_injury: 'Lesão no joelho',
  shoulder_injury: 'Lesão no ombro',
  lower_back_pain: 'Dor lombar',
  tendinitis: 'Tendinite',
  wrist_injury: 'Lesão no punho',
};

function formatSelection(values, labels, otherValue, emptyLabel) {
  const baseValues = values.filter((value) => value !== 'none' && value !== 'other');
  const formatted = baseValues.map((value) => labels[value] || value);

  if (otherValue && otherValue.trim()) {
    formatted.push(otherValue.trim());
  }

  return formatted.length > 0 ? formatted.join(', ') : emptyLabel;
}

function SummaryRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
}

function SummarySection({ title, children, onEdit }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editBtn}>Editar</Text>
        </TouchableOpacity>
      </View>
      {children}
    </View>
  );
}

export default function SummaryScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const d = onboardingData;

  function handleGenerate() {
    Alert.alert('Sucesso!', 'Seu plano foi gerado com sucesso!');
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <ScreenHeader title="Tudo pronto!" subtitle="Confira seus dados antes de gerar o plano" />

          <SummarySection title="Objetivo" onEdit={() => navigation.navigate('Goal')}>
            <SummaryRow label="Objetivo" value={GOAL_LABELS[d.goal]} />
          </SummarySection>

          <SummarySection title="Dados físicos" onEdit={() => navigation.navigate('PhysicalData')}>
            <SummaryRow label="Sexo" value={SEX_LABELS[d.biologicalSex]} />
            <SummaryRow label="Peso" value={d.weight ? `${d.weight} kg` : null} />
            <SummaryRow label="Altura" value={d.height ? `${d.height} cm` : null} />
            <SummaryRow
              label="Nascimento"
              value={d.birthDate instanceof Date
                ? `${String(d.birthDate.getDate()).padStart(2,'0')}/${String(d.birthDate.getMonth()+1).padStart(2,'0')}/${d.birthDate.getFullYear()}`
                : null}
            />
            {d.bodyFatPercentage ? (
              <SummaryRow label="Gordura corporal" value={`${d.bodyFatPercentage}%`} />
            ) : null}
          </SummarySection>

          <SummarySection title="Treino" onEdit={() => navigation.navigate('ActivityLevel')}>
            <SummaryRow label="Nível de atividade" value={ACTIVITY_LABELS[d.activityLevel]} />
            <SummaryRow label="Experiência" value={EXPERIENCE_LABELS[d.experienceLevel]} />
            <SummaryRow label="Dias/semana" value={d.trainingDaysPerWeek ? `${d.trainingDaysPerWeek} dias` : null} />
            <SummaryRow label="Divisão sugerida" value={SPLIT_LABELS[d.trainingDaysPerWeek]} />
            <SummaryRow
              label="Restrições físicas"
              value={formatSelection(
                d.physicalRestrictions,
                PHYSICAL_RESTRICTION_LABELS,
                d.physicalRestrictionsOther,
                'Nenhuma'
              )}
            />
          </SummarySection>

          <SummarySection title="Alimentação" onEdit={() => navigation.navigate('DietStyle')}>
            <SummaryRow label="Estilo de dieta" value={DIET_LABELS[d.dietStyle]} />
            <SummaryRow
              label="Restrições"
              value={formatSelection(
                d.dietaryRestrictions,
                DIETARY_RESTRICTION_LABELS,
                d.dietaryRestrictionsOther,
                'Nenhuma'
              )}
            />
            <SummaryRow
              label="Excluídos"
              value={formatSelection(d.excludedFoods, {}, d.excludedFoodsOther, 'Nenhum')}
            />
          </SummarySection>
        </ScrollView>
        <NavigationFooter
          currentStep={12}
          totalSteps={12}
          onNext={handleGenerate}
          onBack={() => navigation.goBack()}
          nextLabel="Gerar meu plano"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 56 },
  scroll: { flexGrow: 1 },
  section: {
    backgroundColor: colors.neutral.bg,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.neutral.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  editBtn: {
    fontSize: 13,
    color: colors.primary[500],
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 13,
    color: colors.neutral.muted,
  },
  rowValue: {
    fontSize: 15,
    color: colors.neutral.primary,
    fontWeight: '500',
    flexShrink: 1,
    textAlign: 'right',
    marginLeft: 16,
  },
});
