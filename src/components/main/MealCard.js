import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function MealCard({ mealType, icon, calories, time, foods, state, onPress, onRegister }) {
  const isActive = state === 'active';
  const isCompleted = state === 'completed';
  const subtitleText = time ? `${calories} kcal · ${time}` : `${calories} kcal`;

  return (
    <TouchableOpacity
      style={[styles.card, isActive && styles.cardActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
            <Text style={styles.iconText}>{icon}</Text>
          </View>
          <View>
            <Text style={styles.mealType}>{mealType}</Text>
            <Text style={styles.subtitle}>{subtitleText}</Text>
          </View>
        </View>
        {isCompleted && (
          <View style={styles.doneBadge}>
            <Text style={styles.doneBadgeText}>✓ Feito</Text>
          </View>
        )}
        {isActive && (
          <TouchableOpacity style={styles.registerBtn} onPress={onRegister} activeOpacity={0.7}>
            <Text style={styles.registerBtnText}>Registrar</Text>
          </TouchableOpacity>
        )}
      </View>
      {(isActive || isCompleted) && foods && foods.length > 0 && (
        <View style={styles.foodsContainer}>
          {foods.map((food, idx) => (
            <Text key={idx} style={styles.foodItem}>• {food}</Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
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
  cardActive: {
    borderWidth: 1.5,
    borderColor: colors.primary[500],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.neutral.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: colors.primary[500],
  },
  iconText: { fontSize: 16 },
  mealType: { fontSize: 14, fontWeight: '600', color: colors.neutral.primary },
  subtitle: { fontSize: 11, color: colors.neutral.muted, marginTop: 1 },
  doneBadge: {
    backgroundColor: colors.primary[50],
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  doneBadgeText: { fontSize: 11, fontWeight: '600', color: colors.primary[700] },
  registerBtn: {
    backgroundColor: colors.primary[500],
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  registerBtnText: { fontSize: 12, fontWeight: '600', color: colors.neutral.white },
  foodsContainer: { marginTop: 10, paddingLeft: 42 },
  foodItem: {
    fontSize: 12,
    color: colors.neutral.secondary,
    lineHeight: 20,
  },
});
