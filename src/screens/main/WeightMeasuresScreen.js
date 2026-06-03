import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchUserProfile,
  updateUser as updateUserApi,
  addWeight,
} from '../../services/api';
import NumericInputField from '../../components/NumericInputField';
import PrimaryButton from '../../components/PrimaryButton';
import { colors } from '../../theme/colors';

// Normaliza entrada numérica (aceita vírgula) e devolve número ou null
function parseNumber(value) {
  if (value == null || String(value).trim() === '') return null;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isNaN(parsed) ? null : parsed;
}

export default function WeightMeasuresScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [gordura, setGordura] = useState('');
  // valores carregados da API, para detectar o que mudou
  const [initial, setInitial] = useState({ peso: null, altura: null, gordura: null });

  useEffect(() => {
    if (!user?.id) return;
    fetchUserProfile(user.id)
      .then((response) => {
        const data = response.data;
        const loaded = {
          peso: data.pesoAtual ?? null,
          altura: data.altura ?? null,
          gordura: data.gorduraCorporal ?? null,
        };
        setInitial(loaded);
        setPeso(loaded.peso != null ? String(loaded.peso) : '');
        setAltura(loaded.altura != null ? String(loaded.altura) : '');
        setGordura(loaded.gordura != null ? String(loaded.gordura) : '');
      })
      .catch((error) => {
        const message =
          error.response?.data?.error || 'Não foi possível carregar seus dados.';
        Alert.alert('Erro', message);
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  async function handleSave() {
    if (!user?.id) return;

    const pesoNum = parseNumber(peso);
    const alturaNum = parseNumber(altura);
    const gorduraNum = parseNumber(gordura);

    if (peso.trim() !== '' && (pesoNum == null || pesoNum <= 0)) {
      return Alert.alert('Valor inválido', 'Informe um peso válido.');
    }
    if (altura.trim() !== '' && (alturaNum == null || alturaNum <= 0)) {
      return Alert.alert('Valor inválido', 'Informe uma altura válida.');
    }

    setSaving(true);
    try {
      // Peso vai para o histórico (HistoricoPeso) via endpoint próprio
      if (pesoNum != null && pesoNum !== initial.peso) {
        await addWeight(user.id, pesoNum);
      }

      // Altura e gordura ficam no Usuario
      const userPatch = {};
      if (alturaNum != null && alturaNum !== initial.altura) {
        userPatch.altura = alturaNum;
      }
      if (gorduraNum !== initial.gordura) {
        userPatch.gorduraCorporal = gorduraNum;
      }
      if (Object.keys(userPatch).length > 0) {
        await updateUserApi(user.id, userPatch);
      }

      navigation.goBack();
    } catch (error) {
      const message =
        error.response?.data?.error || 'Não foi possível salvar. Tente novamente.';
      Alert.alert('Erro', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="chevron-back" size={24} color={colors.neutral.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Peso e medidas</Text>
        <View style={styles.headerSpacer} />
      </View>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary[500]} />
        </View>
      ) : (
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scroll}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <NumericInputField
              label="Peso"
              unit="kg"
              placeholder="75"
              value={peso}
              onChangeText={setPeso}
            />
            <NumericInputField
              label="Altura"
              unit="cm"
              placeholder="175"
              value={altura}
              onChangeText={setAltura}
            />
            <NumericInputField
              label="Gordura corporal"
              unit="%"
              placeholder="18"
              optional
              value={gordura}
              onChangeText={setGordura}
            />
            <View style={styles.spacer} />
            <PrimaryButton title={saving ? 'Salvando...' : 'Salvar'} onPress={handleSave} disabled={saving} />
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.neutral.white },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 17, fontWeight: '600', color: colors.neutral.primary },
  headerSpacer: { width: 24 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 16, paddingBottom: 32 },
  spacer: { height: 8 },
});
