import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { ConfigInput } from './utils/ComponentsChung';

// Props cho component
interface KiemNghiemHopGiamTocProps {
  torque?: number;         // Mô-men xoắn (N.mm)
  rotationSpeed?: number;  // Số vòng quay (vg/ph)
  requiredPower?: number;  // Công suất cần thiết (kW)
}

/**
 * Component kiểm nghiệm hộp giảm tốc
 */
const KiemNghiemHopGiamToc = ({ 
  torque = 0, 
  rotationSpeed = 0, 
  requiredPower = 0 
}: KiemNghiemHopGiamTocProps) => {
  // Giá trị đầu vào từ parent hoặc người dùng
  const [inputTorque, setInputTorque] = useState(torque > 0 ? torque.toString() : '');
  const [inputRpm, setInputRpm] = useState(rotationSpeed > 0 ? rotationSpeed.toString() : '');
  const [inputPower, setInputPower] = useState(requiredPower > 0 ? requiredPower.toString() : '');
  
  // Thông số hộp giảm tốc
  const [firstStageTorque, setFirstStageTorque] = useState('');
  const [secondStageTorque, setSecondStageTorque] = useState('');
  const [firstStagePower, setFirstStagePower] = useState('');
  const [secondStagePower, setSecondStagePower] = useState('');
  const [gearboxEfficiency, setGearboxEfficiency] = useState('0.94');
  const [overloadFactor, setOverloadFactor] = useState('1.25');
  const [loadDurationRatio, setLoadDurationRatio] = useState('');
  
  // Kết quả kiểm nghiệm
  const [verificationResults, setVerificationResults] = useState({
    firstStageRatio: 0,
    secondStageRatio: 0,
    totalRatio: 0,
    actualEfficiency: 0,
    firstStageMaxTorque: 0,
    secondStageMaxTorque: 0,
    torqueMargin: 0,
    powerMargin: 0,
    isAcceptable: false,
  });
  
  // Tính toán và kiểm nghiệm hộp giảm tốc
  const verifyGearbox = () => {
    try {
      // Parse giá trị đầu vào
      const T = parseFloat(inputTorque) || 0;
      const n = parseFloat(inputRpm) || 0;
      const P = parseFloat(inputPower) || 0;
      const T1 = parseFloat(firstStageTorque) || 0;
      const T2 = parseFloat(secondStageTorque) || 0;
      const P1 = parseFloat(firstStagePower) || 0;
      const P2 = parseFloat(secondStagePower) || 0;
      const efficiency = parseFloat(gearboxEfficiency) || 0;
      const kOverload = parseFloat(overloadFactor) || 0;
      
      // Kiểm tra đầu vào
      if (T <= 0 || n <= 0 || P <= 0 || T1 <= 0 || T2 <= 0 || P1 <= 0 || P2 <= 0 || efficiency <= 0 || kOverload <= 0) {
        Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ thông số");
        return;
      }
      
      // Tính tỉ số truyền cấp
      const u1 = T1 / P1 * 9550;  // T = 9550 * P / n
      const u2 = T2 / P2 * 9550;
      const uTotal = u1 * u2;
      
      // Tính mô-men xoắn tối đa với hệ số quá tải
      const T1Max = T1 * kOverload;
      const T2Max = T2 * kOverload;
      
      // Tính dự trữ
      const torqueMargin = (T2Max / T - 1) * 100;  // Phần trăm
      const powerMargin = (P2 / P - 1) * 100;      // Phần trăm
      
      // Kiểm tra tính phù hợp (cả hai dự trữ > 5%)
      const isAcceptable = torqueMargin > 5 && powerMargin > 5;
      
      // Tính hiệu suất thực tế
      const actualEfficiency = P2 / (P1 * u2);
      
      // Cập nhật kết quả
      setVerificationResults({
        firstStageRatio: u1,
        secondStageRatio: u2,
        totalRatio: uTotal,
        actualEfficiency: actualEfficiency,
        firstStageMaxTorque: T1Max,
        secondStageMaxTorque: T2Max,
        torqueMargin: torqueMargin,
        powerMargin: powerMargin,
        isAcceptable: isAcceptable,
      });
      
    } catch (error) {
      Alert.alert("Lỗi tính toán", "Vui lòng kiểm tra lại dữ liệu đầu vào");
    }
  };
  
  return (
    <View>
      <Text style={styles.subSectionTitle}>Thông số đầu vào:</Text>
      
      <ConfigInput 
        label="Mô-men cần thiết ở trục ra" 
        unit="N.mm"
        value={inputTorque} 
        onValueChange={setInputTorque} 
      />
      
      <ConfigInput 
        label="Số vòng quay trục ra" 
        unit="vg/ph"
        value={inputRpm} 
        onValueChange={setInputRpm} 
      />
      
      <ConfigInput 
        label="Công suất cần thiết" 
        unit="kW"
        value={inputPower} 
        onValueChange={setInputPower} 
      />
      
      <Text style={styles.subSectionTitle}>Thông số hộp giảm tốc:</Text>
      
      <ConfigInput 
        label="Mô-men xoắn trục 1 (T1)" 
        unit="N.mm"
        value={firstStageTorque} 
        onValueChange={setFirstStageTorque} 
      />
      
      <ConfigInput 
        label="Mô-men xoắn trục 2 (T2)" 
        unit="N.mm"
        value={secondStageTorque} 
        onValueChange={setSecondStageTorque} 
      />
      
      <ConfigInput 
        label="Công suất trục 1 (P1)" 
        unit="kW"
        value={firstStagePower} 
        onValueChange={setFirstStagePower} 
      />
      
      <ConfigInput 
        label="Công suất trục 2 (P2)" 
        unit="kW"
        value={secondStagePower} 
        onValueChange={setSecondStagePower} 
      />
      
      <ConfigInput 
        label="Hiệu suất truyền (η)" 
        value={gearboxEfficiency} 
        onValueChange={setGearboxEfficiency} 
      />
      
      <ConfigInput 
        label="Hệ số quá tải" 
        value={overloadFactor} 
        onValueChange={setOverloadFactor} 
      />
      
      <ConfigInput 
        label="Tỉ lệ thời gian tải lớn/nhỏ" 
        value={loadDurationRatio} 
        onValueChange={setLoadDurationRatio} 
      />
      
      <TouchableOpacity
        style={styles.calculateButton}
        onPress={verifyGearbox}
      >
        <Text style={styles.calculateButtonText}>Kiểm nghiệm hộp số</Text>
      </TouchableOpacity>
      
      {verificationResults.totalRatio > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsTitle}>Kết quả kiểm nghiệm:</Text>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Tỉ số truyền cấp 1:</Text>
            <Text style={styles.resultValue}>{verificationResults.firstStageRatio.toFixed(3)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Tỉ số truyền cấp 2:</Text>
            <Text style={styles.resultValue}>{verificationResults.secondStageRatio.toFixed(3)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Tỉ số truyền tổng:</Text>
            <Text style={styles.resultValue}>{verificationResults.totalRatio.toFixed(3)}</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Hiệu suất thực tế:</Text>
            <Text style={styles.resultValue}>{(verificationResults.actualEfficiency * 100).toFixed(2)}%</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Mô-men max cấp 1:</Text>
            <Text style={styles.resultValue}>{verificationResults.firstStageMaxTorque.toFixed(2)} N.mm</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Mô-men max cấp 2:</Text>
            <Text style={styles.resultValue}>{verificationResults.secondStageMaxTorque.toFixed(2)} N.mm</Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Dự trữ mô-men:</Text>
            <Text style={[
              styles.resultValue, 
              verificationResults.torqueMargin > 5 ? styles.goodValue : styles.badValue
            ]}>
              {verificationResults.torqueMargin.toFixed(2)}%
            </Text>
          </View>
          
          <View style={styles.resultRow}>
            <Text style={styles.resultLabel}>Dự trữ công suất:</Text>
            <Text style={[
              styles.resultValue, 
              verificationResults.powerMargin > 5 ? styles.goodValue : styles.badValue
            ]}>
              {verificationResults.powerMargin.toFixed(2)}%
            </Text>
          </View>
          
          <View style={[
            styles.verificationResult, 
            verificationResults.isAcceptable ? styles.goodResult : styles.badResult
          ]}>
            <Text style={styles.verificationText}>
              {verificationResults.isAcceptable 
                ? "Hộp giảm tốc phù hợp với yêu cầu" 
                : "Hộp giảm tốc KHÔNG phù hợp với yêu cầu"}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subSectionTitle: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
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
  goodValue: {
    color: '#4CD964',
  },
  badValue: {
    color: '#FF3B30',
  },
  verificationResult: {
    marginTop: 16,
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  goodResult: {
    backgroundColor: 'rgba(76, 217, 100, 0.2)',
  },
  badResult: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
  },
  verificationText: {
    fontWeight: '600',
    fontSize: 14,
    color: '#fff',
  }
});

export default KiemNghiemHopGiamToc;