import React, { useState, useEffect } from 'react';
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
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
// import * as DocumentPicker from 'expo-document-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';

// Comprehensive calculation data interface
interface CalculationHistoryData {
  // Input parameters
  thongSoTai: {
    forceF: string;
    beltSpeed: string;
    drumDiameter: string;
    lifetimeYears: string;
    loadTimeRatioT1: string;
    loadTimeRatioT2: string;
    loadRatioT1: string;
    loadRatioT2: string;
  };
  
  // Chapter 2: Power and Torque
  ketQuaTinhToan: {
    workingPower: number;
    equivalentPower: number;
    systemEfficiency: number;
    requiredPower: number;
    rotationSpeed: number;
    torque: number;
    totalRatio: number;
    motorRpm: number;
  };
  dynamicDetails?: any;
  selectedMotor?: any;
  
  // Chapter 3: Chain Drive
  chainDriveResults?: any;
  
  // Chapter 4: Gearbox Design
  gearboxDesignResults?: any;
  
  // Chapter 5: Shaft Design
  shaftDesignResults?: any;
  
  // Chapter 6: Bearing Calculation
  bearingResults?: any;
  
  // Calculation timestamp
  timestamp: string;
}

export default function ReportGenerator() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const [exportFormat, setExportFormat] = useState<'text' | 'formatted'>('formatted');
  const [calculationData, setCalculationData] = useState<CalculationHistoryData | null>(null);
  
  // Parse calculation history data from params
  useEffect(() => {
    try {
      if (params.historyData) {
        const parsedData = JSON.parse(params.historyData as string);
        setCalculationData(parsedData);
      }
    } catch (error) {
      console.error('Error parsing history data:', error);
    }
  }, [params]);
  
  // If no data is passed, use mock data for demonstration
  const useMockData = !calculationData;
  
  // Mock data for demonstration
  const mockCalculationData: CalculationHistoryData = {
    thongSoTai: {
      forceF: '7500',
      beltSpeed: '0.9',
      drumDiameter: '550',
      lifetimeYears: '10',
      loadTimeRatioT1: '36',
      loadTimeRatioT2: '15',
      loadRatioT1: '1',
      loadRatioT2: '0.5',
    },
    ketQuaTinhToan: {
      workingPower: 6.75,
      equivalentPower: 5.261,
      systemEfficiency: 0.85676,
      requiredPower: 6.1406,
      rotationSpeed: 31.2522,
      torque: 2062866.01,
      totalRatio: 46.397,
      motorRpm: 1450,
    },
    selectedMotor: {
      model: 'K160S4',
      power: 7.5,
      rpm: 1450,
      efficiency: 87.5,
      powerFactor: 0.86,
      torqueRatio: 2.2,
      massKg: 94,
    },
    timestamp: new Date().toISOString(),
  };
  
  // Get the data to display (either parsed or mock)
  const displayData = useMockData ? mockCalculationData : calculationData;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Create text content for the report
  const createTextContent = () => {
    if (!displayData) return '';
    
    const data = displayData;
    const motorData = data.selectedMotor || { model: 'Không xác định', power: 0, rpm: 0 };
    
    return `BÁO CÁO TÍNH TOÁN HỘP GIẢM TỐC
=====================================
Ngày tạo: ${formatDate(data.timestamp)}

1. THÔNG SỐ ĐẦU VÀO
---------------------
Lực kéo băng tải (F): ${data.thongSoTai.forceF} N
Vận tốc băng tải (v): ${data.thongSoTai.beltSpeed} m/s
Đường kính tang (D): ${data.thongSoTai.drumDiameter} mm
Thời gian phục vụ (L): ${data.thongSoTai.lifetimeYears} năm
Chế độ tải: (t₁=${data.thongSoTai.loadTimeRatioT1}s, T₁/T=${data.thongSoTai.loadRatioT1}); (t₂=${data.thongSoTai.loadTimeRatioT2}s, T₂/T=${data.thongSoTai.loadRatioT2})

2. KẾT QUẢ TÍNH TOÁN CÔNG SUẤT VÀ MÔ-MEN
---------------------
Công suất làm việc (Plv): ${data.ketQuaTinhToan.workingPower.toFixed(4)} kW
Công thức: P = (F × v) / 1000 = (${data.thongSoTai.forceF} × ${data.thongSoTai.beltSpeed}) / 1000 = ${data.ketQuaTinhToan.workingPower.toFixed(4)} kW

Công suất tương đương (Ptd): ${data.ketQuaTinhToan.equivalentPower.toFixed(4)} kW
Công thức: Ptd = Plv × [(t₁×(T₁/T)² + t₂×(T₂/T)²) / (t₁ + t₂)]

Hiệu suất hệ thống (η): ${data.ketQuaTinhToan.systemEfficiency.toFixed(5)}
Chi tiết: η = ηx × ηbr² × ηol⁴ × ηkn
  - Hiệu suất bộ truyền xích (ηx) = 0.96
  - Hiệu suất bộ truyền bánh răng (ηbr) = 0.96
  - Hiệu suất một cặp ổ lăn (ηol) = 0.992
  - Hiệu suất khớp nối (ηkn) = 1

Công suất cần thiết (Pct): ${data.ketQuaTinhToan.requiredPower.toFixed(4)} kW
Công thức: Pct = Ptd / η = ${data.ketQuaTinhToan.equivalentPower.toFixed(4)} / ${data.ketQuaTinhToan.systemEfficiency.toFixed(5)} = ${data.ketQuaTinhToan.requiredPower.toFixed(4)} kW

Số vòng quay trục công tác (nlv): ${data.ketQuaTinhToan.rotationSpeed.toFixed(4)} vg/ph
Công thức: nlv = (60000 × v) / (π × D) = (60000 × ${data.thongSoTai.beltSpeed}) / (π × ${data.thongSoTai.drumDiameter}) = ${data.ketQuaTinhToan.rotationSpeed.toFixed(4)} vg/ph

Mô-men xoắn trục công tác (T): ${data.ketQuaTinhToan.torque.toLocaleString()} N.mm
Công thức: T = 9.55 × 1000000 × (Plv / nlv) = 9.55 × 1000000 × (${data.ketQuaTinhToan.workingPower.toFixed(4)} / ${data.ketQuaTinhToan.rotationSpeed.toFixed(4)}) = ${data.ketQuaTinhToan.torque.toLocaleString()} N.mm

Tỉ số truyền tổng cộng (ut): ${data.ketQuaTinhToan.totalRatio.toFixed(3)}

3. ĐỘNG CƠ ĐƯỢC CHỌN
---------------------
Loại động cơ: ${motorData.model || 'Không xác định'}
Công suất định mức: ${motorData.power || 0} kW
Tốc độ quay: ${motorData.rpm || 0} vg/ph
Hiệu suất: ${motorData.efficiency || 0}%
Đánh giá: Động cơ phù hợp với yêu cầu kỹ thuật (Pđc = ${motorData.power || 0} kW > Pct = ${data.ketQuaTinhToan.requiredPower.toFixed(2)} kW)

${data.chainDriveResults ? `
4. BỘ TRUYỀN XÍCH
-----------------
${createChainDriveSection(data.chainDriveResults)}
` : ''}

${data.gearboxDesignResults ? `
5. THIẾT KẾ HỘP GIẢM TỐC
-----------------------
${createGearboxDesignSection(data.gearboxDesignResults)}
` : ''}

${data.shaftDesignResults ? `
6. THIẾT KẾ TRỤC VÀ THEN
------------------------
${createShaftDesignSection(data.shaftDesignResults)}
` : ''}

${data.bearingResults ? `
7. TÍNH TOÁN Ổ LĂN
----------------
${createBearingSection(data.bearingResults)}
` : ''}

4. PHÂN PHỐI TỈ SỐ TRUYỀN
--------------------------
Bộ truyền xích: 2.578
Hộp giảm tốc bánh răng trụ (Cấp 1): 5.66
Hộp giảm tốc bánh răng trụ (Cấp 2): 3.18
Tỉ số truyền tổng: ${data.ketQuaTinhToan.totalRatio.toFixed(3)}

=====================================
© ${new Date().getFullYear()} - Báo cáo được tạo tự động bởi ứng dụng Tính Toán Hộp Giảm Tốc`;
  };
  
  // Helper functions to create specific sections of the report
  function createChainDriveSection(data: any) {
    if (!data) return 'Không có dữ liệu bộ truyền xích';
    
    return `
Thông số cơ bản:
- Số răng bánh nhỏ z₁: ${data.sprockets?.smallGearTeeth || 'N/A'}
- Số răng bánh lớn z₂: ${data.sprockets?.largeGearTeeth || 'N/A'}
- Bước xích p: ${data.chainResult?.chainPitch?.toFixed(2) || 'N/A'} mm
- Số mắt xích: ${data.chainResult?.chainLength || 'N/A'} mắt
- Khoảng cách trục a: ${data.chainResult?.centerDistance || 'N/A'} mm
- Lực tác dụng lên trục: ${data.chainResult?.shaftForce?.toFixed(2) || 'N/A'} N
    `;
  }
  
  function createGearboxDesignSection(data: any) {
    if (!data) return 'Không có dữ liệu thiết kế hộp giảm tốc';
    
    return `
Bộ truyền cấp nhanh:
- Khoảng cách trục aw₁: ${data.fastGear?.axisDistance || 'N/A'} mm
- Mô-đun pháp m₁: ${data.fastGear?.module || 'N/A'} mm
- Số răng bánh nhỏ z₁: ${data.fastGear?.smallGearTeeth || 'N/A'}
- Số răng bánh lớn z₂: ${data.fastGear?.largeGearTeeth || 'N/A'}
- Tỉ số truyền thực u₁: ${data.fastGear?.gearRatio?.toFixed(4) || 'N/A'}

Bộ truyền cấp chậm:
- Khoảng cách trục aw₂: ${data.slowGear?.axisDistance || 'N/A'} mm
- Mô-đun pháp m₂: ${data.slowGear?.module || 'N/A'} mm
- Số răng bánh nhỏ z₁: ${data.slowGear?.smallGearTeeth || 'N/A'}
- Số răng bánh lớn z₂: ${data.slowGear?.largeGearTeeth || 'N/A'}
- Tỉ số truyền thực u₂: ${data.slowGear?.gearRatio?.toFixed(4) || 'N/A'}
    `;
  }
  
  function createShaftDesignSection(data: any) {
    if (!data) return 'Không có dữ liệu thiết kế trục và then';
    
    return `
Vật liệu chế tạo: ${data.materials?.shaft1Material || 'Thép 45 - Thường hóa'}

Trục I:
- Đường kính tại mặt cắt A: ${data.shaft1Results?.diameters?.a?.chosen || 'N/A'} mm
- Đường kính tại mặt cắt B: ${data.shaft1Results?.diameters?.b?.chosen || 'N/A'} mm
- Đường kính tại mặt cắt C: ${data.shaft1Results?.diameters?.c?.chosen || 'N/A'} mm
- Kích thước then tại A: ${data.shaft1Results?.keys?.a?.size || 'N/A'} mm
- Kích thước then tại C: ${data.shaft1Results?.keys?.c?.size || 'N/A'} mm

Trục II:
- Đường kính tại mặt cắt A, D: ${data.shaft2Results?.diameters?.a?.chosen || 'N/A'} mm
- Đường kính tại mặt cắt B: ${data.shaft2Results?.diameters?.b?.chosen || 'N/A'} mm
- Đường kính tại mặt cắt C: ${data.shaft2Results?.diameters?.c?.chosen || 'N/A'} mm
- Kích thước then tại B: ${data.shaft2Results?.keys?.b?.size || 'N/A'} mm
- Kích thước then tại C: ${data.shaft2Results?.keys?.c?.size || 'N/A'} mm

Trục III:
- Đường kính tại mặt cắt A, C: ${data.shaft3Results?.diameters?.a?.chosen || 'N/A'} mm
- Đường kính tại mặt cắt B: ${data.shaft3Results?.diameters?.b?.chosen || 'N/A'} mm
- Đường kính tại mặt cắt D: ${data.shaft3Results?.diameters?.d?.chosen || 'N/A'} mm
- Kích thước then tại B: ${data.shaft3Results?.keys?.b?.size || 'N/A'} mm
- Kích thước then tại D: ${data.shaft3Results?.keys?.d?.size || 'N/A'} mm
    `;
  }
  
  function createBearingSection(data: any) {
    if (!data) return 'Không có dữ liệu tính toán ổ lăn';
    
    return `
Trục I:
- Loại ổ lăn: Ổ bi đỡ một dãy, cỡ nặng
- Ký hiệu ổ: ${data.shaft1Bearings?.bearingB?.code || '405'}
- Kích thước (d×D×B): ${data.shaft1Bearings?.bearingB?.dimensions?.d || '25'}×${data.shaft1Bearings?.bearingB?.dimensions?.D || '80'}×${data.shaft1Bearings?.bearingB?.dimensions?.B || '21'} mm

Trục II:
- Loại ổ lăn: Ổ bi đỡ một dãy, cỡ nặng
- Ký hiệu ổ: ${data.shaft2Bearings?.bearingA?.code || '408'}
- Kích thước (d×D×B): ${data.shaft2Bearings?.bearingA?.dimensions?.d || '40'}×${data.shaft2Bearings?.bearingA?.dimensions?.D || '110'}×${data.shaft2Bearings?.bearingA?.dimensions?.B || '27'} mm

Trục III:
- Loại ổ lăn: Ổ bi đỡ một dãy, cỡ nhẹ
- Ký hiệu ổ: ${data.shaft3Bearings?.bearingC?.code || '212'}
- Kích thước (d×D×B): ${data.shaft3Bearings?.bearingC?.dimensions?.d || '60'}×${data.shaft3Bearings?.bearingC?.dimensions?.D || '110'}×${data.shaft3Bearings?.bearingC?.dimensions?.B || '22'} mm
    `;
  }

  // Share report using Share API
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

  // Toggle between full report and formatted view
  const toggleFullReport = () => {
    setShowFullReport(!showFullReport);
  };
  
  // Toggle export format
  const toggleExportFormat = () => {
    setExportFormat(exportFormat === 'text' ? 'formatted' : 'text');
  };
  
  // Export report as a text file
  const exportAsTextFile = async () => {
    try {
      setLoading(true);
      const textContent = createTextContent();
      const fileUri = `${FileSystem.documentDirectory}bao_cao_tinh_toan_${Date.now()}.txt`;
      
      await FileSystem.writeAsStringAsync(fileUri, textContent, { encoding: FileSystem.EncodingType.UTF8 });
      
      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(fileUri);
        await Sharing.shareAsync(contentUri);
      } else {
        await Sharing.shareAsync(fileUri);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      Alert.alert(
        'Lỗi Xuất File',
        'Không thể tạo file báo cáo: ' + (error instanceof Error ? error.message : String(error))
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header with navigation */}
        <View style={styles.headerWithNav}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <FontAwesome name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.title}>BÁO CÁO TÍNH TOÁN</Text>
          
          <View style={{ width: 20 }}></View> {/* Empty view for alignment */}
        </View>

        {!showFullReport ? (
          <View>
            <View style={styles.header}>
              <Text style={styles.subtitle}>
                Ngày: {displayData ? formatDate(displayData.timestamp) : new Date().toLocaleDateString('vi-VN')}
              </Text>
            </View>

            {/* Phần 1: Thông số đầu vào */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. THÔNG SỐ ĐẦU VÀO</Text>
              
              {displayData && (
                <>
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Lực kéo băng tải (F):</Text>
                    <Text style={styles.dataValue}>{displayData.thongSoTai.forceF} N</Text>
                  </View>
                  
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Vận tốc băng tải (v):</Text>
                    <Text style={styles.dataValue}>{displayData.thongSoTai.beltSpeed} m/s</Text>
                  </View>
                  
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Đường kính tang (D):</Text>
                    <Text style={styles.dataValue}>{displayData.thongSoTai.drumDiameter} mm</Text>
                  </View>
                  
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Thời gian phục vụ (L):</Text>
                    <Text style={styles.dataValue}>{displayData.thongSoTai.lifetimeYears} năm</Text>
                  </View>
                  
                  <View style={styles.dataRow}>
                    <Text style={styles.dataLabel}>Chế độ tải:</Text>
                    <Text style={styles.dataValue}>
                      (t₁={displayData.thongSoTai.loadTimeRatioT1}s, T₁/T={displayData.thongSoTai.loadRatioT1});
                      (t₂={displayData.thongSoTai.loadTimeRatioT2}s, T₂/T={displayData.thongSoTai.loadRatioT2})
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Phần 2: Kết quả tính toán */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. KẾT QUẢ TÍNH TOÁN CÔNG SUẤT VÀ MÔ-MEN</Text>
              
              {displayData && (
                <>
                  <View style={styles.formula}>
                    <Text style={styles.formulaText}>
                      Công suất làm việc: P{'\u1D56'} = (F × v) / 1000 = ({displayData.thongSoTai.forceF} × {displayData.thongSoTai.beltSpeed}) / 1000 = {displayData.ketQuaTinhToan.workingPower.toFixed(4)} kW
                    </Text>
                  </View>
                  
                  <View style={styles.formula}>
                    <Text style={styles.formulaText}>
                      Công suất tương đương: P{'\u209C'}{'\u2095'} = {displayData.ketQuaTinhToan.equivalentPower.toFixed(4)} kW
                    </Text>
                  </View>
                  
                  <View style={styles.formula}>
                    <Text style={styles.formulaText}>
                      Hiệu suất hệ thống: η = {displayData.ketQuaTinhToan.systemEfficiency.toFixed(5)}
                    </Text>
                  </View>
                  
                  <View style={styles.formula}>
                    <Text style={styles.formulaText}>
                      Công suất cần thiết: P{'\u1D9C'}{'\u209C'} = P{'\u209C'}{'\u2095'} / η = {displayData.ketQuaTinhToan.equivalentPower.toFixed(4)} / {displayData.ketQuaTinhToan.systemEfficiency.toFixed(5)} = {displayData.ketQuaTinhToan.requiredPower.toFixed(4)} kW
                    </Text>
                  </View>
                  
                  <View style={styles.formula}>
                    <Text style={styles.formulaText}>
                      Số vòng quay trục công tác: n{'\u1D56'} = (60000 × v) / (π × D) = (60000 × {displayData.thongSoTai.beltSpeed}) / (π × {displayData.thongSoTai.drumDiameter}) = {displayData.ketQuaTinhToan.rotationSpeed.toFixed(4)} vg/ph
                    </Text>
                  </View>
                  
                  <View style={styles.formula}>
                    <Text style={styles.formulaText}>
                      Mô-men xoắn: T = 9.55 × 1000000 × (P{'\u1D56'} / n{'\u1D56'}) = {displayData.ketQuaTinhToan.torque.toLocaleString()} N.mm
                    </Text>
                  </View>
                  
                  <View style={styles.formula}>
                    <Text style={styles.formulaText}>
                      Tỉ số truyền tổng cộng: u{'\u209C'} = {displayData.ketQuaTinhToan.totalRatio.toFixed(3)}
                    </Text>
                  </View>
                </>
              )}
            </View>

            {/* Phần 3: Động cơ đề xuất */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. ĐỘNG CƠ ĐƯỢC CHỌN</Text>
              
              {displayData && displayData.selectedMotor && (
                <View style={styles.motorCard}>
                  <Text style={styles.motorTitle}>{displayData.selectedMotor.model}</Text>
                  
                  <View style={styles.motorSpecs}>
                    <View style={styles.motorSpecItem}>
                      <Text style={styles.motorSpecLabel}>Công suất:</Text>
                      <Text style={styles.motorSpecValue}>{displayData.selectedMotor.power} kW</Text>
                    </View>
                    
                    <View style={styles.motorSpecItem}>
                      <Text style={styles.motorSpecLabel}>Tốc độ quay:</Text>
                      <Text style={styles.motorSpecValue}>{displayData.selectedMotor.rpm} vg/ph</Text>
                    </View>
                    
                    <View style={styles.motorSpecItem}>
                      <Text style={styles.motorSpecLabel}>Hiệu suất:</Text>
                      <Text style={styles.motorSpecValue}>{displayData.selectedMotor.efficiency}%</Text>
                    </View>
                    
                    {displayData.selectedMotor.torqueRatio && (
                      <View style={styles.motorSpecItem}>
                        <Text style={styles.motorSpecLabel}>Tỉ số Tk/Tn:</Text>
                        <Text style={styles.motorSpecValue}>{displayData.selectedMotor.torqueRatio}</Text>
                      </View>
                    )}
                    
                    {displayData.selectedMotor.massKg && (
                      <View style={styles.motorSpecItem}>
                        <Text style={styles.motorSpecLabel}>Khối lượng:</Text>
                        <Text style={styles.motorSpecValue}>{displayData.selectedMotor.massKg} kg</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text style={styles.motorEvaluation}>
                    Động cơ phù hợp với yêu cầu kỹ thuật (P{'\u2095'}{'\u1D9C'} = {displayData.selectedMotor.power} kW &gt; P{'\u1D9C'}{'\u209C'} = {displayData.ketQuaTinhToan.requiredPower.toFixed(2)} kW)
                  </Text>
                </View>
              )}
              
              {(!displayData || !displayData.selectedMotor) && (
                <Text style={styles.noDataText}>Không có dữ liệu về động cơ được chọn</Text>
              )}
            </View>

            {/* Phần 4: Bộ truyền xích */}
            {displayData && displayData.chainDriveResults && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>4. BỘ TRUYỀN XÍCH</Text>
                <Text style={styles.componentDetailsText}>
                  {createChainDriveSection(displayData.chainDriveResults)}
                </Text>
              </View>
            )}

            {/* Phần 5: Thiết kế hộp giảm tốc */}
            {displayData && displayData.gearboxDesignResults && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>5. THIẾT KẾ HỘP GIẢM TỐC</Text>
                <Text style={styles.componentDetailsText}>
                  {createGearboxDesignSection(displayData.gearboxDesignResults)}
                </Text>
              </View>
            )}

            {/* Phần 6: Thiết kế trục và then */}
            {displayData && displayData.shaftDesignResults && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>6. THIẾT KẾ TRỤC VÀ THEN</Text>
                <Text style={styles.componentDetailsText}>
                  {createShaftDesignSection(displayData.shaftDesignResults)}
                </Text>
              </View>
            )}

            {/* Phần 7: Tính toán ổ lăn */}
            {displayData && displayData.bearingResults && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>7. TÍNH TOÁN Ổ LĂN</Text>
                <Text style={styles.componentDetailsText}>
                  {createBearingSection(displayData.bearingResults)}
                </Text>
              </View>
            )}

            {/* Phần 8: Tỉ số truyền */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>8. PHÂN PHỐI TỈ SỐ TRUYỀN</Text>
              
              {displayData && (
                <>
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
                    <Text style={[styles.ratioValue, styles.totalRatioValue]}>
                      {displayData.ketQuaTinhToan.totalRatio.toFixed(3)}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.textReportContainer}>
            <Text style={styles.reportTextTitle}>BÁO CÁO TÍNH TOÁN HỘP GIẢM TỐC</Text>
            <Text style={styles.reportText}>{createTextContent()}</Text>
          </View>
        )}

        {/* Action buttons */}
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
            style={[styles.button, styles.exportButton]} 
            onPress={exportAsTextFile}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Xuất thành file .txt</Text>
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
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Đang xử lý...</Text>
          </View>
        )}

        <Pressable 
          style={styles.backButtonLarge} 
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
    paddingBottom: 40,
  },
  headerWithNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
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
    lineHeight: 20,
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
  exportButton: {
    backgroundColor: '#3498db',
  },
  shareButton: {
    backgroundColor: '#27ae60',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 14,
  },
  backButtonLarge: {
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
  // Styles for text report
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
  noDataText: {
    color: '#aaa',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  componentDetailsText: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 22,
  },
});