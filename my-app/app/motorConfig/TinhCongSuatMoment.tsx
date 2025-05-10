import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { ResultDisplay } from './utils/ComponentsChung';

// Interface cho kết quả tính toán
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

// Interface cho thông số động cơ được chọn
interface SelectedMotor {
  model: string;
  power: number;
  rpm: number;
  efficiency: number;
  powerFactor: number;
  torqueRatio: number;
  massKg: number;
  shaftDiameter?: number;
}

// Interface cho tỉ số truyền phân phối
interface DistributedRatios {
  ux: number;         // Tỉ số truyền xích
  u1: number;         // Tỉ số truyền hộp giảm tốc cấp 1
  u2: number;         // Tỉ số truyền hộp giảm tốc cấp 2
  uhop: number;       // Tỉ số truyền hộp giảm tốc tổng
  ut: number;         // Tỉ số truyền tổng
}

// Interface cho phương án tính toán cố định
interface PredefinedOption {
  id: number;
  name: string;
  forceF: number;
  beltSpeed: number;
  drumDiameter: number;
  lifetimeYears: number;
  loadTimeRatioT1: number;
  loadTimeRatioT2: number;
  loadRatioT1: number;
  loadRatioT2: number;
}

// Props cho component
interface TinhCongSuatMomentProps {
  ketQua: KetQuaTinhToan;
}

/**
 * Component hiển thị kết quả tính toán công suất và mô-men
 * Nâng cấp theo tính toán trong tài liệu "Chương 2"
 */
