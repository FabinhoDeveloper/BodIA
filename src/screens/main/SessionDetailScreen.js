import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import { fetchSessionDetail } from '../../services/api';
import SetRow from '../../components/main/SetRow';
import { colors } from '../../theme/colors';

export default function SessionDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { sessaoId, nome } = route.params || {};

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !sessaoId) return;
    let active = true;
    fetchSessionDetail(user.id, sessaoId)
      .then((res) => { if (active) setSession(res.data); })
      .catch((e) => console.log('[BodIA] Erro detalhe sessão:', e.message))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [user?.id, sessaoId]);

  const registros = session?.registros || [];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={colors.neutral.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{session?.nome || nome || 'Treino'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary[500]} style={styles.loading} />
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {registros.map((registro) => (
            <View key={registro.id} style={styles.exerciseCard}>
              <Text style={styles.exerciseName}>{registro.nome}</Text>
              {(registro.series || []).map((serie) => (
                <SetRow
                  key={serie.id}
                  numeroSerie={serie.numeroSerie}
                  repeticoes={serie.repeticoes}
                  carga={serie.carga}
                  readOnly
                />
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '600', color: colors.neutral.primary },
  headerSpacer: { width: 24 },
  loading: { paddingVertical: 48 },
  scroll: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 12 },
  exerciseCard: {
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 12,
    padding: 12,
  },
  exerciseName: { fontSize: 14, fontWeight: '600', color: colors.neutral.primary, marginBottom: 4 },
});
