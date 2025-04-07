import React, { useState } from 'react';
import { router } from 'expo-router';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Reusable input component
const ConfigInput = ({ label, value, onValueChange }: any) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá trị"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={value}
        onChangeText={onValueChange}
      />
    </View>
  </View>
);

export default function TabMotorConfigurationScreen() {
  // === 1. Thông số tải và băng tải ===
  const [forceF, setForceF] = useState('');
  const [beltSpeed, setBeltSpeed] = useState('');
  const [drumDiameter, setDrumDiameter] = useState('');
  const [lifetimeYears, setLifetimeYears] = useState('');
  const [beltMass, setBeltMass] = useState('');

  // === 2. Thông số động cơ ===
  const [nIn, setNIn] = useState('');
  const [pIn, setPIn] = useState('');
  const [motorType, setMotorType] = useState('');
  const [motorModel, setMotorModel] = useState('');

  // === 3. Tỉ số truyền ===
  const [totalRatio, setTotalRatio] = useState('');
  const [stageRatio, setStageRatio] = useState('');
  const [z1, setZ1] = useState('');
  const [z2, setZ2] = useState('');
  const [nOut, setNOut] = useState('');

  // === 4. Thông số kiểm nghiệm hộp số ===
  const [t1, setT1] = useState('');
  const [t2, setT2] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [efficiency, setEfficiency] = useState('');
  const [overloadFactor, setOverloadFactor] = useState('');
  const [loadTimeRatio, setLoadTimeRatio] = useState('');

  // === 5. Bộ truyền hở ===
  const [chainPitch, setChainPitch] = useState('');
  const [chainTeeth, setChainTeeth] = useState('');
  const [shaftDistance, setShaftDistance] = useState('');
  const [beltType, setBeltType] = useState('');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cấu hình Hộp Giảm Tốc</Text>

      {/* 1. Tải & băng tải */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Thông số tải và băng tải</Text>
        <ConfigInput label="Lực kéo băng tải (F)" value={forceF} onValueChange={setForceF} />
        <ConfigInput label="Vận tốc băng tải (v)" value={beltSpeed} onValueChange={setBeltSpeed} />
        <ConfigInput label="Đường kính tang/puly (D)" value={drumDiameter} onValueChange={setDrumDiameter} />
        <ConfigInput label="Thời gian phục vụ (L)" value={lifetimeYears} onValueChange={setLifetimeYears} />
        <ConfigInput label="Khối lượng tải trọng" value={beltMass} onValueChange={setBeltMass} />
      </View>

      {/* 2. Động cơ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Thông số động cơ</Text>
        <ConfigInput label="Tốc độ đầu vào (n_in)" value={nIn} onValueChange={setNIn} />
        <ConfigInput label="Công suất đầu vào (P_in)" value={pIn} onValueChange={setPIn} />
        <Text style={styles.label}>Loại động cơ</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={motorType} onValueChange={setMotorType} style={styles.picker}>
            <Picker.Item label="Chọn loại động cơ" value="" />
            <Picker.Item label="Động cơ 3 pha" value="3phase" />
            <Picker.Item label="Động cơ 1 pha" value="1phase" />
            <Picker.Item label="Động cơ DC" value="dc" />
          </Picker>
        </View>
        <ConfigInput label="Kiểu động cơ (VD: K160S4...)" value={motorModel} onValueChange={setMotorModel} />
      </View>

      {/* 3. Tỉ số truyền */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Tỉ số truyền</Text>
        <ConfigInput label="Tỉ số truyền tổng (u_t)" value={totalRatio} onValueChange={setTotalRatio} />
        <ConfigInput label="Tỉ số truyền từng cấp" value={stageRatio} onValueChange={setStageRatio} />
        <ConfigInput label="Số răng chủ động (Z1)" value={z1} onValueChange={setZ1} />
        <ConfigInput label="Số răng bị động (Z2)" value={z2} onValueChange={setZ2} />
        <ConfigInput label="Số vòng quay trục ra (n_out)" value={nOut} onValueChange={setNOut} />
      </View>

      {/* 4. Kiểm nghiệm hộp giảm tốc */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Tính toán, kiểm nghiệm hộp giảm tốc</Text>
        <ConfigInput label="Mô-men xoắn trục 1 (T1)" value={t1} onValueChange={setT1} />
        <ConfigInput label="Mô-men xoắn trục 2 (T2)" value={t2} onValueChange={setT2} />
        <ConfigInput label="Công suất trục 1 (P1)" value={p1} onValueChange={setP1} />
        <ConfigInput label="Công suất trục 2 (P2)" value={p2} onValueChange={setP2} />
        <ConfigInput label="Hiệu suất truyền (η)" value={efficiency} onValueChange={setEfficiency} />
        <ConfigInput label="Hệ số quá tải" value={overloadFactor} onValueChange={setOverloadFactor} />
        <ConfigInput label="Tỉ lệ thời gian tải lớn/nhỏ" value={loadTimeRatio} onValueChange={setLoadTimeRatio} />
      </View>

      {/* 5. Bộ truyền hở */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Bộ truyền hở (xích, đai...)</Text>
        <ConfigInput label="Bước xích (p)" value={chainPitch} onValueChange={setChainPitch} />
        <ConfigInput label="Số răng đĩa xích" value={chainTeeth} onValueChange={setChainTeeth} />
        <ConfigInput label="Khoảng cách trục (a)" value={shaftDistance} onValueChange={setShaftDistance} />
        <Text style={styles.label}>Loại đai</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={beltType} onValueChange={setBeltType} style={styles.picker}>
            <Picker.Item label="Chọn loại đai" value="" />
            <Picker.Item label="Đai dẹt" value="flat" />
            <Picker.Item label="Đai thang" value="v" />
            <Picker.Item label="Đai răng" value="toothed" />
          </Picker>
        </View>
      </View>

      <Pressable
      style={styles.recommendButton}
      onPress={() => router.push('/gearboxRecommendations')}
    >
      <Text style={styles.recommendText}>Tính Toán / Gợi ý bộ truyền</Text>
    </Pressable>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#001627',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
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
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
  },
  picker: {
    height: 48,
    width: '100%',
  },
  recommendButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 40,
  },
  recommendText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
