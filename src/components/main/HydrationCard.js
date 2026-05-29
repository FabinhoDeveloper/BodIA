import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Animated, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

function formatLiters(ml) {
  return (ml / 1000).toFixed(1).replace('.', ',');
}

function getMotivationalMessage(consumed, target) {
  if (consumed >= target) return 'Parabéns! Meta diária batida! 🎉';
  if (consumed >= target * 0.7) return 'Quase lá, continue assim! 💪';
  return 'Muito bem! Vamos lá! 💧';
}

export default function HydrationCard({ consumed, target, onAdd }) {
  const pct = Math.min(consumed / target, 1);

  const [showInput, setShowInput] = useState(false);
  const [customMl, setCustomMl] = useState('');
  const [toast, setToast] = useState(null);
  const toastOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!toast) return;
    Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]).start(() => {
      setToast(null);
    });
    return () => toastOpacity.setValue(0);
  }, [toast]);

  useEffect(() => {
    return () => toastOpacity.setValue(0);
  }, []);

  function handleAdd(ml) {
    const newConsumed = consumed + ml;
    setToast(getMotivationalMessage(newConsumed, target));
    onAdd(ml);
  }

  function handleCustomAdd() {
    const ml = parseInt(customMl, 10);
    if (!ml || ml <= 0) return;
    setCustomMl('');
    setShowInput(false);
    handleAdd(ml);
  }

  function handleCancel() {
    setCustomMl('');
    setShowInput(false);
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.label}>Hidratação</Text>
          <Text style={styles.value}>{formatLiters(consumed)} / {formatLiters(target)} L</Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(200)} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>+200</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(500)} activeOpacity={0.7}>
            <Text style={styles.addBtnText}>+500</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.addBtn, showInput && styles.addBtnActive]}
            onPress={() => setShowInput(!showInput)}
            activeOpacity={0.7}
          >
            <Text style={[styles.addBtnText, showInput && styles.addBtnTextActive]}>Registrar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showInput ? (
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={customMl}
            onChangeText={setCustomMl}
            placeholder="Digite os ml"
            placeholderTextColor={colors.neutral.muted}
            keyboardType="numeric"
            autoFocus
          />
          <TouchableOpacity style={styles.confirmBtn} onPress={handleCustomAdd} activeOpacity={0.7}>
            <Text style={styles.confirmBtnText}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.7}>
            <Text style={styles.cancelBtnText}>✕</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct * 100}%` }]} />
      </View>

      {toast ? (
        <Animated.View style={[styles.toast, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.neutral.white,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 14,
    padding: 14,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: { fontSize: 12, color: colors.neutral.muted },
  value: { fontSize: 16, fontWeight: '600', color: colors.neutral.primary, marginTop: 2 },
  btnRow: { flexDirection: 'row', gap: 4 },
  addBtn: {
    backgroundColor: colors.primary[50],
    borderWidth: 1,
    borderColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  addBtnActive: {
    backgroundColor: colors.primary[500],
  },
  addBtnText: { fontSize: 11, fontWeight: '600', color: colors.primary[900] },
  addBtnTextActive: { color: colors.neutral.white },
  inputRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.neutral.bg,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: colors.neutral.primary,
  },
  confirmBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: { fontSize: 16, color: colors.neutral.white, fontWeight: '600' },
  cancelBtn: {
    backgroundColor: colors.neutral.surface,
    borderRadius: 8,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: { fontSize: 14, color: colors.neutral.muted, fontWeight: '600' },
  barBg: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.neutral.border,
    overflow: 'hidden',
  },
  barFill: { height: 6, borderRadius: 3, backgroundColor: colors.primary[500] },
  toast: {
    marginTop: 10,
    backgroundColor: colors.success.light,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  toastText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.success.dark,
  },
});
