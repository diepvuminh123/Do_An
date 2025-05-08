import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { ConfigInput } from './utils/ComponentsChung';
import {
  tinhBuocXichKhuyenNghi,
  tinhHeSoVanToc,
  tinhHeSoSoRang,
  tinhHeSoCheDo
} from './utils/TinhToanUtils';

// Props cho component
interface BoTruyenXichProps {
  power?: number;         // Công suất (kW)
  inputRpm?: number;      // Số vòng quay đầu vào (vg/ph)
  outputRpm?: number;     // Số vòng quay đầu ra (vg/ph)
}

/**
 * Component tính toán thiết kế bộ truyền xích
 */
const BoTruyenXich = ({ 
  power = 0, 
  inputRpm = 0, 
  outputRpm = 0 
}: BoTruyenXichProps) => {
  // Giá trị mặc định từ component cha
  const [transmittedPower, setTransmittedPower] = useState(power > 0 ? power.toString() : '');
  const [drivingRpm, setDrivingRpm] = useState(inputRpm > 0 ? inputRpm.toString() : '');
  const [drivenRpm, setDrivenRpm] = useState(outputRpm > 0 ? outputRpm.toString() : '');
  
  // Loại xích và thông số
  const [chainType, setChainType] = useState('standard');
  const [chainPitch, setChainPitch] = useState('');
  const [chainRows, setChainRows] = useState('1');
  
  // Thông số đĩa xích
  const [smallSprocketTeeth, setSmallSprocketTeeth] = useState('');
  const [largeSprocketTeeth, setLargeSprocketTeeth] = useState('');
  const [centerDistance, setCenterDistance] = useState('');
  
  // Kết quả tính toán
  const [calculatedResults, setCalculatedResults] = useState({
    chainLength: 0,         // Chiều dài xích (đơn vị đốt)
    actualRatio: 0,         // Tỉ số truyền thực tế
    chainSpeed: 0,          // Vận tốc xích (m/s)
    chainForce: 0,          // Lực kéo xích (N)
    requiredPitch: 0,       // Bước xích cần thiết (mm)
    recommendedRows: 0,     // Số hàng xích đề xuất
    actualPitch: 0,         // Bước xích thực tế (mm)
  });
  
  // Danh sách bước xích chuẩn
  const chainPitchOptions = [
    { label: 'Chọn bước xích', value: '' },
    { label: '6.35 mm', value: '6.35' },
    { label: '9.525 mm', value: '9.525' },
    { label: '12.7 mm', value: '12.7' },
    { label: '15.875 mm', value: '15.875' },
    { label: '19.05 mm', value: '19.05' },
    { label: '25.4 mm', value: '25.4' },
    { label: '31.75 mm', value: '31.75' },
    { label: '38.1 mm', value: '38.1' },
  ];
  
  // Danh sách loại xích
  const chainTypeOptions = [
    { label: 'Xích tiêu chuẩn', value: 'standard' },
    { label: 'Xích chịu tải nặng', value: 'heavy' },
    { label: 'Xích chống ăn mòn', value: 'corrosion' },
  ];
  
  // Cập nhật giá trị mặc định khi props thay đổi
  useEffect(() => {
    if (power > 0) setTransmittedPower(power.toString());
    if (inputRpm > 0) setDrivingRpm(inputRpm.toString());
    if (outputRpm > 0) setDrivenRpm(outputRpm.toString());
    
    // Tính tỉ số truyền nếu có đủ thông số RPM
    if (inputRpm > 0 && outputRpm > 0) {
      const ratio = inputRpm / outputRpm;
      
      // Đề xuất số răng dựa trên tỉ số truyền
      deXuatSoRang(ratio);
    }
  }, [power, inputRpm, outputRpm]);
  
  // Đề xuất số răng dựa trên tỉ số truyền
  const deXuatSoRang = (ratio: number) => {
    // Tiêu chuẩn: đĩa xích nhỏ với 9-17 răng
    const z1 = 17; // Chọn z1 cho đĩa xích nhỏ
    const z2 = Math.round(z1 * ratio);
    
    setSmallSprocketTeeth(z1.toString());
    setLargeSprocketTeeth(z2.toString());
  };
  
  // Tính toán tất cả các thông số xích
  const tinhToanBoTruyenXich = () => {
    try {
      // Parse giá trị đầu vào
      const P = parseFloat(transmittedPower) || 0;
      const n1 = parseFloat(drivingRpm) || 0;
      const n2 = parseFloat(drivenRpm) || 0;
      const z1 = parseInt(smallSprocketTeeth) || 0;
      const z2 = parseInt(largeSprocketTeeth) || 0;
      const a = parseFloat(centerDistance) || 0;
      
      // Kiểm tra đầu vào
      if (P <= 0 || n1 <= 0 || z1 <= 0 || z2 <= 0 || a <= 0) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông số");
        return;
      }
      
      // Tính tỉ số truyền
      const u = z2 / z1;
      
      // Tính bước xích cần thiết và vận tốc xích
      const p = parseFloat(chainPitch) || tinhBuocXichCanThiet(P, n1, z1);
      const v = (p * z1 * n1) / (60 * 1000); // Đổi mm sang m và phút sang giây
      
      // Tính lực kéo xích
      const F = (P * 1000) / v; // Đổi kW sang W
      
      // Tính chiều dài xích (đốt)
      const L = 2 * Math.floor(a / p) + (z1 + z2) / 2 + Math.pow(z2 - z1, 2) / (4 * Math.PI * Math.floor(a / p));
      const chainLength = Math.ceil(L);
      
      // Tính số hàng xích đề xuất dựa trên công suất
      const k_v = tinhHeSoVanToc(v);
      const k_z = tinhHeSoSoRang(z1);
      const k_service = tinhHeSoCheDo(chainType);
      
      const P_1 = P / (k_v * k_z * k_service);
      let recommendedRows = 1;
      
      if (P_1 > 5) recommendedRows = 2;
      if (P_1 > 15) recommendedRows = 3;
      
      // Cập nhật kết quả
      setCalculatedResults({
        chainLength: chainLength,
        actualRatio: u,
        chainSpeed: v,
        chainForce: F,
        requiredPitch: p,
        recommendedRows: recommendedRows,
        actualPitch: p,
      });
      
      // Đặt bước xích tính toán nếu chưa chọn
      if (!chainPitch) {
        const closestPitch = timBuocXichChuanGanNhat(p);
        setChainPitch(closestPitch.toString());
        setChainRows(recommendedRows.toString());
      }
      
    } catch (error) {
      Alert.alert("Lỗi tính toán", "Vui lòng kiểm tra lại dữ liệu đầu vào");
    }
  };
  
  // Tính bước xích cần thiết dựa trên công suất, RPM và số răng
  const tinhBuocXichCanThiet = (power: number, rpm: number, teeth: number): number => {
    // Công thức đơn giản để ước tính bước xích ban đầu
    // p = K * (P / n)^(1/3) với K là hằng số dựa trên kinh nghiệm
    const K = 29.5; // Hằng số dựa trên kinh nghiệm
    const p = K * Math.pow((power * 1000) / rpm, 1/3);
    return p;
  };
  
  // Tìm bước xích chuẩn gần nhất
  const timBuocXichChuanGanNhat = (calculatedPitch: number) => {
    const standardPitches = chainPitchOptions
      .map(option => parseFloat(option.value))
      .filter(value => !isNaN(value));
    
    let closestPitch = standardPitches[0];
    let minDifference = Math.abs(calculatedPitch - closestPitch);
    
    for (const pitch of standardPitches) {
      const difference = Math.abs(calculatedPitch - pitch);
      if (difference < minDifference) {
        minDifference = difference;
        closestPitch = pitch;
      }
    }
    
    return closestPitch;
  };
  
  return (
    <ScrollView>
      <View>
        <Text style={styles.subSectionTitle}>Thông số đầu vào:</Text>
        
        <ConfigInput 
          label="Công suất truyền" 
          unit="kW"
          value={transmittedPower} 
          onValueChange={setTransmittedPower} 
        />
        
        <ConfigInput 
          label="Số vòng quay đĩa xích chủ động" 
          unit="vg/ph"
          value={drivingRpm} 
          onValueChange={setDrivingRpm} 
        />
        
        <ConfigInput 
          label="Số vòng quay đĩa xích bị động" 
          unit="vg/ph"
          value={drivenRpm} 
          onValueChange={setDrivenRpm} 
        />
        
        <Text style={styles.label}>Loại xích</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={chainType}
            onValueChange={setChainType}
            style={styles.picker}
          >
            {chainTypeOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.label}>Bước xích</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={chainPitch}
            onValueChange={setChainPitch}
            style={styles.picker}
          >
            {chainPitchOptions.map((option, index) => (
              <Picker.Item key={index} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
        
        <ConfigInput 
          label="Số răng đĩa xích nhỏ (z1)" 
          value={smallSprocketTeeth} 
          onValueChange={setSmallSprocketTeeth} 
        />
        
        <ConfigInput 
          label="Số răng đĩa xích lớn (z2)" 
          value={largeSprocketTeeth} 
          onValueChange={setLargeSprocketTeeth} 
        />
        
        <ConfigInput 
          label="Khoảng cách trục (tạm tính)" 
          unit="mm"
          value={centerDistance} 
          onValueChange={setCenterDistance} 
        />
        
        <TouchableOpacity
          style={styles.calculateButton}
          onPress={tinhToanBoTruyenXich}
        >
          <Text style={styles.calculateButtonText}>Tính toán bộ truyền xích</Text>
        </TouchableOpacity>
        
        {calculatedResults.chainLength > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Kết quả tính toán:</Text>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Bước xích đề xuất:</Text>
              <Text style={styles.resultValue}>{calculatedResults.requiredPitch.toFixed(2)} mm</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Bước xích tiêu chuẩn:</Text>
              <Text style={styles.resultValue}>{calculatedResults.actualPitch} mm</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Số đốt xích:</Text>
              <Text style={styles.resultValue}>{calculatedResults.chainLength} đốt</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Tỉ số truyền thực tế:</Text>
              <Text style={styles.resultValue}>{calculatedResults.actualRatio.toFixed(3)}</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Vận tốc xích:</Text>
              <Text style={styles.resultValue}>{calculatedResults.chainSpeed.toFixed(2)} m/s</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Lực kéo xích:</Text>
              <Text style={styles.resultValue}>{calculatedResults.chainForce.toFixed(2)} N</Text>
            </View>
            
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Số hàng xích đề xuất:</Text>
              <Text style={styles.resultValue}>{calculatedResults.recommendedRows}</Text>
            </View>
            
            <View style={styles.noteContainer}>
              <Text style={styles.noteTitle}>Lưu ý:</Text>
              <Text style={styles.noteText}>- Đảm bảo bôi trơn đầy đủ cho bộ truyền xích</Text>
              <Text style={styles.noteText}>- Căng xích đúng kỹ thuật, không quá căng hoặc quá lỏng</Text>
              <Text style={styles.noteText}>- Kiểm tra định kỳ độ mòn và thay thế khi cần thiết</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  label: {
    color: '#fff',
    opacity: 0.9,
    fontSize: 14,
    marginVertical: 8,
  },
  subSectionTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
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
  noteContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 6,
  },
  noteTitle: {
    color: '#ff9500',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  noteText: {
    color: '#fff',
    fontSize: 12,
    marginVertical: 2,
  },
});

export default BoTruyenXich;