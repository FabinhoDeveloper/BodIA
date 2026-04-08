import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

export default function SplashScreen({ navigation }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.delay(1200),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.replace('Welcome');
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ opacity }}>
        <Text style={styles.logo}>
          <Text style={styles.logoWhite}>Bod</Text>
          <Text style={styles.logoAccent}>IA</Text>
        </Text>
        <Text style={styles.tagline}>Seu plano inteligente de treino e dieta</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 52,
    fontWeight: '700',
    textAlign: 'center',
  },
  logoWhite: {
    color: colors.neutral.white,
  },
  logoAccent: {
    color: colors.accent[500],
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    marginTop: 8,
  },
});
