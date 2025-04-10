import React from 'react';
import { StyleSheet, ScrollView, View, Text } from 'react-native';

export default function TechnicalSpecificationScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Thông Số Kỹ Thuật</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Thông Số Băng Tải</Text>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Lực kéo băng tải (F):</Text>
          <Text style={styles.specValue}>7500 N</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Vận tốc băng tải (v):</Text>
          <Text style={styles.specValue}>0.9 m/s</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Đường kính tang (D):</Text>
          <Text style={styles.specValue}>550 mm</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Thông Số Động Cơ K160S4</Text>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Công suất (P):</Text>
          <Text style={styles.specValue}>7.5 kW</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Tốc độ quay (n):</Text>
          <Text style={styles.specValue}>1450 vg/ph</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Hiệu suất:</Text>
          <Text style={styles.specValue}>89 %</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Hệ số công suất:</Text>
          <Text style={styles.specValue}>0.82</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Khối lượng:</Text>
          <Text style={styles.specValue}>94 kg</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Thông Số Bộ Truyền</Text>
        <Text style={styles.sectionSubtitle}>Bộ truyền xích</Text>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Bước xích:</Text>
          <Text style={styles.specValue}>19.05 mm</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Số răng đĩa chủ động:</Text>
          <Text style={styles.specValue}>18</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Số răng đĩa bị động:</Text>
          <Text style={styles.specValue}>46</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Hiệu suất:</Text>
          <Text style={styles.specValue}>96 %</Text>
        </View>

        <Text style={styles.sectionSubtitle}>Hộp giảm tốc</Text>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Mô-đun bánh răng cấp 1:</Text>
          <Text style={styles.specValue}>4 mm</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Mô-đun bánh răng cấp 2:</Text>
          <Text style={styles.specValue}>3 mm</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Số răng bánh chủ động cấp 1:</Text>
          <Text style={styles.specValue}>18</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Số răng bánh bị động cấp 1:</Text>
          <Text style={styles.specValue}>102</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Số răng bánh chủ động cấp 2:</Text>
          <Text style={styles.specValue}>22</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Số răng bánh bị động cấp 2:</Text>
          <Text style={styles.specValue}>70</Text>
        </View>
        <View style={styles.specItem}>
          <Text style={styles.specLabel}>Hiệu suất mỗi cấp:</Text>
          <Text style={styles.specValue}>96 %</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Công Thức Tính Toán</Text>
        <View style={styles.formula}>
          <Text style={styles.formulaTitle}>Công suất làm việc:</Text>
          <Text style={styles.formulaText}>P = (F × v) / 1000</Text>
        </View>
        <View style={styles.formula}>
          <Text style={styles.formulaTitle}>Số vòng quay trục công tác:</Text>
          <Text style={styles.formulaText}>n = (60000 × v) / (π × D)</Text>
        </View>
        <View style={styles.formula}>
          <Text style={styles.formulaTitle}>Mô-men xoắn:</Text>
          <Text style={styles.formulaText}>T = 9.55 × 10⁶ × (P / n)</Text>
        </View>
        <View style={styles.formula}>
          <Text style={styles.formulaTitle}>Công suất tương đương:</Text>
          <Text style={styles.formulaText}>Ptd = Plv × √[(t₁(T₁/T)² + t₂(T₂/T)²)/(t₁+t₂)]</Text>
        </View>
        <View style={styles.formula}>
          <Text style={styles.formulaTitle}>Hiệu suất tổng:</Text>
          <Text style={styles.formulaText}>η = ηx × ηbr² × ηol⁴ × ηkn</Text>
        </View>
        <View style={styles.formula}>
          <Text style={styles.formulaTitle}>Tỉ số truyền tổng:</Text>
          <Text style={styles.formulaText}>ut = nđc / nlv</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Ký Hiệu & Chú Thích</Text>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>F:</Text>
          <Text style={styles.noteValue}>Lực kéo băng tải (N)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>v:</Text>
          <Text style={styles.noteValue}>Vận tốc băng tải (m/s)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>D:</Text>
          <Text style={styles.noteValue}>Đường kính tang (mm)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>P:</Text>
          <Text style={styles.noteValue}>Công suất (kW)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>Plv:</Text>
          <Text style={styles.noteValue}>Công suất làm việc (kW)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>Ptd:</Text>
          <Text style={styles.noteValue}>Công suất tương đương (kW)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>n:</Text>
          <Text style={styles.noteValue}>Số vòng quay (vg/ph)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>T:</Text>
          <Text style={styles.noteValue}>Mô-men xoắn (N.mm)</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>η:</Text>
          <Text style={styles.noteValue}>Hiệu suất</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>ηx:</Text>
          <Text style={styles.noteValue}>Hiệu suất bộ truyền xích</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>ηbr:</Text>
          <Text style={styles.noteValue}>Hiệu suất bộ truyền bánh răng</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>ηol:</Text>
          <Text style={styles.noteValue}>Hiệu suất một cặp ổ lăn</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>ηkn:</Text>
          <Text style={styles.noteValue}>Hiệu suất khớp nối</Text>
        </View>
        <View style={styles.noteItem}>
          <Text style={styles.noteKey}>ut:</Text>
          <Text style={styles.noteValue}>Tỉ số truyền tổng</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Phiên bản: 1.0.0</Text>
        <Text style={styles.footerText}>© 2025 Ứng Dụng Hộp Giảm Tốc</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001627',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
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
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 16,
    marginBottom: 8,
  },
  specItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  specLabel: {
    fontSize: 14,
    color: '#ccc',
    flex: 2,
  },
  specValue: {
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
  formulaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  formulaText: {
    color: '#fff',
    fontSize: 14,
  },
  noteItem: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  noteKey: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: 'bold',
    width: 40,
  },
  noteValue: {
    fontSize: 14,
    color: '#ccc',
    flex: 1,
  },
  footer: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#aaa',
    marginVertical: 2,
  },
});