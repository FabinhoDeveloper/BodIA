import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/ScreenHeader';
import SegmentedTabs from '../../components/main/SegmentedTabs';
import TrainingInfoBanner from '../../components/main/TrainingInfoBanner';
import ExerciseListItem from '../../components/main/ExerciseListItem';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

// TODO: integrar com API
const EXERCISES = [
  { number: 1, name: 'Supino reto com barra', sets: 4, repRange: '8-10', restSeconds: 90, completed: false },
  { number: 2, name: 'Supino inclinado com halteres', sets: 3, repRange: '10-12', restSeconds: 75, completed: false },
  { number: 3, name: 'Crucifixo na polia', sets: 3, repRange: '12-15', restSeconds: 60, completed: false },
  { number: 4, name: 'Tríceps pulley', sets: 3, repRange: '10-12', restSeconds: 60, completed: true },
  { number: 5, name: 'Tríceps francês', sets: 3, repRange: '10-12', restSeconds: 60, completed: false },
  { number: 6, name: 'Tríceps corda', sets: 3, repRange: '12-15', restSeconds: 45, completed: false },
];

export default function TrainingScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <ScreenHeader title="Treino" />
        </View>
        <View style={styles.content}>
          <SegmentedTabs
            tabs={['Hoje', 'Histórico']}
            activeIndex={activeTab}
            onTabPress={setActiveTab}
          />
          {activeTab === 0 ? (
            <View style={styles.todayContent}>
              <TrainingInfoBanner
                title="Peito e Tríceps"
                dayLabel="Dia B"
                info="6 exercícios · ~50 min · 14 séries totais"
              />
              <View style={styles.exerciseList}>
                {EXERCISES.map((ex) => (
                  <ExerciseListItem key={ex.number} {...ex} />
                ))}
              </View>
              <PrimaryButton
                title="Iniciar treino"
                onPress={() => console.log('start workout')}
              />
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>Seus treinos passados aparecerão aqui</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  scroll: { flexGrow: 1 },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  content: { paddingHorizontal: spacing.lg, gap: 12, paddingBottom: 104 },
  todayContent: { gap: 12 },
  exerciseList: { gap: 8 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: { fontSize: 14, color: colors.neutral.muted, textAlign: 'center' },
});
