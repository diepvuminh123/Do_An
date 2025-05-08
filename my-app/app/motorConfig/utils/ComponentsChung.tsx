import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';

// Interface cho props của input thông thường
export interface ConfigInputProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  unit?: string;
  editable?: boolean;
}

// Component nhập liệu dùng chung
export const ConfigInput = ({ label, value, onValueChange, unit = "", editable = true }: ConfigInputProps) => (
  <View>
    <Text style={styles.label}>{label} {unit ? `(${unit})` : ""}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={[styles.input, !editable && styles.readonlyInput]}
        placeholder="Nhập giá trị"
        placeholderTextColor="black"
        keyboardType="numeric"
        value={value}
        onChangeText={onValueChange}
        editable={editable}
      />
    </View>
  </View>
);

// Interface cho props của hiển thị kết quả
export interface ResultDisplayProps {
  label: string;
  value: number | string;
  unit?: string;
  isPositive?: boolean;  // Để hiển thị màu xanh/đỏ cho các giá trị cần đánh giá
}

// Component hiển thị kết quả dùng chung
export const ResultDisplay = ({ label, value, unit = "", isPositive }: ResultDisplayProps) => (
  <View style={styles.resultContainer}>
    <Text style={styles.resultLabel}>{label}:</Text>
    <Text style={[
      styles.resultValue, 
      isPositive === true && styles.goodValue,
      isPositive === false && styles.badValue
    ]}>
      {value} {unit}
    </Text>
  </View>
);

// Styles dùng chung cho các component
const styles = StyleSheet.create({
  label: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    marginVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  readonlyInput: {
    backgroundColor: '#e0e0e0',
  },
  resultContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultLabel: {
    color: '#fff',
    fontSize: 14,
  },
  resultValue: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  goodValue: {
    color: '#4CD964',
  },
  badValue: {
    color: '#FF3B30',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  subSectionTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  calculateButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    marginVertical: 16,
  },
  calculateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  resultsTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  }
});

export default {
  ConfigInput,
  ResultDisplay,
  styles
};