import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';

function formatDate(date) {
  if (!date) return '';
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

export default function DatePickerField({ label, value, onChange, error }) {
  const [showPicker, setShowPicker] = useState(false);
  const selectedDate = value instanceof Date ? value : null;

  function handleChange(event, date) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && date) onChange(date);
    } else {
      if (date) onChange(date);
    }
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 14);
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 80);

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TouchableOpacity
        style={[styles.field, error && styles.fieldError]}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <Text style={selectedDate ? styles.valueText : styles.placeholder}>
          {selectedDate ? formatDate(selectedDate) : 'DD/MM/AAAA'}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Android: picker nativo em dialog */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={selectedDate || maxDate}
          mode="date"
          display="default"
          onChange={handleChange}
          maximumDate={maxDate}
          minimumDate={minDate}
        />
      )}

      {/* iOS: picker em modal */}
      {Platform.OS === 'ios' && (
        <Modal visible={showPicker} transparent animationType="slide">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Data de nascimento</Text>
                <TouchableOpacity onPress={() => setShowPicker(false)}>
                  <Text style={styles.modalDone}>Confirmar</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={selectedDate || maxDate}
                mode="date"
                display="spinner"
                onChange={handleChange}
                maximumDate={maxDate}
                minimumDate={minDate}
                locale="pt-BR"
              />
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    color: colors.neutral.secondary,
    marginBottom: 6,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.bg,
    borderWidth: 0.5,
    borderColor: colors.neutral.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  fieldError: {
    borderColor: colors.error.base,
  },
  valueText: {
    fontSize: 16,
    color: colors.neutral.primary,
  },
  placeholder: {
    fontSize: 16,
    color: colors.neutral.muted,
  },
  icon: {
    fontSize: 16,
  },
  error: {
    fontSize: 12,
    color: colors.error.base,
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalCard: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.neutral.primary,
  },
  modalDone: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary[500],
  },
});
