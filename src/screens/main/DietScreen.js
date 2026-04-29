import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import DayTotalCard from '../../components/main/DayTotalCard';
import MealCard from '../../components/main/MealCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

function RefreshIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
      <Path d="M1 4v6h6" stroke={colors.neutral.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M23 20v-6h-6" stroke={colors.neutral.secondary} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <Path
        d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
        stroke={colors.neutral.secondary}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function getDateSubtitle() {
  const raw = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// TODO: integrar com API
const MEALS = [
  {
    mealType: 'Café da manhã',
    icon: '☀️',
    calories: 540,
    time: null,
    foods: ['3 ovos', '80g aveia', '1 banana', 'Café preto'],
    state: 'completed',
  },
  {
    mealType: 'Almoço',
    icon: '🍽️',
    calories: 720,
    time: 'agora',
    foods: ['150g frango', '150g arroz', 'Salada verde', '1 col azeite'],
    state: 'active',
  },
  {
    mealType: 'Lanche',
    icon: '🥜',
    calories: 380,
    time: '16h',
    foods: [],
    state: 'pending',
  },
  {
    mealType: 'Jantar',
    icon: '🌙',
    calories: 760,
    time: '20h',
    foods: [],
    state: 'pending',
  },
];

export default function DietScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Plano alimentar</Text>
            <Text style={styles.headerSubtitle}>{getDateSubtitle()}</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={() => console.log('regenerate')} activeOpacity={0.7}>
            <RefreshIcon />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <DayTotalCard totalCalories={2400} protein={150} carbs={300} fat={66} />
          {MEALS.map((meal) => (
            <MealCard
              key={meal.mealType}
              mealType={meal.mealType}
              icon={meal.icon}
              calories={meal.calories}
              time={meal.time}
              foods={meal.foods}
              state={meal.state}
              onPress={() => console.log('meal press', meal.mealType)}
              onRegister={() => console.log('register', meal.mealType)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  scroll: { flexGrow: 1 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    marginBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: '600', color: colors.neutral.primary },
  headerSubtitle: { fontSize: 14, color: colors.neutral.muted, marginTop: 4 },
  refreshBtn: { padding: 4, marginTop: 4 },
  content: { paddingHorizontal: spacing.lg, gap: 12, paddingBottom: 104 },
});
