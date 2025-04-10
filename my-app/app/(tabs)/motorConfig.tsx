import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

// Reusable input component
const ConfigInput = ({ label, value, onValueChange, unit = "" }: any) => (
  <View>
    <Text style={styles.label}>{label} {unit ? `(${unit})` : ""}</Text>
    <View style={styles.inputRow}>
      <TextInput
        style={styles.input}
        placeholder="Nhập giá trị"
        placeholderTextColor="black"
        keyboardType="numeric"
        value={value}
        onChangeText={onValueChange}
      />
    </View>
  </View>
);

// Reusable result display component
const ResultDisplay = ({ label, value, unit = "" }: any) => (
  <View style={styles.resultContainer}>
    <Text style={styles.resultLabel}>{label}:</Text>
    <Text style={styles.resultValue}>{value} {unit}</Text>
  </View>
);

export default function TabMotorConfigurationScreen() {
  // === 1. Thông số tải và băng tải ===
  const [forceF, setForceF] = useState('');
  const [beltSpeed, setBeltSpeed] = useState('');
  const [drumDiameter, setDrumDiameter] = useState('');
  const [lifetimeYears, setLifetimeYears] = useState('');
  const [loadTimeRatioT1, setLoadTimeRatioT1] = useState('');
  const [loadTimeRatioT2, setLoadTimeRatioT2] = useState('');
  const [loadRatioT1, setLoadRatioT1] = useState('');
  const [loadRatioT2, setLoadRatioT2] = useState('');

  // === 2. Kết quả tính toán công suất và mô-men ===
  const [calculatedResults, setCalculatedResults] = useState({
    workingPower: 0,        // Công suất làm việc Plv
    equivalentPower: 0,     // Công suất tương đương Ptd
    systemEfficiency: 0,    // Hiệu suất hệ thống η
    requiredPower: 0,       // Công suất cần thiết Pct
    rotationSpeed: 0,       // Số vòng quay trục công tác nlv
    torque: 0,              // Mô-men xoắn T
    totalRatio: 0,          // Tỉ số truyền tổng cộng ut
    motorRpm: 0,            // Số vòng quay động cơ
  });

  // === Hiển thị/ẩn các phần ===
  const [showCalculations, setShowCalculations] = useState(false);
  const [showSection3, setShowSection3] = useState(false);
  const [showSection4, setShowSection4] = useState(false);
  const [showSection5, setShowSection5] = useState(false);

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

  // Tính toán kết quả khi thay đổi thông số đầu vào
  useEffect(() => {
    // Chỉ tính toán khi có đủ dữ liệu đầu vào
    if (forceF && beltSpeed && drumDiameter && loadTimeRatioT1 && loadTimeRatioT2 && loadRatioT1 && loadRatioT2) {
      calculateResults();
    }
  }, [forceF, beltSpeed, drumDiameter, loadTimeRatioT1, loadTimeRatioT2, loadRatioT1, loadRatioT2]);

  // Hàm tính toán kết quả
  const calculateResults = () => {
    try {
      // Chuyển đổi các giá trị đầu vào sang dạng số
      const F = parseFloat(forceF);        // Lực vòng trên băng tải (N)
      const v = parseFloat(beltSpeed);     // Vận tốc băng tải (m/s)
      const D = parseFloat(drumDiameter);  // Đường kính tang (mm)
      const t1 = parseFloat(loadTimeRatioT1);  // Thời gian t1 (s)
      const t2 = parseFloat(loadTimeRatioT2);  // Thời gian t2 (s)
      const T1_ratio = parseFloat(loadRatioT1); // Tỉ lệ T1/T
      const T2_ratio = parseFloat(loadRatioT2); // Tỉ lệ T2/T

      // 1. Tính công suất làm việc trên trục công tác (kW)
      const workingPower = (F * v) / 1000;

      // 2. Tính công suất tương đương (kW)
      const equivalentPower = workingPower * Math.sqrt(
        ((t1 * Math.pow(T1_ratio, 2)) + (t2 * Math.pow(T2_ratio, 2))) / (t1 + t2)
      );

      // 3. Tính hiệu suất chung của hệ thống
      // Giả định các hiệu suất thành phần
      const efficiency_chain = 0.96;       // Hiệu suất bộ truyền xích
      const efficiency_gear = 0.96;        // Hiệu suất bộ truyền bánh răng
      const efficiency_bearing = 0.992;    // Hiệu suất một cặp ổ lăn
      const efficiency_coupling = 1;       // Hiệu suất khớp nối

      // Hiệu suất tổng hợp
      const systemEfficiency = efficiency_chain * Math.pow(efficiency_gear, 2) * 
                              Math.pow(efficiency_bearing, 4) * efficiency_coupling;

      // 4. Tính công suất cần thiết (kW)
      const requiredPower = equivalentPower / systemEfficiency;

      // 5. Tính số vòng quay của trục công tác (vòng/phút)
      const rotationSpeed = (60000 * v) / (Math.PI * D);

      // 6. Tính mô-men xoắn trên trục công tác (N.mm)
      const torque = 9.55 * 1000000 * (workingPower / rotationSpeed);

      // 7. Giả định tỉ số truyền cho bộ truyền xích và hộp giảm tốc
      const ratio_chain = 2.56;            // Tỉ số truyền xích
      const ratio_gearbox = 18;            // Tỉ số truyền hộp giảm tốc
      const totalRatio = ratio_chain * ratio_gearbox;

      // 8. Tính số vòng quay cần thiết cho động cơ
      const motorRpm = rotationSpeed * totalRatio;

      // Cập nhật state với kết quả tính toán
      setCalculatedResults({
        workingPower: parseFloat(workingPower.toFixed(4)),
        equivalentPower: parseFloat(equivalentPower.toFixed(4)),
        systemEfficiency: parseFloat(systemEfficiency.toFixed(5)),
        requiredPower: parseFloat(requiredPower.toFixed(4)),
        rotationSpeed: parseFloat(rotationSpeed.toFixed(4)),
        torque: parseFloat(torque.toFixed(2)),
        totalRatio: parseFloat(totalRatio.toFixed(3)),
        motorRpm: parseFloat(motorRpm.toFixed(2)),
      });
    } catch (error) {
      Alert.alert("Lỗi tính toán", "Vui lòng kiểm tra lại dữ liệu đầu vào");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cấu hình Hộp Giảm Tốc</Text>

      {/* 1. Tải & băng tải */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Thông số tải và băng tải</Text>
        <ConfigInput label="Lực kéo băng tải, F" unit="N" value={forceF} onValueChange={setForceF} />
        <ConfigInput label="Vận tốc băng tải, v" unit="m/s" value={beltSpeed} onValueChange={setBeltSpeed} />
        <ConfigInput label="Đường kính tang, D" unit="mm" value={drumDiameter} onValueChange={setDrumDiameter} />
        <ConfigInput label="Thời gian phục vụ, L" unit="năm" value={lifetimeYears} onValueChange={setLifetimeYears} />
        <View style={styles.loadRatioContainer}>
          <Text style={styles.label}>Chế độ tải:</Text>
          <View style={styles.loadRatioRow}>
            <View style={styles.loadRatioInput}>
              <Text style={styles.smallLabel}>t₁ (s)</Text>
              <TextInput 
                style={styles.smallInput}
                keyboardType="numeric"
                value={loadTimeRatioT1}
                onChangeText={setLoadTimeRatioT1}
              />
            </View>
            <View style={styles.loadRatioInput}>
              <Text style={styles.smallLabel}>T₁/T</Text>
              <TextInput 
                style={styles.smallInput}
                keyboardType="numeric"
                value={loadRatioT1}
                onChangeText={setLoadRatioT1}
              />
            </View>
            <View style={styles.loadRatioInput}>
              <Text style={styles.smallLabel}>t₂ (s)</Text>
              <TextInput 
                style={styles.smallInput}
                keyboardType="numeric"
                value={loadTimeRatioT2}
                onChangeText={setLoadTimeRatioT2}
              />
            </View>
            <View style={styles.loadRatioInput}>
              <Text style={styles.smallLabel}>T₂/T</Text>
              <TextInput 
                style={styles.smallInput}
                keyboardType="numeric"
                value={loadRatioT2}
                onChangeText={setLoadRatioT2}
              />
            </View>
          </View>
        </View>
      </View>

      {/* 2. Tính toán công suất và mô-men */}
      <Pressable onPress={() => setShowCalculations(!showCalculations)}>
        <Text style={styles.sectionTitle}>2. Tính toán công suất và mô-men</Text>
      </Pressable>
      {showCalculations && (
        <View style={styles.section}>
          <ResultDisplay 
            label="Công suất làm việc (Plv)" 
            value={calculatedResults.workingPower} 
            unit="kW" 
          />
          <ResultDisplay 
            label="Công suất tương đương (Ptd)" 
            value={calculatedResults.equivalentPower} 
            unit="kW" 
          />
          <ResultDisplay 
            label="Hiệu suất hệ thống (η)" 
            value={calculatedResults.systemEfficiency} 
          />
          <ResultDisplay 
            label="Công suất cần thiết (Pct)" 
            value={calculatedResults.requiredPower} 
            unit="kW" 
          />
          <ResultDisplay 
            label="Số vòng quay trục công tác (nlv)" 
            value={calculatedResults.rotationSpeed} 
            unit="vg/ph" 
          />
          <ResultDisplay 
            label="Mô-men xoắn trục công tác (T)" 
            value={calculatedResults.torque} 
            unit="N.mm" 
          />
          <ResultDisplay 
            label="Tỉ số truyền tổng (ut)" 
            value={calculatedResults.totalRatio} 
          />
          <ResultDisplay 
            label="Tốc độ quay cần thiết động cơ" 
            value={calculatedResults.motorRpm} 
            unit="vg/ph" 
          />
          
          <View style={styles.motorSuggestion}>
            <Text style={styles.suggestionTitle}>Gợi ý động cơ:</Text>
            <Text style={styles.suggestionText}>
              Động cơ K160S4: 7,5 kW, 1450 vg/ph
            </Text>
          </View>
        </View>
      )}

      {/* 3. Tỉ số truyền */}
      <Pressable onPress={() => setShowSection3(!showSection3)}>
        <Text style={styles.sectionTitle}>3. Tỉ số truyền</Text>
      </Pressable>
      {showSection3 && (
        <View style={styles.section}>
          <ConfigInput label="Tỉ số truyền tổng (u_t)" value={totalRatio} onValueChange={setTotalRatio} />
          <ConfigInput label="Tỉ số truyền từng cấp" value={stageRatio} onValueChange={setStageRatio} />
          <ConfigInput label="Số răng chủ động (Z1)" value={z1} onValueChange={setZ1} />
          <ConfigInput label="Số răng bị động (Z2)" value={z2} onValueChange={setZ2} />
          <ConfigInput label="Số vòng quay trục ra (n_out)" value={nOut} onValueChange={setNOut} />
        </View>
      )}

      {/* 4. Kiểm nghiệm hộp giảm tốc */}
      <Pressable onPress={() => setShowSection4(!showSection4)}>
        <Text style={styles.sectionTitle}>4. Tính toán, kiểm nghiệm hộp giảm tốc</Text>
      </Pressable>
      {showSection4 && (
        <View style={styles.section}>
          <ConfigInput label="Mô-men xoắn trục 1 (T1)" value={t1} onValueChange={setT1} />
          <ConfigInput label="Mô-men xoắn trục 2 (T2)" value={t2} onValueChange={setT2} />
          <ConfigInput label="Công suất trục 1 (P1)" value={p1} onValueChange={setP1} />
          <ConfigInput label="Công suất trục 2 (P2)" value={p2} onValueChange={setP2} />
          <ConfigInput label="Hiệu suất truyền (η)" value={efficiency} onValueChange={setEfficiency} />
          <ConfigInput label="Hệ số quá tải" value={overloadFactor} onValueChange={setOverloadFactor} />
          <ConfigInput label="Tỉ lệ thời gian tải lớn/nhỏ" value={loadTimeRatio} onValueChange={setLoadTimeRatio} />
        </View>
      )}

      {/* 5. Bộ truyền hở */}
      <Pressable onPress={() => setShowSection5(!showSection5)}>
        <Text style={styles.sectionTitle}>5. Bộ truyền hở (xích, đai...)</Text>
      </Pressable>
      {showSection5 && (
        <View style={styles.section}>
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
      )}

      <Pressable 
        style={styles.recommendButton} 
        onPress={() => {
          // Tính toán trước khi chuyển trang
          calculateResults();
          router.push('/gearboxRecommendations');
        }}
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
  motorSuggestion: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  suggestionTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
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