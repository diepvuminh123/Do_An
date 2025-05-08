import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ResultDisplay } from './utils/ComponentsChung';
import { layDongCoChuanHoa } from './utils/TinhToanUtils';

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

// Props cho component
interface TinhCongSuatMomentProps {
  ketQua: KetQuaTinhToan;
}

/**
 * Component hiển thị kết quả tính toán công suất và mô-men
 */
const TinhCongSuatMoment = ({ ketQua }: TinhCongSuatMomentProps) => {
  // Lấy động cơ chuẩn hóa dựa vào công suất cần thiết
  const dongCo = layDongCoChuanHoa(ketQua.requiredPower);

  return (
    <View>
      <ResultDisplay 
        label="Công suất làm việc (Plv)" 
        value={ketQua.workingPower} 
        unit="kW" 
      />
      <ResultDisplay 
        label="Công suất tương đương (Ptd)" 
        value={ketQua.equivalentPower} 
        unit="kW" 
      />
      <ResultDisplay 
        label="Hiệu suất hệ thống (η)" 
        value={ketQua.systemEfficiency} 
      />
      <ResultDisplay 
        label="Công suất cần thiết (Pct)" 
        value={ketQua.requiredPower} 
        unit="kW" 
      />
      <ResultDisplay 
        label="Số vòng quay trục công tác (nlv)" 
        value={ketQua.rotationSpeed} 
        unit="vg/ph" 
      />
      <ResultDisplay 
        label="Mô-men xoắn trục công tác (T)" 
        value={ketQua.torque} 
        unit="N.mm" 
      />
      <ResultDisplay 
        label="Tỉ số truyền tổng (ut)" 
        value={ketQua.totalRatio} 
      />
      <ResultDisplay 
        label="Tốc độ quay cần thiết động cơ" 
        value={ketQua.motorRpm} 
        unit="vg/ph" 
      />
      
      <View style={styles.motorSuggestion}>
        <Text style={styles.suggestionTitle}>Gợi ý động cơ:</Text>
        <Text style={styles.suggestionText}>
          Động cơ {dongCo.model}: {dongCo.power} kW, {dongCo.rpm} vg/ph
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default TinhCongSuatMoment;