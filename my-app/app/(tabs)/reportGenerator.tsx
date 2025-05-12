import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

// Giả định dữ liệu sẽ được truyền từ trang cấu hình động cơ
type CalculationResults = {
  forceF: string;
  beltSpeed: string;
  drumDiameter: string;
  lifetimeYears: string;
  loadTimeRatioT1: string;
  loadTimeRatioT2: string;
  loadRatioT1: string;
  loadRatioT2: string;
  workingPower: number;
  equivalentPower: number;
  systemEfficiency: number;
  requiredPower: number;
  rotationSpeed: number;
  torque: number;
  totalRatio: number;
  motorRpm: number;
  motorModel?: string;
  motorPower?: number;
  motorSpeed?: number;
};

export default function ReportGenerator() {
  // Trong thực tế, dữ liệu này sẽ được truyền từ màn hình cấu hình
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  
  // Dữ liệu giả định cho ví dụ
  const calculationResults: CalculationResults = {
    forceF: '7500',
    beltSpeed: '0.9',
    drumDiameter: '550',
    lifetimeYears: '10',
    loadTimeRatioT1: '36',
    loadTimeRatioT2: '15',
    loadRatioT1: '1',
    loadRatioT2: '0.5',
    workingPower: 6.75,
    equivalentPower: 5.261,
    systemEfficiency: 0.85676,
    requiredPower: 6.1406,
    rotationSpeed: 31.2522,
    torque: 2062866.01,
    totalRatio: 46.397,
    motorRpm: 1450,
    motorModel: 'K160S4',
    motorPower: 7.5,
    motorSpeed: 1450,
  };

  // Tạo nội dung dạng text đơn giản
  const createTextContent = () => {
    return `BÁO CÁO TÍNH TOÁN HỘP GIẢM TỐC
=====================================

1. THÔNG SỐ ĐẦU VÀO
---------------------
Lực kéo băng tải (F): ${calculationResults.forceF} N
Vận tốc băng tải (v): ${calculationResults.beltSpeed} m/s
Đường kính tang (D): ${calculationResults.drumDiameter} mm
Thời gian phục vụ (L): ${calculationResults.lifetimeYears} năm
Chế độ tải: (t₁=${calculationResults.loadTimeRatioT1}s, T₁/T=${calculationResults.loadRatioT1}); (t₂=${calculationResults.loadTimeRatioT2}s, T₂/T=${calculationResults.loadRatioT2})

2. KẾT QUẢ TÍNH TOÁN
---------------------
Công suất làm việc (Plv): ${calculationResults.workingPower} kW
Công suất tương đương (Ptd): ${calculationResults.equivalentPower} kW
Hiệu suất hệ thống (η): ${calculationResults.systemEfficiency}
Công suất cần thiết (Pct): ${calculationResults.requiredPower} kW
Số vòng quay trục công tác (nlv): ${calculationResults.rotationSpeed} vg/ph
Mô-men xoắn trục công tác: ${calculationResults.torque.toLocaleString()} N.mm

3. ĐỘNG CƠ ĐƯỢC CHỌN
---------------------
Loại động cơ: ${calculationResults.motorModel}
Công suất định mức: ${calculationResults.motorPower} kW
Tốc độ quay: ${calculationResults.motorSpeed} vg/ph
Động cơ phù hợp với yêu cầu kỹ thuật (Pđc = ${calculationResults.motorPower} kW > Pct = ${calculationResults.requiredPower.toFixed(2)} kW)

4. PHÂN PHỐI TỈ SỐ TRUYỀN
--------------------------
Bộ truyền xích: 2.578
Hộp giảm tốc bánh răng trụ (Cấp 1): 5.66
Hộp giảm tốc bánh răng trụ (Cấp 2): 3.18
Tỉ số truyền tổng: ${calculationResults.totalRatio}

=====================================
© ${new Date().getFullYear()} - Báo cáo được tạo tự động bởi ứng dụng Tính Toán Hộp Giảm Tốc`;
  };

  // Hàm chia sẻ báo cáo bằng cách sử dụng Share API tiêu chuẩn
  const shareReport = async () => {
    try {
      setLoading(true);
      const textContent = createTextContent();
      
      await Share.share({
        message: textContent,
        title: 'Báo cáo Tính Toán Hộp Giảm Tốc',
      });
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Lỗi',
        'Không thể chia sẻ báo cáo: ' + (error instanceof Error ? error.message : String(error))
      );
    }
  };

  // Hàm chuyển đổi hiển thị báo cáo trực tiếp
  const toggleFullReport = () => {
    setShowFullReport(!showFullReport);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {!showFullReport ? (
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>BÁO CÁO TÍNH TOÁN HỘP GIẢM TỐC</Text>
              <Text style={styles.subtitle}>Ngày: {new Date().toLocaleDateString('vi-VN')}</Text>
            </View>

            {/* Phần 1: Thông số đầu vào */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. THÔNG SỐ ĐẦU VÀO</Text>
              
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Lực kéo băng tải (F):</Text>
                <Text style={styles.dataValue}>{calculationResults.forceF} N</Text>
              </View>
              
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Vận tốc băng tải (v):</Text>
                <Text style={styles.dataValue}>{calculationResults.beltSpeed} m/s</Text>
              </View>
              
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Đường kính tang (D):</Text>
                <Text style={styles.dataValue}>{calculationResults.drumDiameter} mm</Text>
              </View>
              
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Thời gian phục vụ (L):</Text>
                <Text style={styles.dataValue}>{calculationResults.lifetimeYears} năm</Text>
              </View>
              
              <View style={styles.dataRow}>
                <Text style={styles.dataLabel}>Chế độ tải:</Text>
                <Text style={styles.dataValue}>
                  (t₁={calculationResults.loadTimeRatioT1}s, T₁/T={calculationResults.loadRatioT1});
                  (t₂={calculationResults.loadTimeRatioT2}s, T₂/T={calculationResults.loadRatioT2})
                </Text>
              </View>
            </View>

            {/* Phần 2: Kết quả tính toán */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. KẾT QUẢ TÍNH TOÁN</Text>
              
              <View style={styles.formula}>
                <Text style={styles.formulaText}>
                  Công suất làm việc: P{'\u1D56'} = (F × v) / 1000 = {calculationResults.workingPower} kW
                </Text>
              </View>
              
              <View style={styles.formula}>
                <Text style={styles.formulaText}>
                  Công suất tương đương: P{'\u209C'}{'\u2095'} = {calculationResults.equivalentPower} kW
                </Text>
              </View>
              
              <View style={styles.formula}>
                <Text style={styles.formulaText}>
                  Hiệu suất hệ thống: η = {calculationResults.systemEfficiency}
                </Text>
              </View>
              
              <View style={styles.formula}>
                <Text style={styles.formulaText}>
                  Công suất cần thiết: P{'\u1D9C'}{'\u209C'} = P{'\u209C'}{'\u2095'} / η = {calculationResults.requiredPower} kW
                </Text>
              </View>
              
              <View style={styles.formula}>
                <Text style={styles.formulaText}>
                  Số vòng quay trục công tác: n{'\u1D56'} = {calculationResults.rotationSpeed} vg/ph
                </Text>
              </View>
              
              <View style={styles.formula}>
                <Text style={styles.formulaText}>
                  Mô-men xoắn: T = {calculationResults.torque.toLocaleString()} N.mm
                </Text>
              </View>
            </View>

            {/* Phần 3: Động cơ đề xuất */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. ĐỘNG CƠ ĐƯỢC CHỌN</Text>
              
              <View style={styles.motorCard}>
                <Text style={styles.motorTitle}>{calculationResults.motorModel}</Text>
                
                <View style={styles.motorSpecs}>
                  <View style={styles.motorSpecItem}>
                    <Text style={styles.motorSpecLabel}>Công suất:</Text>
                    <Text style={styles.motorSpecValue}>{calculationResults.motorPower} kW</Text>
                  </View>
                  
                  <View style={styles.motorSpecItem}>
                    <Text style={styles.motorSpecLabel}>Tốc độ quay:</Text>
                    <Text style={styles.motorSpecValue}>{calculationResults.motorSpeed} vg/ph</Text>
                  </View>
                </View>
                
                <Text style={styles.motorEvaluation}>
                  Động cơ phù hợp với yêu cầu kỹ thuật (P{'\u2095'}{'\u1D9C'} = {calculationResults.motorPower} kW &gt; P{'\u1D9C'}{'\u209C'} = {calculationResults.requiredPower.toFixed(2)} kW)
                </Text>
              </View>
            </View>

            {/* Phần 4: Tỉ số truyền */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. PHÂN PHỐI TỈ SỐ TRUYỀN</Text>
              
              <View style={styles.ratioRow}>
                <Text style={styles.ratioLabel}>Bộ truyền xích:</Text>
                <Text style={styles.ratioValue}>2.578</Text>
              </View>
              
              <View style={styles.ratioRow}>
                <Text style={styles.ratioLabel}>Hộp giảm tốc bánh răng trụ (Cấp 1):</Text>
                <Text style={styles.ratioValue}>5.66</Text>
              </View>
              
              <View style={styles.ratioRow}>
                <Text style={styles.ratioLabel}>Hộp giảm tốc bánh răng trụ (Cấp 2):</Text>
                <Text style={styles.ratioValue}>3.18</Text>
              </View>
              
              <View style={[styles.ratioRow, styles.totalRatioRow]}>
                <Text style={[styles.ratioLabel, styles.totalRatioLabel]}>Tỉ số truyền tổng:</Text>
                <Text style={[styles.ratioValue, styles.totalRatioValue]}>{calculationResults.totalRatio}</Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.textReportContainer}>
            <Text style={styles.reportTextTitle}>BÁO CÁO TÍNH TOÁN HỘP GIẢM TỐC</Text>
            <Text style={styles.reportText}>{createTextContent()}</Text>
          </View>
        )}

        {/* Các nút tác vụ */}
        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.button, styles.textButton]} 
            onPress={toggleFullReport}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {showFullReport ? 'Xem báo cáo đồ họa' : 'Xem báo cáo văn bản'}
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.shareButton]} 
            onPress={shareReport}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Chia sẻ báo cáo</Text>
          </Pressable>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        )}

        <Pressable 
          style={styles.backButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Quay lại trang trước</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001627',
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 8,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  dataLabel: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
  },
  dataValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  formula: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginVertical: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  formulaText: {
    color: '#fff',
    fontSize: 14,
  },
  motorCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  motorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 15,
  },
  motorSpecs: {
    marginBottom: 15,
  },
  motorSpecItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  motorSpecLabel: {
    fontSize: 14,
    color: '#ccc',
  },
  motorSpecValue: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  motorEvaluation: {
    color: '#4AE290',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
    textAlign: 'center',
  },
  ratioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  ratioLabel: {
    fontSize: 14,
    color: '#ccc',
    flex: 2,
  },
  ratioValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  totalRatioRow: {
    marginTop: 8,
    borderBottomWidth: 0,
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 8,
    padding: 10,
  },
  totalRatioLabel: {
    color: '#fff',
    fontWeight: '600',
  },
  totalRatioValue: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionButtons: {
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    backgroundColor: '#2c3e50',
  },
  shareButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  backButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  // Styles cho phần báo cáo văn bản
  textReportContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reportTextTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 15,
    textAlign: 'center',
  },
  reportText: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 12,
    lineHeight: 20,
    textAlign: 'left',
  },
});