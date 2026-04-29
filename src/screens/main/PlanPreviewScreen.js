import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SegmentedTabs from '../../components/main/SegmentedTabs';
import PrimaryButton from '../../components/PrimaryButton';
import SecondaryButton from '../../components/SecondaryButton';
import { colors } from '../../theme/colors';

const MOCK_PLAN = {
  calories: 2400,
  protein: 150,
  carbs: 300,
  fat: 66,
  meals: [
    { name: 'Café da manhã', time: '07h00', calories: 540,
      foods: ['3 ovos mexidos', '80g aveia com mel', '1 banana', 'Café preto'] },
    { name: 'Almoço', time: '12h30', calories: 720,
      foods: ['150g frango grelhado', '150g arroz branco', 'Salada verde à vontade', '1 col. sopa de azeite'] },
    { name: 'Lanche', time: '16h00', calories: 380,
      foods: ['2 fatias de pão integral', '2 ovos cozidos', '1 maçã'] },
    { name: 'Jantar', time: '20h00', calories: 760,
      foods: ['200g patinho moído', '150g batata doce', 'Brócolis refogado', 'Temperos naturais'] },
  ],
  training: {
    split: 'Push / Pull / Legs',
    daysPerWeek: 3,
    days: [
      {
        name: 'Dia A — Peito e Tríceps',
        exercises: [
          { name: 'Supino reto com barra', sets: 4, reps: '8–10', rest: '90s' },
          { name: 'Supino inclinado halteres', sets: 3, reps: '10–12', rest: '75s' },
          { name: 'Crucifixo na polia', sets: 3, reps: '12–15', rest: '60s' },
          { name: 'Tríceps pulley', sets: 3, reps: '10–12', rest: '60s' },
          { name: 'Tríceps francês', sets: 3, reps: '10–12', rest: '60s' },
        ],
      },
      {
        name: 'Dia B — Costas e Bíceps',
        exercises: [
          { name: 'Puxada frontal', sets: 4, reps: '8–10', rest: '90s' },
          { name: 'Remada curvada', sets: 3, reps: '10–12', rest: '75s' },
          { name: 'Rosca direta com barra', sets: 3, reps: '10–12', rest: '60s' },
          { name: 'Rosca martelo', sets: 3, reps: '12–15', rest: '60s' },
        ],
      },
      {
        name: 'Dia C — Pernas',
        exercises: [
          { name: 'Agachamento livre', sets: 4, reps: '8–10', rest: '120s' },
          { name: 'Leg press 45°', sets: 3, reps: '10–12', rest: '90s' },
          { name: 'Cadeira extensora', sets: 3, reps: '12–15', rest: '60s' },
          { name: 'Mesa flexora', sets: 3, reps: '12–15', rest: '60s' },
          { name: 'Panturrilha no Smith', sets: 4, reps: '15–20', rest: '45s' },
        ],
      },
    ],
  },
};

function formatCalories(value) {
  return value.toLocaleString('pt-BR');
}

function TrainingTab() {
  const { training } = MOCK_PLAN;
  return (
    <View>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Divisão: {training.split}</Text>
        <Text style={styles.summarySubtitle}>{training.daysPerWeek} dias por semana</Text>
      </View>
      {training.days.map((day) => (
        <View key={day.name} style={styles.whiteCard}>
          <Text style={styles.dayName}>{day.name}</Text>
          {day.exercises.map((ex, idx) => (
            <View key={ex.name}>
              <View style={styles.exerciseRow}>
                <Text style={styles.exerciseName}>{ex.name}</Text>
                <Text style={styles.exerciseMeta}>{`${ex.sets}x ${ex.reps} | ${ex.rest}`}</Text>
              </View>
              {idx < day.exercises.length - 1 ? <View style={styles.separator} /> : null}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

function DietTab() {
  return (
    <View>
      <View style={styles.totalsCard}>
        <Text style={styles.totalsCalories}>{`${formatCalories(MOCK_PLAN.calories)} kcal / dia`}</Text>
        <Text style={styles.totalsMacros}>
          {`Proteína: ${MOCK_PLAN.protein}g · Carboidrato: ${MOCK_PLAN.carbs}g · Gordura: ${MOCK_PLAN.fat}g`}
        </Text>
      </View>
      {MOCK_PLAN.meals.map((meal) => (
        <View key={meal.name} style={styles.whiteCard}>
          <View style={styles.mealHeader}>
            <Text style={styles.mealName}>{meal.name}</Text>
            <Text style={styles.mealMeta}>{`${meal.time} · ${meal.calories} kcal`}</Text>
          </View>
          {meal.foods.map((food) => (
            <Text key={food} style={styles.foodItem}>{`• ${food}`}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function PlanPreviewScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);

  function handleStart() {
    navigation.getParent()?.reset({ index: 0, routes: [{ name: 'Main' }] });
  }

  function handleRedo() {
    navigation.getParent()?.navigate('Onboarding', { screen: 'Summary' });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seu plano está pronto! 🎉</Text>
        <Text style={styles.headerSubtitle}>Gerado pela IA do BodIA</Text>
      </View>
      <View style={styles.tabsWrap}>
        <SegmentedTabs
          tabs={['Treino', 'Dieta']}
          activeIndex={activeTab}
          onTabPress={setActiveTab}
        />
      </View>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 0 ? <TrainingTab /> : <DietTab />}
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton title="Começar a usar o app" onPress={handleStart} />
        <SecondaryButton title="Refazer meu plano" onPress={handleRedo} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.bg },
  flex: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.neutral.primary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.neutral.muted,
    marginTop: 2,
  },
  tabsWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 180,
  },
  summaryCard: {
    backgroundColor: colors.neutral.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.neutral.primary,
  },
  summarySubtitle: {
    fontSize: 13,
    color: colors.neutral.muted,
    marginTop: 2,
  },
  whiteCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  dayName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.primary,
    marginBottom: 10,
  },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 13,
    color: colors.neutral.secondary,
    flex: 1,
  },
  exerciseMeta: {
    fontSize: 12,
    color: colors.neutral.muted,
    marginLeft: 8,
  },
  separator: {
    height: 0.5,
    backgroundColor: colors.neutral.border,
    marginVertical: 8,
  },
  totalsCard: {
    backgroundColor: colors.primary[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  totalsCalories: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary[500],
  },
  totalsMacros: {
    fontSize: 13,
    color: colors.neutral.secondary,
    marginTop: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  mealName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.neutral.primary,
  },
  mealMeta: {
    fontSize: 12,
    color: colors.neutral.muted,
  },
  foodItem: {
    fontSize: 13,
    color: colors.neutral.secondary,
    lineHeight: 20,
    marginTop: 6,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    gap: 10,
  },
});
