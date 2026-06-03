import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors } from '../../theme/colors';

function format(total) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Pílula compacta de descanso, exibida no canto superior esquerdo do exercício.
// Auto-inicia ao montar; o pai remonta (via prop `key`) a cada novo descanso.
export default function RestTimer({ seconds, onFinish }) {
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(intervalRef.current);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (remaining === 0) {
      const t = setTimeout(() => onFinish && onFinish(), 250);
      return () => clearTimeout(t);
    }
  }, [remaining]);

  return (
    <View style={styles.pill}>
      <Ionicons name="time-outline" size={14} color={colors.neutral.white} />
      <Text style={styles.time}>{format(remaining)}</Text>
      <TouchableOpacity onPress={() => setRemaining((r) => r + 15)} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <Text style={styles.action}>+15s</Text>
      </TouchableOpacity>
      <View style={styles.divider} />
      <TouchableOpacity onPress={() => onFinish && onFinish()} hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
        <Text style={styles.action}>Pular</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary[900],
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginBottom: 8,
  },
  time: { fontSize: 14, fontWeight: '700', color: colors.neutral.white, minWidth: 36 },
  action: { fontSize: 11, fontWeight: '600', color: colors.primary[200] },
  divider: { width: 1, height: 12, backgroundColor: 'rgba(255,255,255,0.3)' },
});
