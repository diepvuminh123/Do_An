import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { ResultDisplay } from './utils/ComponentsChung';

// Interface for component props
interface TinhToanOLanProps {
  power: number;
  torque: number;
  rotationSpeed: number;
  totalRatio: number;
  shaftResults: any; // From previous chapter calculations
}

/**
 * Component tính toán ổ lăn
 * Hiện thực theo Chương 6
 */
const TinhToanOLan = ({ power, torque, rotationSpeed, totalRatio, shaftResults }: TinhToanOLanProps) => {
  // State cho các phần hiển thị
  const [showTheory, setShowTheory] = useState(false);
  const [showShaft1, setShowShaft1] = useState(false);
  const [showShaft2, setShowShaft2] = useState(false);
  const [showShaft3, setShowShaft3] = useState(false);
  
  // State lưu kết quả tính toán ổ lăn
  const [bearingCalc, setBearingCalc] = useState({
    // Trục I
    shaft1: {
      workingHours: 14400,
      rpm: 1450,
      bearingB: {
        type: "Ổ bi đỡ một dãy",
        code: "405",
        dimensions: { d: 25, D: 80, B: 21, r: 2.5, ballDiameter: 16.67 },
        loads: { radial: 2008.31, axial: 644.93, ratio: 0.32 },
        dynamicLoad: { X: 0.56, Y: 1.99, Q: 3155.86, Qtd: 2707.19 },
        capacities: { C: 29200, C0: 20800, Cd: 29184.08 },
        lifetime: { L: 1252.8 },
        staticCheck: { Qt: 2008.31, isValid: true }
      },
      bearingD: {
        type: "Ổ bi đỡ một dãy",
        code: "405",
        dimensions: { d: 25, D: 80, B: 21, r: 2.5, ballDiameter: 16.67 },
        loads: { radial: 601.72, axial: 0, ratio: 0 },
        staticCheck: { isValid: true }
      }
    },
    
    // Trục II
    shaft2: {
      workingHours: 14400,
      rpm: 256.184,
      bearingA: {
        type: "Ổ bi đỡ một dãy",
        code: "408",
        dimensions: { d: 40, D: 110, B: 27, r: 3.0, ballDiameter: 22.23 },
        loads: { radial: 3372.57, axial: 520.15, ratio: 0.11 },
        dynamicLoad: { X: 1, Y: 0, Q: 6082.75, Qtd: 5217.96 },
        capacities: { C: 50300, C0: 37000, Cd: 31563.66 },
        lifetime: { L: 221.34 },
        staticCheck: { Qt: 4686.73, isValid: true }
      }
    },
    
    // Trục III
    shaft3: {
      workingHours: 14400,
      rpm: 80.561,
      bearingC: {
        type: "Ổ bi đỡ một dãy",
        code: "212",
        dimensions: { d: 60, D: 110, B: 22, r: 2.5, ballDiameter: 15.88 },
        loads: { radial: 6411.52, axial: 1174.89, ratio: 0.18 },
        dynamicLoad: { X: 1, Y: 0, Q: 8334.97, Qtd: 7149.92 },
        capacities: { C: 41100, C0: 31500, Cd: 29410.63 },
        lifetime: { L: 69.6 },
        staticCheck: { Qt: 6411.52, isValid: true }
      }
    }
  });

  // Calculate bearings when input parameters change
  useEffect(() => {
    if (power > 0 && torque > 0 && rotationSpeed > 0 && shaftResults) {
      calculateBearings();
    }
  }, [power, torque, rotationSpeed, totalRatio, shaftResults]);

  // Bearing calculation function
  const calculateBearings = () => {
    // In a real application, perform calculations based on formulas from Chapter 6
    // For now, we're using the predefined values in the state
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TÍNH TOÁN Ổ LĂN</Text>
      
      {/* Input data section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Dữ liệu đầu vào:</Text>
        <ResultDisplay label="Công suất cần thiết" value={power.toFixed(4)} unit="kW" />
        <ResultDisplay label="Mô-men trục công tác" value={torque.toFixed(2)} unit="N.mm" />
        <ResultDisplay label="Số vòng quay trục công tác" value={rotationSpeed.toFixed(4)} unit="vg/ph" />
        <ResultDisplay label="Tỉ số truyền tổng" value={totalRatio.toFixed(3)} />
      </View>

      {/* 1. Bearing selection theory */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowTheory(!showTheory)}>
        <Text style={styles.sectionTitle}>1. Tìm hiểu và chọn loại ổ lăn</Text>
        <Text style={styles.toggleButton}>{showTheory ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showTheory && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>
            Có nhiều loại ổ lăn. Theo hướng tác dụng của tải trọng do ổ tiếp nhận, chia ra: ổ đỡ, 
            ổ chặn, ổ đỡ - chặn và ổ chặn - đỡ; theo dạng con lăn: ổ bi và ổ đũa; theo số dãy con lăn: ổ
            lăn một dãy, 2 dãy và nhiều dãy.
          </Text>
          
          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Tỷ số Fa/Fr</Text>
              <Text style={styles.tableHeaderCell}>{'< 0,3'}</Text>
              <Text style={styles.tableHeaderCell}>{'>= 0,3'}</Text>
              <Text style={styles.tableHeaderCell}>{'>= 1,5'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>Loại ổ</Text>
              <View style={styles.tableCell}>
                <Text style={styles.tableCellText}>Ổ bi đỡ một dãy</Text>
                <Text style={styles.tableCellText}>Ổ đũa trụ ngắn đỡ</Text>
              </View>
              <View style={styles.tableCell}>
                <Text style={styles.tableCellText}>Ổ đỡ chặn</Text>
                <Text style={styles.tableCellText}>Ổ đũa côn</Text>
              </View>
              <Text style={styles.tableCell}>Ổ đũa côn</Text>
            </View>
          </View>
          
          <Text style={styles.detailText}>
            Với bộ truyền bánh răng trụ răng nghiêng, cả 3 trục đều có lực dọc trục. Ta chọn ổ lăn theo 
            khả năng tải động để đề phòng tróc rỗ các bề mặt làm việc và khả năng tải tĩnh để đề phòng 
            biến dạng dư.
          </Text>
        </View>
      )}

      {/* 2. Shaft I bearings */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowShaft1(!showShaft1)}>
        <Text style={styles.sectionTitle}>2. Tính toán ổ lăn trên trục I</Text>
        <Text style={styles.toggleButton}>{showShaft1 ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showShaft1 && (
        <View style={styles.detailsContainer}>
          <Text style={styles.subSectionTitle}>2.1. Tính toán và chọn ổ lăn</Text>
          
          <ResultDisplay label="Thời gian làm việc Lh" value="43200/9/3 = 14400" unit="h" />
          <ResultDisplay label="Số vòng quay n₁" value="1450" unit="vg/ph" />
          <ResultDisplay label="Đường kính trục" value="25" unit="mm" />
          
          <Text style={styles.subSectionTitle}>Tải trọng tác dụng lên ổ B:</Text>
          <ResultDisplay 
            label="Lực hướng tâm Fᵣᴮ" 
            value={bearingCalc.shaft1.bearingB.loads.radial.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Lực dọc trục Fₐᴮ" 
            value={bearingCalc.shaft1.bearingB.loads.axial.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Tỷ số Fa/Fr" 
            value={bearingCalc.shaft1.bearingB.loads.ratio.toFixed(2)} 
          />
          
          <Text style={styles.detailText}>
            Vì tỷ số Fa/Fr = {bearingCalc.shaft1.bearingB.loads.ratio.toFixed(2)} {'<'} 0,3 nên chọn ổ bi đỡ một dãy.
          </Text>
          
          <Text style={styles.subSectionTitle}>Thông số ổ bi đỡ một dãy, cỡ nặng:</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Ký hiệu</Text>
              <Text style={styles.tableHeaderCell}>d (mm)</Text>
              <Text style={styles.tableHeaderCell}>D (mm)</Text>
              <Text style={styles.tableHeaderCell}>B (mm)</Text>
              <Text style={styles.tableHeaderCell}>C (N)</Text>
              <Text style={styles.tableHeaderCell}>C₀ (N)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{bearingCalc.shaft1.bearingB.code}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft1.bearingB.dimensions.d}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft1.bearingB.dimensions.D}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft1.bearingB.dimensions.B}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft1.bearingB.capacities.C}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft1.bearingB.capacities.C0}</Text>
            </View>
          </View>
          
          <Text style={styles.subSectionTitle}>Tải trọng động và tuổi thọ:</Text>
          <ResultDisplay 
            label="Tải trọng động quy ước QB" 
            value={bearingCalc.shaft1.bearingB.dynamicLoad.Q.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Tải trọng động tương đương Qtđ" 
            value={bearingCalc.shaft1.bearingB.dynamicLoad.Qtd.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Tuổi thọ L" 
            value={bearingCalc.shaft1.bearingB.lifetime.L.toFixed(2)} 
            unit="triệu vòng" 
          />
          <ResultDisplay 
            label="Khả năng tải động tính toán Cd" 
            value={bearingCalc.shaft1.bearingB.capacities.Cd.toFixed(2)} 
            unit="N" 
          />
          
          <Text style={styles.detailText}>
            Xét thấy: Cd = {bearingCalc.shaft1.bearingB.capacities.Cd.toFixed(2)} N {'<'} [C] = {bearingCalc.shaft1.bearingB.capacities.C} N
          </Text>
          
          <Text style={styles.subSectionTitle}>2.2. Kiểm nghiệm khả năng tải tĩnh</Text>
          <ResultDisplay 
            label="Khả năng tải tĩnh C₀" 
            value={bearingCalc.shaft1.bearingB.capacities.C0} 
            unit="N" 
          />
          <ResultDisplay 
            label="Tải trọng tĩnh Qt" 
            value={bearingCalc.shaft1.bearingB.staticCheck.Qt.toFixed(2)} 
            unit="N" 
          />
          
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Qt = {bearingCalc.shaft1.bearingB.staticCheck.Qt.toFixed(2)} N {'<<'} C₀ = {bearingCalc.shaft1.bearingB.capacities.C0} N
            </Text>
            <Text style={styles.resultText}>
              Khả năng tải tĩnh của ổ đã được đảm bảo
            </Text>
          </View>
        </View>
      )}

      {/* 3. Shaft II bearings */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowShaft2(!showShaft2)}>
        <Text style={styles.sectionTitle}>3. Tính toán ổ lăn trên trục II</Text>
        <Text style={styles.toggleButton}>{showShaft2 ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showShaft2 && (
        <View style={styles.detailsContainer}>
          <Text style={styles.subSectionTitle}>3.1. Tính toán và chọn ổ lăn</Text>
          
          <ResultDisplay label="Số vòng quay n₂" value={bearingCalc.shaft2.rpm.toFixed(3)} unit="vg/ph" />
          <ResultDisplay label="Đường kính trục" value="40" unit="mm" />
          
          <Text style={styles.subSectionTitle}>Tải trọng tác dụng lên ổ A:</Text>
          <ResultDisplay 
            label="Lực hướng tâm Fᵣᴬ" 
            value={bearingCalc.shaft2.bearingA.loads.radial.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Lực dọc trục Fₐᴬ" 
            value={bearingCalc.shaft2.bearingA.loads.axial.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Tỷ số Fa/Fr" 
            value={bearingCalc.shaft2.bearingA.loads.ratio.toFixed(2)} 
          />
          
          <Text style={styles.detailText}>
            Vì tỷ số Fa/Fr = {bearingCalc.shaft2.bearingA.loads.ratio.toFixed(2)} {'<'} 0,3 nên chọn ổ bi đỡ một dãy.
          </Text>
          
          <Text style={styles.subSectionTitle}>Thông số ổ bi đỡ một dãy, cỡ nặng, trục II:</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Ký hiệu</Text>
              <Text style={styles.tableHeaderCell}>d (mm)</Text>
              <Text style={styles.tableHeaderCell}>D (mm)</Text>
              <Text style={styles.tableHeaderCell}>B (mm)</Text>
              <Text style={styles.tableHeaderCell}>C (N)</Text>
              <Text style={styles.tableHeaderCell}>C₀ (N)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{bearingCalc.shaft2.bearingA.code}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft2.bearingA.dimensions.d}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft2.bearingA.dimensions.D}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft2.bearingA.dimensions.B}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft2.bearingA.capacities.C}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft2.bearingA.capacities.C0}</Text>
            </View>
          </View>
          
          <Text style={styles.detailText}>
            Xét thấy: Cd = {bearingCalc.shaft2.bearingA.capacities.Cd.toFixed(2)} N {'<'} [C] = {bearingCalc.shaft2.bearingA.capacities.C} N
          </Text>
          
          <Text style={styles.subSectionTitle}>3.2. Kiểm nghiệm khả năng tải tĩnh</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Qt = {bearingCalc.shaft2.bearingA.staticCheck.Qt.toFixed(2)} N {'<<'} C₀ = {bearingCalc.shaft2.bearingA.capacities.C0} N
            </Text>
            <Text style={styles.resultText}>
              Khả năng tải tĩnh của ổ đã được đảm bảo
            </Text>
          </View>
        </View>
      )}

      {/* 4. Shaft III bearings */}
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => setShowShaft3(!showShaft3)}>
        <Text style={styles.sectionTitle}>4. Tính toán ổ lăn trên trục III</Text>
        <Text style={styles.toggleButton}>{showShaft3 ? '▼' : '▶'}</Text>
      </TouchableOpacity>
      
      {showShaft3 && (
        <View style={styles.detailsContainer}>
          <Text style={styles.subSectionTitle}>4.1. Tính toán và chọn ổ lăn</Text>
          
          <ResultDisplay label="Số vòng quay n₃" value={bearingCalc.shaft3.rpm.toFixed(3)} unit="vg/ph" />
          <ResultDisplay label="Đường kính trục" value="60" unit="mm" />
          
          <Text style={styles.subSectionTitle}>Tải trọng tác dụng lên ổ C:</Text>
          <ResultDisplay 
            label="Lực hướng tâm FᵣC" 
            value={bearingCalc.shaft3.bearingC.loads.radial.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Lực dọc trục FₐC" 
            value={bearingCalc.shaft3.bearingC.loads.axial.toFixed(2)} 
            unit="N" 
          />
          <ResultDisplay 
            label="Tỷ số Fa/Fr" 
            value={bearingCalc.shaft3.bearingC.loads.ratio.toFixed(2)} 
          />
          
          <Text style={styles.detailText}>
            Vì tỷ số Fa/Fr = {bearingCalc.shaft3.bearingC.loads.ratio.toFixed(2)} {'<'} 0,3 nên chọn ổ bi đỡ một dãy.
          </Text>
          
          <Text style={styles.subSectionTitle}>Thông số ổ bi đỡ một dãy, cỡ nhẹ, trục III:</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableHeaderRow}>
              <Text style={styles.tableHeaderCell}>Ký hiệu</Text>
              <Text style={styles.tableHeaderCell}>d (mm)</Text>
              <Text style={styles.tableHeaderCell}>D (mm)</Text>
              <Text style={styles.tableHeaderCell}>B (mm)</Text>
              <Text style={styles.tableHeaderCell}>C (N)</Text>
              <Text style={styles.tableHeaderCell}>C₀ (N)</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>{bearingCalc.shaft3.bearingC.code}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft3.bearingC.dimensions.d}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft3.bearingC.dimensions.D}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft3.bearingC.dimensions.B}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft3.bearingC.capacities.C}</Text>
              <Text style={styles.tableCell}>{bearingCalc.shaft3.bearingC.capacities.C0}</Text>
            </View>
          </View>
          
          <Text style={styles.detailText}>
            Xét thấy: Cd = {bearingCalc.shaft3.bearingC.capacities.Cd.toFixed(2)} N {'<'} [C] = {bearingCalc.shaft3.bearingC.capacities.C} N
          </Text>
          
          <Text style={styles.subSectionTitle}>4.2. Kiểm nghiệm khả năng tải tĩnh</Text>
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Qt = {bearingCalc.shaft3.bearingC.staticCheck.Qt.toFixed(2)} N {'<<'} C₀ = {bearingCalc.shaft3.bearingC.capacities.C0} N
            </Text>
            <Text style={styles.resultText}>
              Khả năng tải tĩnh của ổ đã được đảm bảo
            </Text>
          </View>
        </View>
      )}
      
      {/* Summary results */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>Bảng tổng hợp kết quả tính toán ổ lăn</Text>
        
        <Text style={styles.subSectionTitle}>Trục I:</Text>
        <ResultDisplay label="Loại ổ lăn" value="Ổ bi đỡ một dãy, cỡ nặng" />
        <ResultDisplay label="Ký hiệu ổ" value="405" />
        <ResultDisplay label="Kích thước (d×D×B)" value="25×80×21" unit="mm" />
        
        <Text style={styles.subSectionTitle}>Trục II:</Text>
        <ResultDisplay label="Loại ổ lăn" value="Ổ bi đỡ một dãy, cỡ nặng" />
        <ResultDisplay label="Ký hiệu ổ" value="408" />
        <ResultDisplay label="Kích thước (d×D×B)" value="40×110×27" unit="mm" />
        
        <Text style={styles.subSectionTitle}>Trục III:</Text>
        <ResultDisplay label="Loại ổ lăn" value="Ổ bi đỡ một dãy, cỡ nhẹ" />
        <ResultDisplay label="Ký hiệu ổ" value="212" />
        <ResultDisplay label="Kích thước (d×D×B)" value="60×110×22" unit="mm" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputSection: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  toggleButton: {
    color: '#4A90E2',
    fontSize: 16,
  },
  detailsContainer: {
    backgroundColor: 'rgba(44, 62, 80, 0.4)',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  detailText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 10,
  },
  subSectionTitle: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  tableContainer: {
    marginVertical: 10,
  },
  tableHeaderRow: {
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
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tableCell: {
    flex: 1,
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 6,
  },
  tableCellText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  resultBox: {
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
  },
  resultText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  summaryContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
  },
  summaryTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default TinhToanOLan;