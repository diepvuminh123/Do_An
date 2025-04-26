import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
  Platform,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  // Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
// Re-add the necessary imports for PDF export
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
// Keep ViewShot commented out for now as we're focusing on PDF
// import ViewShot from 'react-native-view-shot';
// import { captureRef } from 'react-native-view-shot';

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

  // Hàm tạo và chia sẻ báo cáo dạng văn bản
  const shareTextReport = async () => {
    try {
      const report = `
BÁO CÁO TÍNH TOÁN HỘP GIẢM TỐC
----------------------------------

1. THÔNG SỐ ĐẦU VÀO
- Lực kéo băng tải (F): ${calculationResults.forceF} N
- Vận tốc băng tải (v): ${calculationResults.beltSpeed} m/s
- Đường kính tang (D): ${calculationResults.drumDiameter} mm
- Thời gian phục vụ (L): ${calculationResults.lifetimeYears} năm
- Chế độ tải: (t₁=${calculationResults.loadTimeRatioT1}s, T₁/T=${calculationResults.loadRatioT1}); (t₂=${calculationResults.loadTimeRatioT2}s, T₂/T=${calculationResults.loadRatioT2})

2. KẾT QUẢ TÍNH TOÁN
- Công suất làm việc (Plv): ${calculationResults.workingPower} kW
- Công suất tương đương (Ptd): ${calculationResults.equivalentPower} kW
- Hiệu suất hệ thống (η): ${calculationResults.systemEfficiency}
- Công suất cần thiết (Pct): ${calculationResults.requiredPower} kW
- Số vòng quay trục công tác (nlv): ${calculationResults.rotationSpeed} vg/ph
- Mô-men xoắn trục công tác: ${calculationResults.torque.toLocaleString()} N.mm
- Tỉ số truyền tổng (ut): ${calculationResults.totalRatio}

3. ĐỘNG CƠ ĐƯỢC CHỌN
- Loại động cơ: ${calculationResults.motorModel}
- Công suất định mức: ${calculationResults.motorPower} kW
- Tốc độ quay: ${calculationResults.motorSpeed} vg/ph

4. PHÂN PHỐI TỈ SỐ TRUYỀN
- Bộ truyền xích: 2.578
- Hộp giảm tốc bánh răng trụ (Cấp 1): 5.66
- Hộp giảm tốc bánh răng trụ (Cấp 2): 3.18
- Tỉ số truyền tổng: ${calculationResults.totalRatio}
      `;

      await Share.share({
        message: report,
        title: 'Báo cáo Tính Toán Hộp Giảm Tốc',
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chia sẻ báo cáo.');
    }
  };

  // HTML để tạo PDF - Toàn bộ nội dung trang
  const createPdfContent = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Báo cáo Tính Toán Hộp Giảm Tốc</title>
      <style>
        @page {
          margin: 10mm;
          size: A4 portrait;
        }
        body {
          font-family: Arial, sans-serif;
          padding: 20px;
          color: #333;
          background-color: white;
          width: 100%;
          margin: 0;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-top: 20px;
          border-bottom: 2px solid #2980b9;
          padding-bottom: 20px;
        }
        h1 {
          color: #2c3e50;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .date {
          color: #7f8c8d;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .section {
          margin-bottom: 25px;
          border: 1px solid #eee;
          border-radius: 5px;
          padding: 15px;
          page-break-inside: avoid;
        }
        .section-title {
          color: #2980b9;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .data-row {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #f5f5f5;
        }
        .data-label {
          font-weight: normal;
          color: #555;
          flex: 1.5;
        }
        .data-value {
          font-weight: bold;
          color: #333;
          flex: 1;
          text-align: right;
        }
        .formula {
          background-color: #f8f9fa;
          border-left: 3px solid #3498db;
          padding: 12px;
          margin: 12px 0;
          border-radius: 4px;
        }
        .motor-card {
          background-color: #edf7ff;
          padding: 15px;
          border-radius: 8px;
          margin-top: 15px;
          page-break-inside: avoid;
        }
        .motor-title {
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #2c3e50;
        }
        .motor-spec {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px solid #ddd;
        }
        .motor-evaluation {
          color: #27ae60;
          font-style: italic;
          text-align: center;
          margin-top: 15px;
        }
        .total-ratio {
          background-color: #f1f8fe;
          border-radius: 4px;
          padding: 10px;
          margin-top: 10px;
          font-weight: bold;
          display: flex;
          justify-content: space-between;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          font-size: 12px;
          color: #7f8c8d;
          padding-bottom: 20px;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
        /* Đảm bảo các bảng hiển thị đúng trên PDF */
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
        }
        th, td {
          padding: 10px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f2f2f2;
          color: #333;
        }
        /* Đảm bảo ngắt trang hợp lý */
        h1, h2, h3, h4, h5 {
          page-break-after: avoid;
        }
        
        /* Cố định kích thước cho PDF */
        .content-wrapper {
          width: 210mm; /* Kích thước giấy A4 */
          margin: 0 auto;
        }
      </style>
    </head>
    <body>
      <div class="content-wrapper">
        <div class="header">
          <h1>BÁO CÁO TÍNH TOÁN HỘP GIẢM TỐC</h1>
          <div class="date">Ngày: ${new Date().toLocaleDateString('vi-VN')}</div>
        </div>

        <!-- Phần 1: Thông số đầu vào -->
        <div class="section">
          <div class="section-title">1. THÔNG SỐ ĐẦU VÀO</div>
          
          <div class="data-row">
            <span class="data-label">Lực kéo băng tải (F):</span>
            <span class="data-value">${calculationResults.forceF} N</span>
          </div>
          
          <div class="data-row">
            <span class="data-label">Vận tốc băng tải (v):</span>
            <span class="data-value">${calculationResults.beltSpeed} m/s</span>
          </div>
          
          <div class="data-row">
            <span class="data-label">Đường kính tang (D):</span>
            <span class="data-value">${calculationResults.drumDiameter} mm</span>
          </div>
          
          <div class="data-row">
            <span class="data-label">Thời gian phục vụ (L):</span>
            <span class="data-value">${calculationResults.lifetimeYears} năm</span>
          </div>
          
          <div class="data-row">
            <span class="data-label">Chế độ tải:</span>
            <span class="data-value">
              (t₁=${calculationResults.loadTimeRatioT1}s, T₁/T=${calculationResults.loadRatioT1});
              (t₂=${calculationResults.loadTimeRatioT2}s, T₂/T=${calculationResults.loadRatioT2})
            </span>
          </div>
        </div>

        <!-- Phần 2: Kết quả tính toán -->
        <div class="section">
          <div class="section-title">2. KẾT QUẢ TÍNH TOÁN</div>
          
          <div class="formula">
            Công suất làm việc: P<sub>lv</sub> = (F × v) / 1000 = ${calculationResults.workingPower} kW
          </div>
          
          <div class="formula">
            Công suất tương đương: P<sub>td</sub> = ${calculationResults.equivalentPower} kW
          </div>
          
          <div class="formula">
            Hiệu suất hệ thống: η = ${calculationResults.systemEfficiency}
          </div>
          
          <div class="formula">
            Công suất cần thiết: P<sub>ct</sub> = P<sub>td</sub> / η = ${calculationResults.requiredPower} kW
          </div>
          
          <div class="formula">
            Số vòng quay trục công tác: n<sub>lv</sub> = ${calculationResults.rotationSpeed} vg/ph
          </div>
          
          <div class="formula">
            Mô-men xoắn: T = ${calculationResults.torque.toLocaleString()} N.mm
          </div>
        </div>

        <!-- Phần 3: Động cơ đề xuất -->
        <div class="section">
          <div class="section-title">3. ĐỘNG CƠ ĐƯỢC CHỌN</div>
          
          <div class="motor-card">
            <div class="motor-title">${calculationResults.motorModel}</div>
            
            <div class="motor-spec">
              <span class="data-label">Công suất:</span>
              <span class="data-value">${calculationResults.motorPower} kW</span>
            </div>
            
            <div class="motor-spec">
              <span class="data-label">Tốc độ quay:</span>
              <span class="data-value">${calculationResults.motorSpeed} vg/ph</span>
            </div>
            
            <div class="motor-evaluation">
              Động cơ phù hợp với yêu cầu kỹ thuật (P<sub>đc</sub> = ${calculationResults.motorPower} kW &gt; P<sub>ct</sub> = ${calculationResults.requiredPower.toFixed(2)} kW)
            </div>
          </div>
        </div>

        <!-- Phần 4: Tỉ số truyền -->
        <div class="section">
          <div class="section-title">4. PHÂN PHỐI TỈ SỐ TRUYỀN</div>
          
          <div class="data-row">
            <span class="data-label">Bộ truyền xích:</span>
            <span class="data-value">2.578</span>
          </div>
          
          <div class="data-row">
            <span class="data-label">Hộp giảm tốc bánh răng trụ (Cấp 1):</span>
            <span class="data-value">5.66</span>
          </div>
          
          <div class="data-row">
            <span class="data-label">Hộp giảm tốc bánh răng trụ (Cấp 2):</span>
            <span class="data-value">3.18</span>
          </div>
          
          <div class="total-ratio">
            <span class="data-label">Tỉ số truyền tổng:</span>
            <span class="data-value">${calculationResults.totalRatio}</span>
          </div>
        </div>

        <div class="footer">
          <p>© ${new Date().getFullYear()} - Báo cáo được tạo tự động bởi ứng dụng Tính Toán Hộp Giảm Tốc</p>
        </div>
      </div>
    </body>
    </html>
    `;
  };

  // Hàm tạo và chia sẻ báo cáo PDF - toàn bộ trang
  const sharePdfReport = async () => {
    setLoading(true);
    try {
      // Cấu hình nâng cao cho PDF
      const pdfOptions = {
        html: createPdfContent(),
        base64: false,
        width: 612, // Độ rộng trang A4 tính bằng điểm (8.5 x 72)
        height: 792, // Chiều cao trang A4 tính bằng điểm (11 x 72)
        margins: {
          left: 40,
          top: 40,
          right: 40,
          bottom: 40,
        },
      };

      // Generate PDF using expo-print
      const { uri } = await Print.printToFileAsync(pdfOptions);
      
      // Hiển thị thông báo thành công
      console.log('PDF đã được tạo:', uri);

      // Checking if sharing is available
      if (!(await Sharing.isAvailableAsync())) {
        // Fallback for web or unsupported platforms
        if (Platform.OS === 'web') {
          // For web, we could redirect to the PDF
          window.open(uri, '_blank');
          setLoading(false);
          return;
        }
        
        Alert.alert(
          'Chia sẻ không khả dụng',
          'Thiết bị của bạn không hỗ trợ tính năng chia sẻ.',
          [{ text: 'OK' }]
        );
        setLoading(false);
        return;
      }

      // Lưu file tạm thời nếu cần (tùy chọn)
      const fileInfo = await FileSystem.getInfoAsync(uri);
      // Check if fileInfo exists and has size property
      if (fileInfo.exists) {
        console.log('PDF file size:', (fileInfo as any).size);
      }

      // Chia sẻ file PDF
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Chia sẻ báo cáo PDF hộp giảm tốc',
        UTI: 'com.adobe.pdf'
      });
      
      // Thông báo thành công
      Alert.alert(
        'Thành công',
        'Báo cáo PDF đã được tạo thành công!',
        [{ text: 'OK' }],
        { cancelable: true }
      );
      
    } catch (error) {
      console.error('Lỗi khi tạo PDF:', error);
      Alert.alert(
        'Lỗi', 
        'Không thể tạo hoặc chia sẻ báo cáo PDF: ' + (error instanceof Error ? error.message : String(error))
      );
    } finally {
      setLoading(false);
    }
  };

  // Mock function for screenshot feature
  const simulateScreenshot = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        'Chụp màn hình', 
        'Tính năng chụp màn hình sẽ được thêm vào trong phiên bản tới.\n\nBạn có thể dùng tính năng chia sẻ văn bản thay thế.'
      );
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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

        {/* Các nút xuất báo cáo */}
        <View style={styles.actionButtons}>
          <Pressable 
            style={[styles.button, styles.textButton]} 
            onPress={shareTextReport}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Xuất báo cáo dạng văn bản</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.pdfButton]} 
            onPress={sharePdfReport}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Xuất báo cáo PDF</Text>
          </Pressable>
          
          <Pressable 
            style={[styles.button, styles.imageButton]} 
            onPress={simulateScreenshot}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Chia sẻ ảnh chụp màn hình</Text>
          </Pressable>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Đang tạo báo cáo...</Text>
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
  pdfButton: {
    backgroundColor: '#e74c3c',
  },
  imageButton: {
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
});
 		
