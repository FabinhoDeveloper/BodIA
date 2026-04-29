import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { useOnboarding } from '../../contexts/OnboardingContext';
import HomeHeader from '../../components/main/HomeHeader';
import ActionCard from '../../components/main/ActionCard';
import CaloriesCard from '../../components/main/CaloriesCard';
import HydrationCard from '../../components/main/HydrationCard';
import TrainingTodayCard from '../../components/main/TrainingTodayCard';
import MiniStatCard from '../../components/main/MiniStatCard';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

function getNextAction() {
  const hour = new Date().getHours();
  if (hour < 10) return 'Hora do café da manhã';
  if (hour < 14) return 'Hora do almoço';
  if (hour < 18) return 'Hora do lanche';
  return 'Hora do jantar';
}

function FoodIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 3v18M5 8c0-3 3-5 7-5s7 2 7 5-3 5-7 5-7-2-7-5zM12 13c-5 0-7 3-7 6h14c0-3-2-6-7-6z"
        stroke={colors.neutral.white}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

// TODO: integrar com API
const MOCK_CALORIES = { consumed: 1240, target: 2400 };
const MOCK_MACROS = {
  protein: { consumed: 82, target: 150 },
  carbs: { consumed: 120, target: 300 },
  fat: { consumed: 43, target: 66 },
};
const MOCK_HYDRATION = { consumed: 1400, target: 2600 };
const MOCK_TRAINING = { title: 'Peito e Tríceps', exerciseCount: 6, estimatedMinutes: 50 };

export default function HomeScreen({ navigation }) {
  const { onboardingData } = useOnboarding();
  const userName = onboardingData.name || 'Fábio';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <HomeHeader userName={userName} />
        <View style={styles.content}>
          <ActionCard
            label="Próxima ação"
            title={getNextAction()}
            icon={<FoodIcon />}
            onPress={() => navigation.navigate('Dieta')}
          />
          <CaloriesCard
            consumed={MOCK_CALORIES.consumed}
            target={MOCK_CALORIES.target}
            protein={MOCK_MACROS.protein}
            carbs={MOCK_MACROS.carbs}
            fat={MOCK_MACROS.fat}
          />
          <HydrationCard
            consumed={MOCK_HYDRATION.consumed}
            target={MOCK_HYDRATION.target}
            onAdd={(ml) => console.log('add', ml)}
          />
          <TrainingTodayCard
            title={MOCK_TRAINING.title}
            exerciseCount={MOCK_TRAINING.exerciseCount}
            estimatedMinutes={MOCK_TRAINING.estimatedMinutes}
            onPress={() => navigation.navigate('Treino')}
          />
          <MiniStatCard
            label="Peso atual"
            value="75,0 kg"
            actionLabel="Atualizar"
            onActionPress={() => console.log('update weight')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  scroll: { flexGrow: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    gap: 12,
    paddingBottom: 104,
  },
});
