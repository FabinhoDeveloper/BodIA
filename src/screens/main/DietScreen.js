import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import DayTotalCard from '../../components/main/DayTotalCard';
import MealCard from '../../components/main/MealCard';
import { fetchDietToday, registerMeal, unregisterMeal } from '../../services/api';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

function getDateSubtitle() {
  const raw = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

// Escolhe um ícone a partir do nome da refeição (o backend não envia ícone)
function iconForMeal(nome) {
  const n = (nome || '').toLowerCase();
  if (n.includes('café') || n.includes('cafe') || n.includes('manhã') || n.includes('manha')) return 'weather-sunny';
  if (n.includes('almoço') || n.includes('almoco')) return 'silverware-fork-knife';
  if (n.includes('lanche')) return 'food-apple-outline';
  if (n.includes('jantar') || n.includes('noite') || n.includes('ceia')) return 'weather-night';
  return 'silverware-fork-knife';
}

// "150g Arroz integral" / "3 Ovos mexidos"
function formatFood(alimento) {
  const unidade = alimento.unidade === 'unidade' ? '' : alimento.unidade;
  const medida = unidade ? `${alimento.quantidade}${unidade}` : `${alimento.quantidade}`;
  return `${medida} ${alimento.nome}`;
}

export default function DietScreen() {
  const { user } = useAuth();
  const usuarioId = user?.id;

  const [plano, setPlano] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlano = useCallback(async () => {
    if (!usuarioId) return;
    try {
      const response = await fetchDietToday(usuarioId);
      setPlano(response.data);
    } catch (error) {
      console.log('[BodIA] Erro ao carregar plano alimentar:', error.message);
    }
  }, [usuarioId]);

  useEffect(() => {
    loadPlano();
  }, [loadPlano]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadPlano();
    setRefreshing(false);
  }, [loadPlano]);

  const handleRegister = useCallback(async (refeicaoId) => {
    if (!usuarioId) return;
    try {
      const response = await registerMeal(usuarioId, refeicaoId);
      setPlano(response.data);
    } catch (error) {
      console.log('[BodIA] Erro ao registrar refeição:', error.message);
    }
  }, [usuarioId]);

  const handleUndo = useCallback((refeicao) => {
    if (!usuarioId) return;
    Alert.alert(
      'Desfazer registro',
      `Remover o registro de "${refeicao.nome}" de hoje?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Desfazer',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await unregisterMeal(usuarioId, refeicao.id);
              setPlano(response.data);
            } catch (error) {
              console.log('[BodIA] Erro ao desfazer registro:', error.message);
            }
          },
        },
      ],
    );
  }, [usuarioId]);

  const refeicoes = plano?.refeicoes ?? [];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary[500]}
            colors={[colors.primary[500]]}
          />
        }
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Plano alimentar</Text>
            <Text style={styles.headerSubtitle}>{getDateSubtitle()}</Text>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={onRefresh} activeOpacity={0.7}>
            <Ionicons name="refresh" size={18} color={colors.neutral.secondary} />
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          <DayTotalCard
            totalCalories={Math.round(plano?.totalCalorias ?? 0)}
            protein={Math.round(plano?.totalProteinas ?? 0)}
            carbs={Math.round(plano?.totalCarboidratos ?? 0)}
            fat={Math.round(plano?.totalGorduras ?? 0)}
          />
          {refeicoes.map((refeicao) => (
            <MealCard
              key={refeicao.id}
              mealType={refeicao.nome}
              iconName={iconForMeal(refeicao.nome)}
              calories={Math.round(refeicao.calorias)}
              time={null}
              foods={refeicao.alimentos.map(formatFood)}
              state={refeicao.registradoHoje ? 'completed' : 'active'}
              onPress={() => refeicao.registradoHoje && handleUndo(refeicao)}
              onRegister={() => handleRegister(refeicao.id)}
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
