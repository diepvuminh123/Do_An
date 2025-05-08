import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ConfigInput } from './utils/ComponentsChung';

// Props cho component
interface TinhTiSoTruyenProps {
  initialTotalRatio?: number;
}

/**
 * Component tính toán và phân phối tỉ số truyền
 */
const TinhTiSoTruyen = ({ initialTotalRatio = 0 }: TinhTiSoTruyenProps) => {
  // State cho tỉ số truyền tổng và từng cấp
  const [totalRatio, setTotalRatio] = useState(initialTotalRatio > 0 ? initialTotalRatio.toString() : '');
  const [stageRatio, setStageRatio] = useState('');
  
  // State cho số răng bánh răng
  const [z1Stage1, setZ1Stage1] = useState('');
  const [z2Stage1, setZ2Stage1] = useState('');
  const [z1Stage2, setZ1Stage2] = useState('');
  const [z2Stage2, setZ2Stage2] = useState('');
  
  // State cho giá trị đã tính toán
  const [actualTotalRatio, setActualTotalRatio] = useState('');
  const [actualStage1Ratio, setActualStage1Ratio] = useState('');
  const [actualStage2Ratio, setActualStage2Ratio] = useState('');
  const [outputRpm, setOutputRpm] = useState('');
  
  // State cho RPM đầu vào
  const [inputRpm, setInputRpm] = useState('1450'); // RPM động cơ mặc định
  
  useEffect(() => {
    // Cập nhật totalRatio khi initialTotalRatio thay đổi
    if (initialTotalRatio > 0) {
      setTotalRatio(initialTotalRatio.toString());
    }
  }, [initialTotalRatio]);
  
  // Tính phân phối tỉ số truyền tối ưu
  const tinhPhanPhoiToiUu = () => {
    if (!totalRatio) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập tỉ số truyền tổng");
      return;
    }
    
    try {
      const ut = parseFloat(totalRatio);
      
      // Đối với hộp giảm tốc hai cấp, phân phối tối ưu là căn bậc hai của ut
      const optimalStageRatio = Math.sqrt(ut).toFixed(3);
      setStageRatio(optimalStageRatio);
      
      // Đề xuất số răng tiêu chuẩn
      deXuatSoRang(parseFloat(optimalStageRatio));
    } catch (error) {
      Alert.alert("Lỗi tính toán", "Vui lòng kiểm tra lại dữ liệu đầu vào");
    }
  };
  
  // Đề xuất số răng dựa trên tỉ số truyền cấp
  const deXuatSoRang = (stageRatio: number) => {
    // Chọn z1 từ 17-20 răng (tiêu chuẩn cho cấp đầu tiên)
    const z1 = 17;
    
    // Tính z2 dựa trên tỉ số truyền cấp
    const z2 = Math.round(z1 * stageRatio);
    
    // Cập nhật state
    setZ1Stage1(z1.toString());
    setZ2Stage1(z2.toString());
    
    // Đối với cấp thứ hai, sử dụng cách tiếp cận tương tự nhưng giá trị hơi khác
    const z1Second = 19;
    const z2Second = Math.round(z1Second * stageRatio);
    
    setZ1Stage2(z1Second.toString());
    setZ2Stage2(z2Second.toString());
    
    // Tính các tỉ số truyền thực tế
    tinhTiSoTruyenThucTe(z1, z2, z1Second, z2Second);
  };
  
  // Tính các tỉ số truyền thực tế dựa trên số răng đã chọn
  const tinhTiSoTruyenThucTe = (z1s1: number, z2s1: number, z1s2: number, z2s2: number) => {
    const stage1Ratio = z2s1 / z1s1;
    const stage2Ratio = z2s2 / z1s2;
    const total = stage1Ratio * stage2Ratio;
    
    setActualStage1Ratio(stage1Ratio.toFixed(3));
    setActualStage2Ratio(stage2Ratio.toFixed(3));
    setActualTotalRatio(total.toFixed(3));
    
    // Tính RPM đầu ra nếu có RPM đầu vào
    if (inputRpm) {
      const outRpm = parseFloat(inputRpm) / total;
      setOutputRpm(outRpm.toFixed(2));
    }
  };
  
  // Tính lại khi số răng thay đổi
  useEffect(() => {
    if (z1Stage1 && z2Stage1 && z1Stage2 && z2Stage2) {
      tinhTiSoTruyenThucTe(
        parseFloat(z1Stage1),
        parseFloat(z2Stage1),
        parseFloat(z1Stage2),
        parseFloat(z2Stage2)
      );
    }
  }, [z1Stage1, z2Stage1, z1Stage2, z2Stage2, inputRpm]);
  
  return (
    <View>
      <ConfigInput 
        label="Tỉ số truyền tổng (u_t)" 
        value={totalRatio} 
        onValueChange={setTotalRatio} 
      />
      
      <ConfigInput 
        label="Tỉ số truyền mỗi cấp (tối ưu)" 
        value={stageRatio} 
        onValueChange={setStageRatio} 
        editable={false}
      />
      
      <Text style={styles.subSectionTitle}>Cấp 1:</Text>
      <View style={styles.teethRow}>
        <View style={styles.teethInput}>
          <Text style={styles.smallLabel}>Số răng z1</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={z1Stage1}
            onChangeText={setZ1Stage1}
          />
        </View>
        <View style={styles.teethInput}>
          <Text style={styles.smallLabel}>Số răng z2</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={z2Stage1}
            onChangeText={setZ2Stage1}
          />
        </View>
      </View>
      
      <Text style={styles.subSectionTitle}>Cấp 2:</Text>
      <View style={styles.teethRow}>
        <View style={styles.teethInput}>
          <Text style={styles.smallLabel}>Số răng z1</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={z1Stage2}
            onChangeText={setZ1Stage2}
          />
        </View>
        <View style={styles.teethInput}>
          <Text style={styles.smallLabel}>Số răng z2</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={z2Stage2}
            onChangeText={setZ2Stage2}
          />
        </View>
      </View>
      
      <ConfigInput 
        label="Số vòng quay động cơ" 
        unit="vg/ph"
        value={inputRpm} 
        onValueChange={setInputRpm} 
      />
      
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Kết quả tính toán:</Text>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Tỉ số thực tế cấp 1:</Text>
          <Text style={styles.resultValue}>{actualStage1Ratio}</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Tỉ số thực tế cấp 2:</Text>
          <Text style={styles.resultValue}>{actualStage2Ratio}</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Tỉ số tổng thực tế:</Text>
          <Text style={styles.resultValue}>{actualTotalRatio}</Text>
        </View>
        <View style={styles.resultRow}>
          <Text style={styles.resultLabel}>Số vòng quay trục ra:</Text>
          <Text style={styles.resultValue}>{outputRpm} vg/ph</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.calculateButton}
        onPress={tinhPhanPhoiToiUu}
      >
        <Text style={styles.calculateButtonText}>Tính phân phối tỉ số tối ưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  subSectionTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
  },
  teethRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  teethInput: {
    width: '48%',
  },
  smallLabel: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 12,
    marginBottom: 4,
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
});

export default TinhTiSoTruyen;