const TinhCongSuatMoment = ({ ketQua }: TinhCongSuatMomentProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showEfficiencyDetails, setShowEfficiencyDetails] = useState(false);
  const [showRatioDetails, setShowRatioDetails] = useState(false);
  const [showShaftDetails, setShowShaftDetails] = useState(false);
  const [selectedMotor, setSelectedMotor] = useState<SelectedMotor | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Danh sách 7 phương án cố định
  const predefinedOptions: PredefinedOption[] = [
    { id: 1, name: "Phương án 1", forceF: 8500, beltSpeed: 0.8, drumDiameter: 500, lifetimeYears: 10, loadTimeRatioT1: 20, loadTimeRatioT2: 48, loadRatioT1: 1, loadRatioT2: 0.6 },
    { id: 2, name: "Phương án 2", forceF: 7500, beltSpeed: 0.9, drumDiameter: 550, lifetimeYears: 8, loadTimeRatioT1: 36, loadTimeRatioT2: 15, loadRatioT1: 1, loadRatioT2: 0.5 },
    { id: 3, name: "Phương án 3", forceF: 8000, beltSpeed: 0.9, drumDiameter: 510, lifetimeYears: 9, loadTimeRatioT1: 36, loadTimeRatioT2: 15, loadRatioT1: 1, loadRatioT2: 0.8 },
    { id: 4, name: "Phương án 4", forceF: 8000, beltSpeed: 0.9, drumDiameter: 510, lifetimeYears: 9, loadTimeRatioT1: 36, loadTimeRatioT2: 15, loadRatioT1: 1, loadRatioT2: 0.8 },
    { id: 5, name: "Phương án 5", forceF: 8500, beltSpeed: 0.8, drumDiameter: 500, lifetimeYears: 10, loadTimeRatioT1: 20, loadTimeRatioT2: 48, loadRatioT1: 1, loadRatioT2: 0.6 },
    { id: 6, name: "Phương án 6", forceF: 7500, beltSpeed: 0.9, drumDiameter: 550, lifetimeYears: 8, loadTimeRatioT1: 36, loadTimeRatioT2: 15, loadRatioT1: 1, loadRatioT2: 0.5 },
    { id: 7, name: "Phương án 7", forceF: 8500, beltSpeed: 0.9, drumDiameter: 550, lifetimeYears: 8, loadTimeRatioT1: 36, loadTimeRatioT2: 15, loadRatioT1: 1, loadRatioT2: 0.5 },
  ];

  // Danh sách động cơ từ bảng trong PDF (bảng P1.1)
  const motorList: SelectedMotor[] = [
    { model: 'K90S4', power: 0.75, rpm: 1420, efficiency: 73.5, powerFactor: 0.76, torqueRatio: 2.1, massKg: 17, shaftDiameter: 22 },
    { model: 'K90L4', power: 1.1, rpm: 1420, efficiency: 77, powerFactor: 0.78, torqueRatio: 2.3, massKg: 20, shaftDiameter: 22 },
    { model: 'K100L4', power: 1.5, rpm: 1425, efficiency: 79, powerFactor: 0.8, torqueRatio: 2.3, massKg: 24, shaftDiameter: 28 },
    { model: 'K112S4', power: 2.2, rpm: 1440, efficiency: 81.5, powerFactor: 0.82, torqueRatio: 2.2, massKg: 35, shaftDiameter: 32 },
    { model: 'K112M4', power: 3, rpm: 1445, efficiency: 82, powerFactor: 0.83, torqueRatio: 2, massKg: 41, shaftDiameter: 32 },
    { model: 'K132S4', power: 4, rpm: 1445, efficiency: 85, powerFactor: 0.83, torqueRatio: 2, massKg: 58, shaftDiameter: 38 },
    { model: 'K132M4', power: 5.5, rpm: 1445, efficiency: 86, powerFactor: 0.86, torqueRatio: 2, massKg: 72, shaftDiameter: 42 },
    { model: 'K160S4', power: 7.5, rpm: 1450, efficiency: 87.5, powerFactor: 0.86, torqueRatio: 2.2, massKg: 94, shaftDiameter: 42 },
    { model: 'K160M4', power: 11, rpm: 1450, efficiency: 87.5, powerFactor: 0.87, torqueRatio: 1.6, massKg: 110, shaftDiameter: 42 },
    { model: 'K180M4', power: 15, rpm: 1450, efficiency: 87.5, powerFactor: 0.87, torqueRatio: 1.6, massKg: 159, shaftDiameter: 48 },
    { model: 'K180L4', power: 18.5, rpm: 1455, efficiency: 88, powerFactor: 0.88, torqueRatio: 2, massKg: 211, shaftDiameter: 48 },
    { model: 'K200M4', power: 22, rpm: 1475, efficiency: 89, powerFactor: 0.89, torqueRatio: 2, massKg: 251, shaftDiameter: 48 },
    { model: 'K200L4', power: 30, rpm: 1475, efficiency: 89, powerFactor: 0.89, torqueRatio: 2, massKg: 320, shaftDiameter: 48 },
  ];

  // Chọn động cơ phù hợp dựa trên công suất cần thiết và số vòng quay phù hợp
  useEffect(() => {
    // Chọn động cơ theo công suất cần thiết
    const chooseMotor = () => {
      // Lọc động cơ có công suất lớn hơn công suất cần thiết
      const suitableMotors = motorList.filter(motor => 
        motor.power >= ketQua.requiredPower && 
        Math.abs(motor.rpm - 1450) < 100  // Ưu tiên động cơ có tốc độ gần 1450 rpm
      );
      
      if (suitableMotors.length > 0) {
        // Chọn động cơ có công suất nhỏ nhất trong các động cơ phù hợp
        const chosenMotor = suitableMotors.reduce((prev, current) => 
          prev.power < current.power ? prev : current
        );
        setSelectedMotor(chosenMotor);
      } else {
        // Nếu không có động cơ phù hợp, chọn động cơ công suất lớn nhất
        setSelectedMotor(motorList[motorList.length - 1]);
      }
    };
    
    if (ketQua.requiredPower > 0) {
      chooseMotor();
    }
  }, [ketQua.requiredPower]);

  // Tính hiệu suất hệ thống chi tiết
  const calculateEfficiencyComponents = () => {
    // Các giá trị hiệu suất từ bảng trong PDF (bảng 2.3)
    const efficiency_chain = 0.96;        // Hiệu suất bộ truyền xích (bảng 2.3) - truyền đóng kín
    const efficiency_gear = 0.96;         // Hiệu suất bộ truyền bánh răng trụ (bảng 2.3) - truyền đóng kín
    const efficiency_bearing = 0.992;     // Hiệu suất một cặp ổ lăn (bảng 2.3)
    const efficiency_coupling = 1;        // Hiệu suất khớp nối

    // Công thức hiệu suất tổng (2.4) từ PDF: η = ηₓηᵦᵣ²η₀ₗ⁴η₍ₙ
    const totalEfficiency = efficiency_chain * Math.pow(efficiency_gear, 2) * 
                           Math.pow(efficiency_bearing, 4) * efficiency_coupling;

    return {
      chain: efficiency_chain,
      gear: efficiency_gear,
      bearing: efficiency_bearing,
      coupling: efficiency_coupling,
      total: totalEfficiency
    };
  };

  // Chi tiết hiệu suất
  const efficiencyDetails = calculateEfficiencyComponents();

  // Tính phân phối tỉ số truyền theo bảng 3.1
  const calculateTransmissionRatios = () => {
    // Tính toán từ công thức (3.23) như trong PDF
    const n_dc = selectedMotor ? selectedMotor.rpm : 1450;
    const n_lv = ketQua.rotationSpeed;
    const ut = n_dc / n_lv;
    
    // Áp dụng phương pháp phân phối như trang 29 của PDF
    const ux = 2.56;  // Tỉ số truyền xích (từ bảng 2.4)
    const uhop = ut / ux;
    
    // Xác định u1, u2 từ bảng 3.1 cho uhop ≈ 18
    // Với uhop ≈ 18: u1 = 5.66, u2 = 3.18 (Hộp giảm tốc khai triển)
    const u1 = 5.66;
    const u2 = 3.18;
    
    // Tính lại ux chính xác
    const ux_corrected = ut / (u1 * u2);
    
    return {
      ux: ux_corrected,
      u1: u1,
      u2: u2,
      uhop: u1 * u2,
      ut: ut
    };
  };

  // Thông tin chi tiết về tỉ số truyền
  const transmissionRatios = calculateTransmissionRatios();

  // Tính mô-men và số vòng quay trên các trục
  const calculateShaftsDetails = () => {
    // Lấy các giá trị tỉ số truyền
    const { ux, u1, u2 } = transmissionRatios;
    
    // Số vòng quay trên các trục
    const n_motor = selectedMotor ? selectedMotor.rpm : 1450;
    const n1 = n_motor;
    const n2 = n1 / u1;
    const n3 = n2 / u2;
    const n_ct = n3 / ux;
    
    // Công suất trên các trục (dựa vào công thức từ trang 30 của PDF)
    const P_ct = ketQua.workingPower;
    const P3 = P_ct / (efficiencyDetails.chain * efficiencyDetails.bearing);
    const P2 = P3 / (efficiencyDetails.bearing * efficiencyDetails.gear);
    const P1 = P2 / (efficiencyDetails.bearing * efficiencyDetails.gear);
    const P_motor = P1 / (efficiencyDetails.bearing * efficiencyDetails.coupling);
    
    // Mô-men trên các trục
    const T_ct = 9.55 * 1000000 * (P_ct / n_ct);
    const T3 = 9.55 * 1000000 * (P3 / n3);
    const T2 = 9.55 * 1000000 * (P2 / n2);
    const T1 = 9.55 * 1000000 * (P1 / n1);
    const T_motor = 9.55 * 1000000 * (P_motor / n_motor);
    
    return {
      rpm: { motor: n_motor, shaft1: n1, shaft2: n2, shaft3: n3, ct: n_ct },
      power: { motor: P_motor, shaft1: P1, shaft2: P2, shaft3: P3, ct: P_ct },
      torque: { motor: T_motor, shaft1: T1, shaft2: T2, shaft3: T3, ct: T_ct }
    };
  };

  // Thông tin chi tiết về các trục
  const shaftsDetails = calculateShaftsDetails();

  return (
    <View>

      {/* Kết quả tính toán chính */}
      <ResultDisplay 
        label="Công suất làm việc (Plv)" 
        value={ketQua.workingPower.toFixed(4)} 
        unit="kW" 
      />
      <ResultDisplay 
        label="Công suất tương đương (Ptd)" 
        value={ketQua.equivalentPower.toFixed(4)} 
        unit="kW" 
      />
      <ResultDisplay 
        label="Hiệu suất hệ thống (η)" 
        value={ketQua.systemEfficiency.toFixed(5)} 
      />
      <ResultDisplay 
        label="Công suất cần thiết (Pct)" 
        value={ketQua.requiredPower.toFixed(4)} 
        unit="kW" 
      />
      <ResultDisplay 
        label="Số vòng quay trục công tác (nlv)" 
        value={ketQua.rotationSpeed.toFixed(4)} 
        unit="vg/ph" 
      />
      <ResultDisplay 
        label="Mô-men xoắn trục công tác (T)" 
        value={ketQua.torque.toFixed(2)} 
        unit="N.mm" 
      />
      <ResultDisplay 
        label="Tỉ số truyền tổng (ut)" 
        value={transmissionRatios.ut.toFixed(3)} 
      />
      
      {selectedMotor && (
        <View style={styles.motorSuggestion}>
          <Text style={styles.suggestionTitle}>Gợi ý động cơ:</Text>
          <Text style={styles.suggestionText}>
            Động cơ {selectedMotor.model}: {selectedMotor.power} kW, {selectedMotor.rpm} vg/ph
          </Text>
          <Text style={styles.suggestionText}>
            Hiệu suất: {selectedMotor.efficiency}%, cos(φ): {selectedMotor.powerFactor}
          </Text>
          <Text style={styles.suggestionText}>
            Tk/Tn: {selectedMotor.torqueRatio}, Khối lượng: {selectedMotor.massKg} kg
          </Text>
          {selectedMotor.shaftDiameter && (
            <Text style={styles.suggestionText}>
              Đường kính trục: {selectedMotor.shaftDiameter} mm
            </Text>
          )}
        </View>
      )}

      {/* Button hiển thị chi tiết tính toán */}
      <Pressable 
        style={styles.detailsButton} 
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={styles.detailsButtonText}>
          {showDetails ? "Ẩn chi tiết tính toán" : "Hiển thị chi tiết tính toán"}
        </Text>
      </Pressable>

      {showDetails && (
        <ScrollView style={styles.detailsContainer}>
          {/* Chi tiết hiệu suất hệ thống */}
          <Pressable 
            style={styles.sectionHeader} 
            onPress={() => setShowEfficiencyDetails(!showEfficiencyDetails)}
          >
            <Text style={styles.sectionTitle}>Chi tiết hiệu suất hệ thống</Text>
            <Text style={styles.sectionToggle}>{showEfficiencyDetails ? "▼" : "▶"}</Text>
          </Pressable>
          
          {showEfficiencyDetails && (
            <View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hiệu suất bộ truyền xích (ηx):</Text>
                <Text style={styles.detailValue}>{efficiencyDetails.chain}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hiệu suất bộ truyền bánh răng (ηbr):</Text>
                <Text style={styles.detailValue}>{efficiencyDetails.gear}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hiệu suất một cặp ổ lăn (ηol):</Text>
                <Text style={styles.detailValue}>{efficiencyDetails.bearing}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hiệu suất khớp nối (ηkn):</Text>
                <Text style={styles.detailValue}>{efficiencyDetails.coupling}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Hiệu suất tổng (η = ηxηbr²ηol⁴ηkn):</Text>
                <Text style={styles.detailValue}>{efficiencyDetails.total.toFixed(5)}</Text>
              </View>
            </View>
          )}

          {/* Chi tiết tỉ số truyền */}
          <Pressable 
            style={styles.sectionHeader} 
            onPress={() => setShowRatioDetails(!showRatioDetails)}
          >
            <Text style={styles.sectionTitle}>Chi tiết tỉ số truyền</Text>
            <Text style={styles.sectionToggle}>{showRatioDetails ? "▼" : "▶"}</Text>
          </Pressable>
          
          {showRatioDetails && (
            <View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tỉ số truyền tổng (ut = nđc/nlv):</Text>
                <Text style={styles.detailValue}>{transmissionRatios.ut.toFixed(3)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tỉ số truyền hộp giảm tốc (uhop = u1×u2):</Text>
                <Text style={styles.detailValue}>{transmissionRatios.uhop.toFixed(3)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tỉ số truyền bộ truyền bánh răng cấp 1 (u1):</Text>
                <Text style={styles.detailValue}>{transmissionRatios.u1.toFixed(3)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tỉ số truyền bộ truyền bánh răng cấp 2 (u2):</Text>
                <Text style={styles.detailValue}>{transmissionRatios.u2.toFixed(3)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Tỉ số truyền bộ truyền xích (ux):</Text>
                <Text style={styles.detailValue}>{transmissionRatios.ux.toFixed(3)}</Text>
              </View>
            </View>
          )}

          {/* Chi tiết động học và động lực học các trục */}
          <Pressable 
            style={styles.sectionHeader} 
            onPress={() => setShowShaftDetails(!showShaftDetails)}
          >
            <Text style={styles.sectionTitle}>Thông số động học và động lực học các trục</Text>
            <Text style={styles.sectionToggle}>{showShaftDetails ? "▼" : "▶"}</Text>
          </Pressable>
          
          {showShaftDetails && (
            <View>
              <Text style={styles.subSectionTitle}>Số vòng quay (vg/ph)</Text>
              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderCell}>Trục động cơ</Text>
                <Text style={styles.tableHeaderCell}>Trục 1</Text>
                <Text style={styles.tableHeaderCell}>Trục 2</Text>
                <Text style={styles.tableHeaderCell}>Trục 3</Text>
                <Text style={styles.tableHeaderCell}>Trục CT</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{shaftsDetails.rpm.motor.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.rpm.shaft1.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.rpm.shaft2.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.rpm.shaft3.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.rpm.ct.toFixed(2)}</Text>
              </View>

              <Text style={styles.subSectionTitle}>Công suất (kW)</Text>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{shaftsDetails.power.motor.toFixed(4)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.power.shaft1.toFixed(4)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.power.shaft2.toFixed(4)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.power.shaft3.toFixed(4)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.power.ct.toFixed(4)}</Text>
              </View>

              <Text style={styles.subSectionTitle}>Mô-men xoắn (N.mm)</Text>
              <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{shaftsDetails.torque.motor.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.torque.shaft1.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.torque.shaft2.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.torque.shaft3.toFixed(2)}</Text>
                <Text style={styles.tableCell}>{shaftsDetails.torque.ct.toFixed(2)}</Text>
              </View>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    marginBottom: 16,
  },
  optionsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
    marginBottom: 4,
  },
  detailsButton: {
    backgroundColor: '#2C3E50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  detailsContainer: {
    backgroundColor: 'rgba(44, 62, 80, 0.4)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    maxHeight: 300,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 16,
  },
  sectionTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionToggle: {
    color: '#4A90E2',
    fontSize: 16,
  },
  subSectionTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 4,
  },
  detailLabel: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
    flex: 3,
  },
  detailValue: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 6,
    fontWeight: '600',
  },
  tableRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  tableCell: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 6,
  },
});

export default TinhCongSuatMoment;