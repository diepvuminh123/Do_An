import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
  TouchableOpacity
} from 'react-native';

// Import components từ thư mục motorConfig
import ThongSoBangTai from '../motorConfig/ThongSoBangTai';
import TinhCongSuatMoment from '../motorConfig/TinhCongSuatMoment';
import BoTruyenXich from '../motorConfig/BoTruyenXich';
import ThietKeHopGiamToc from '../motorConfig/ThietKeHopGiamToc';
import TinhToanThietKeTruc from '../motorConfig/TinhToanThietKeTruc';
import TinhToanOLan from '../motorConfig/TinhToanOLan';

// Import hàm tính toán từ thư mục utils
import { tinhToanYeuCauDongCo } from '../motorConfig/utils/TinhToanUtils';

// Định nghĩa interface cho thông số tải
interface ThongSoTai {
  forceF: string;
  beltSpeed: string;
  drumDiameter: string;
  lifetimeYears: string;
  loadTimeRatioT1: string;
  loadTimeRatioT2: string;
  loadRatioT1: string;
  loadRatioT2: string;
}

// Định nghĩa interface cho kết quả tính toán
interface KetQuaTinhToan {
  workingPower: number;        // Công suất làm việc Plv
  equivalentPower: number;     // Công suất tương đương Ptd
  systemEfficiency: number;    // Hiệu suất hệ thống η
  requiredPower: number;       // Công suất cần thiết Pct
  rotationSpeed: number;       // Số vòng quay trục công tác nlv
  torque: number;              // Mô-men xoắn T
  totalRatio: number;          // Tỉ số truyền tổng cộng ut
  motorRpm: number;            // Số vòng quay động cơ
}

// Danh sách 7 phương án cố định
const predefinedOptions = [
  { id: 1, name: "Phương án 1", forceF: "8500", beltSpeed: "0.8", drumDiameter: "500", lifetimeYears: "10", loadTimeRatioT1: "20", loadTimeRatioT2: "48", loadRatioT1: "1", loadRatioT2: "0.6" },
  { id: 2, name: "Phương án 2", forceF: "7500", beltSpeed: "0.9", drumDiameter: "550", lifetimeYears: "8", loadTimeRatioT1: "36", loadTimeRatioT2: "15", loadRatioT1: "1", loadRatioT2: "0.5" },
  { id: 3, name: "Phương án 3", forceF: "8000", beltSpeed: "0.9", drumDiameter: "510", lifetimeYears: "9", loadTimeRatioT1: "36", loadTimeRatioT2: "15", loadRatioT1: "1", loadRatioT2: "0.8" },
  { id: 4, name: "Phương án 4", forceF: "8000", beltSpeed: "0.9", drumDiameter: "510", lifetimeYears: "9", loadTimeRatioT1: "36", loadTimeRatioT2: "15", loadRatioT1: "1", loadRatioT2: "0.8" },
  { id: 5, name: "Phương án 5", forceF: "8500", beltSpeed: "0.8", drumDiameter: "500", lifetimeYears: "10", loadTimeRatioT1: "20", loadTimeRatioT2: "48", loadRatioT1: "1", loadRatioT2: "0.6" },
  { id: 6, name: "Phương án 6", forceF: "7500", beltSpeed: "0.9", drumDiameter: "550", lifetimeYears: "8", loadTimeRatioT1: "36", loadTimeRatioT2: "15", loadRatioT1: "1", loadRatioT2: "0.5" },
  { id: 7, name: "Phương án 7", forceF: "8500", beltSpeed: "0.9", drumDiameter: "550", lifetimeYears: "8", loadTimeRatioT1: "36", loadTimeRatioT2: "15", loadRatioT1: "1", loadRatioT2: "0.5" },
];

