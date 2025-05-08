import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { ConfigInput } from './utils/ComponentsChung';

// Định nghĩa interface cho thông số tải
export interface ThongSoTai {
  forceF: string;
  beltSpeed: string;
  drumDiameter: string;
  lifetimeYears: string;
  loadTimeRatioT1: string;
  loadTimeRatioT2: string;
  loadRatioT1: string;
  loadRatioT2: string;
}

// Định nghĩa interface cho props của component
interface ThongSoBangTaiProps {
  thongSo: ThongSoTai;
  onThongSoChange: (param: keyof ThongSoTai, value: string) => void;
}

/**
 * Component nhập liệu thông số tải và băng tải
 */
const ThongSoBangTai = ({ thongSo, onThongSoChange }: ThongSoBangTaiProps) => {
  return (
    <View>
      <ConfigInput 
        label="Lực kéo băng tải, F" 
        unit="N" 
        value={thongSo.forceF} 
        onValueChange={(value) => onThongSoChange('forceF', value)} 
      />
      <ConfigInput 
        label="Vận tốc băng tải, v" 
        unit="m/s" 
        value={thongSo.beltSpeed} 
        onValueChange={(value) => onThongSoChange('beltSpeed', value)} 
      />
      <ConfigInput 
        label="Đường kính tang, D" 
        unit="mm" 
        value={thongSo.drumDiameter} 
        onValueChange={(value) => onThongSoChange('drumDiameter', value)} 
      />
      <ConfigInput 
        label="Thời gian phục vụ, L" 
        unit="năm" 
        value={thongSo.lifetimeYears} 
        onValueChange={(value) => onThongSoChange('lifetimeYears', value)} 
      />
      <View style={styles.loadRatioContainer}>
        <Text style={styles.label}>Chế độ tải:</Text>
        <View style={styles.loadRatioRow}>
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>t₁ (s)</Text>
            <TextInput 
              style={styles.smallInput}
              keyboardType="numeric"
              value={thongSo.loadTimeRatioT1}
              onChangeText={(value) => onThongSoChange('loadTimeRatioT1', value)}
            />
          </View>
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>T₁/T</Text>
            <TextInput 
              style={styles.smallInput}
              keyboardType="numeric"
              value={thongSo.loadRatioT1}
              onChangeText={(value) => onThongSoChange('loadRatioT1', value)}
            />
          </View>
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>t₂ (s)</Text>
            <TextInput 
              style={styles.smallInput}
              keyboardType="numeric"
              value={thongSo.loadTimeRatioT2}
              onChangeText={(value) => onThongSoChange('loadTimeRatioT2', value)}
            />
          </View>
          <View style={styles.loadRatioInput}>
            <Text style={styles.smallLabel}>T₂/T</Text>
            <TextInput 
              style={styles.smallInput}
              keyboardType="numeric"
              value={thongSo.loadRatioT2}
              onChangeText={(value) => onThongSoChange('loadRatioT2', value)}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    marginVertical: 8,
  },
  loadRatioContainer: {
    marginBottom: 12,
  },
  loadRatioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  loadRatioInput: {
    width: '22%',
  },
  smallLabel: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
    marginBottom: 4,
  },
  smallInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
  },
});

export default ThongSoBangTai;