import React, { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';

// Import components từ thư mục motorConfig
import ThongSoBangTai from '../motorConfig/ThongSoBangTai';
import TinhCongSuatMoment from '../motorConfig/TinhCongSuatMoment';
import TinhTiSoTruyen from '../motorConfig/TinhTiSoTruyen';
import KiemNghiemHopGiamToc from '../motorConfig/KiemNghiemHopGiamToc';
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

export default function TabMotorConfigurationScreen() {
  // === State quản lý trạng thái hiển thị các phần ===
  const [showCalculations, setShowCalculations] = useState(false);
  const [showSection3, setShowSection3] = useState(false);
  const [showSection4, setShowSection4] = useState(false);
  const [showSection5, setShowSection5] = useState(false);

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
    
    // Thực hiện tính toán nếu có đủ thông số đầu vào
    if (newThongSoTai.forceF && 
        newThongSoTai.beltSpeed && 
        newThongSoTai.drumDiameter && 
        newThongSoTai.loadTimeRatioT1 && 
        newThongSoTai.loadTimeRatioT2 && 
        newThongSoTai.loadRatioT1 && 
        newThongSoTai.loadRatioT2) {
      
      try {
        const ketQua = tinhToanYeuCauDongCo(newThongSoTai);
        setKetQuaTinhToan(ketQua);
      } catch (error) {
        Alert.alert("Lỗi tính toán", "Vui lòng kiểm tra lại dữ liệu đầu vào");
      }
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
  // === chuong 6 ===
  const [showSection6, setShowSection6] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cấu hình Hộp Giảm Tốc</Text>

      {/* 1. Phần Thông số tải và băng tải */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Thông số tải và băng tải</Text>
        <ThongSoBangTai
          thongSo={thongSoTai}
          onThongSoChange={handleThongSoTaiChange}
        />
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
      <Pressable onPress={() => setShowSection5(!showSection5)}>
        <Text style={styles.sectionTitle}>3. Tính toán thiết kế bộ truyền xích</Text>
      </Pressable>
      {showSection5 && (
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
    
      {/* 3. Phần Tỉ số truyền */}
      <Pressable onPress={() => setShowSection3(!showSection3)}>
        <Text style={styles.sectionTitle}>3. Tỉ số truyền</Text>
      </Pressable>
      {showSection3 && (
        <View style={styles.section}>
          <TinhTiSoTruyen 
            initialTotalRatio={ketQuaTinhToan.totalRatio}
          />
        </View>
      )}
  
      {/* 4. Phần Kiểm nghiệm hộp giảm tốc */}
      <Pressable onPress={() => setShowSection4(!showSection4)}>
        <Text style={styles.sectionTitle}>4. Tính toán, kiểm nghiệm hộp giảm tốc</Text>
      </Pressable>
      {showSection4 && (
        <View style={styles.section}>
          <KiemNghiemHopGiamToc 
            torque={ketQuaTinhToan.torque}
            rotationSpeed={ketQuaTinhToan.rotationSpeed}
            requiredPower={ketQuaTinhToan.requiredPower}
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