export default function TabMotorConfigurationScreen() {
  // === State quản lý trạng thái hiển thị các phần ===
  const [showCalculations, setShowCalculations] = useState(false);
  const [showSection3, setShowSection3] = useState(false);
  const [showSection4, setShowSection4] = useState(false);
  const [showSection5, setShowSection5] = useState(false);
  const [showSection6, setShowSection6] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // === 1. State cho thông số tải ===
  const [thongSoTai, setThongSoTai] = useState<ThongSoTai>({
    forceF: '',
    beltSpeed: '',
    drumDiameter: '',
    lifetimeYears: '',
    loadTimeRatioT1: '',
    loadTimeRatioT2: '',
    loadRatioT1: '',
    loadRatioT2: '',
  });

  // === 2. State cho kết quả tính toán ===
  const [ketQuaTinhToan, setKetQuaTinhToan] = useState<KetQuaTinhToan>({
    workingPower: 0,        // Công suất làm việc Plv
    equivalentPower: 0,     // Công suất tương đương Ptd
    systemEfficiency: 0,    // Hiệu suất hệ thống η
    requiredPower: 0,       // Công suất cần thiết Pct
    rotationSpeed: 0,       // Số vòng quay trục công tác nlv
    torque: 0,              // Mô-men xoắn T
    totalRatio: 0,          // Tỉ số truyền tổng cộng ut
    motorRpm: 0,            // Số vòng quay động cơ
  });

  // === Hàm xử lý khi thay đổi thông số tải ===
  const handleThongSoTaiChange = (param: keyof ThongSoTai, value: string) => {
    const newThongSoTai = {
      ...thongSoTai,
      [param]: value
    };
    
    setThongSoTai(newThongSoTai);
  };

  // === Hàm chọn phương án ===
  const handleSelectOption = (optionId: number) => {
    setSelectedOption(optionId);
    const selectedPredefinedOption = predefinedOptions.find(option => option.id === optionId);
    
    if (selectedPredefinedOption) {
      setThongSoTai({
        forceF: selectedPredefinedOption.forceF,
        beltSpeed: selectedPredefinedOption.beltSpeed,
        drumDiameter: selectedPredefinedOption.drumDiameter,
        lifetimeYears: selectedPredefinedOption.lifetimeYears,
        loadTimeRatioT1: selectedPredefinedOption.loadTimeRatioT1,
        loadTimeRatioT2: selectedPredefinedOption.loadTimeRatioT2,
        loadRatioT1: selectedPredefinedOption.loadRatioT1,
        loadRatioT2: selectedPredefinedOption.loadRatioT2,
      });
    }
  };

  // === Hàm thực hiện tính toán ===
  const handleCalculate = () => {
    try {
      // Kiểm tra đủ dữ liệu đầu vào
      if (thongSoTai.forceF && 
          thongSoTai.beltSpeed && 
          thongSoTai.drumDiameter && 
          thongSoTai.loadTimeRatioT1 && 
          thongSoTai.loadTimeRatioT2 && 
          thongSoTai.loadRatioT1 && 
          thongSoTai.loadRatioT2) {
        
        const ketQua = tinhToanYeuCauDongCo(thongSoTai);
        setKetQuaTinhToan(ketQua);
        
        // Mở tất cả các phần tính toán
        setShowCalculations(true);
        setShowSection3(true);
        setShowSection4(true);
        setShowSection5(true);
        setShowSection6(true);
      } else {
        // Alert.alert("Thiếu dữ liệu", "Vui lòng điền đầy đủ thông số tải trước khi tính toán");
      }
    } catch (error) {
      Alert.alert("Lỗi tính toán", "Vui lòng kiểm tra lại dữ liệu đầu vào");
    }
  };

  // === Hàm xử lý khi nhấn nút tính toán và chuyển đến trang gợi ý ===
  const handleTinhToanVaGoiY = () => {
    try {
      // Tính toán lại để đảm bảo dữ liệu mới nhất
      const ketQua = tinhToanYeuCauDongCo(thongSoTai);
      setKetQuaTinhToan(ketQua);
      
      // Chuyển đến trang gợi ý với các tham số
      router.push({
        pathname: '/gearboxRecommendations',
        params: {
          requiredPower: ketQua.requiredPower,
          torque: ketQua.torque,
          rotationSpeed: ketQua.rotationSpeed,
          totalRatio: ketQua.totalRatio
        }
      });
    } catch (error) {
      Alert.alert("Lỗi tính toán", "Vui lòng kiểm tra lại dữ liệu đầu vào");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cấu hình Hộp Giảm Tốc</Text>

      {/* 1. Phần Thông số tải và băng tải */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Thông số tải và băng tải</Text>
        
        {/* Phần lựa chọn phương án tính toán */}
        <View style={styles.optionsContainer}>
          <Text style={styles.optionsTitle}>Lựa chọn phương án:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsScrollView}>
            {predefinedOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.optionButton,
                  selectedOption === option.id && styles.optionButtonSelected,
                ]}
                onPress={() => handleSelectOption(option.id)}
              >
                <Text style={[
                  styles.optionButtonText,
                  selectedOption === option.id && styles.optionButtonTextSelected,
                ]}>
                  {option.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <ThongSoBangTai
          thongSo={thongSoTai}
          onThongSoChange={handleThongSoTaiChange}
          onCalculatePress={handleCalculate}
        />
        
        {/* Nút tính toán */}
        <TouchableOpacity 
          style={styles.calculateButton} 
          onPress={handleCalculate}
        >
          <Text style={styles.calculateButtonText}>Tính toán</Text>
        </TouchableOpacity>
      </View>

      {/* 2. Phần Tính toán công suất và mô-men */}
      <Pressable onPress={() => setShowCalculations(!showCalculations)}>
        <Text style={styles.sectionTitle}>2. Tính toán công suất và mô-men</Text>
      </Pressable>
      {showCalculations && (
        <View style={styles.section}>
          <TinhCongSuatMoment ketQua={ketQuaTinhToan} />
        </View>
      )}

      {/* 3. Phần Bộ truyền xích */}
      <Pressable onPress={() => setShowSection3(!showSection3)}>
        <Text style={styles.sectionTitle}>3. Tính toán thiết kế bộ truyền xích</Text>
      </Pressable>
      {showSection3 && (
        <View style={styles.section}>
          <BoTruyenXich 
            power={ketQuaTinhToan.requiredPower}
            inputRpm={ketQuaTinhToan.motorRpm}
            outputRpm={ketQuaTinhToan.rotationSpeed}
          />
        </View>
      )}

      {/* 4. Phần Thiết kế bộ truyền trong hộp giảm tốc */}
      <Pressable onPress={() => setShowSection4(!showSection4)}>
        <Text style={styles.sectionTitle}>4. Thiết kế bộ truyền trong hộp giảm tốc</Text>
      </Pressable>
      {showSection4 && (
        <View style={styles.section}>
          <ThietKeHopGiamToc 
            power={ketQuaTinhToan.requiredPower}
            torque={ketQuaTinhToan.torque}
            rotationSpeed={ketQuaTinhToan.rotationSpeed}
            totalRatio={ketQuaTinhToan.totalRatio}
          />
        </View>
      )}

      {/* 5. Phần Tính toán thiết kế trục và then */}
      <Pressable onPress={() => setShowSection5(!showSection5)}>
        <Text style={styles.sectionTitle}>5. Tính toán thiết kế trục và then</Text>
      </Pressable>
      {showSection5 && (
        <View style={styles.section}>
          <TinhToanThietKeTruc 
            power={ketQuaTinhToan.requiredPower}
            torque={ketQuaTinhToan.torque}
            rotationSpeed={ketQuaTinhToan.rotationSpeed}
            totalRatio={ketQuaTinhToan.totalRatio}
          />
        </View>
      )}
      
      {/* 6. Phần Tính toán ổ lăn */}
      <Pressable onPress={() => setShowSection6(!showSection6)}>
        <Text style={styles.sectionTitle}>6. Tính toán ổ lăn</Text>
      </Pressable>
      {showSection6 && (
        <View style={styles.section}>
          <TinhToanOLan 
            power={ketQuaTinhToan.requiredPower}
            torque={ketQuaTinhToan.torque}
            rotationSpeed={ketQuaTinhToan.rotationSpeed}
            totalRatio={ketQuaTinhToan.totalRatio}
            shaftResults={null} // Có thể truyền kết quả từ TinhToanThietKeTruc nếu cần
          />
        </View>
      )}

      <Pressable 
        style={styles.recommendButton} 
        onPress={handleTinhToanVaGoiY}
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
  optionsContainer: {
    marginBottom: 20,
  },
  optionsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  optionsScrollView: {
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: 'rgba(44, 62, 80, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  optionButtonSelected: {
    backgroundColor: '#4A90E2',
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  optionButtonTextSelected: {
    fontWeight: '600',
  },
  calculateButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  calculateButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
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