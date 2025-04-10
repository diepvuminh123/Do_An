import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';

// Mock image assets - in a real app, you would add actual image files
const mockAssets = {
  chainDrive: require('../../assets/images/icon1.jpg'), // Replace with actual chain drive image
  gearStage1: require('../../assets/images/icon2.jpg'), // Replace with actual gear stage 1 image
  gearStage2: require('../../assets/images/icon3.jpg'), // Replace with actual gear stage 2 image
};

// Interface for transmission components
interface TransmissionComponent {
  id: string;
  name: string;
  type: 'chain' | 'gear' | 'belt';
  ratio: number;
  image: any;
  specs: {
    [key: string]: string | number;
  };
}

export default function GearboxRecommendationsScreen() {
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [motorData, setMotorData] = useState({
    forceF: '7500',
    beltSpeed: '0.9',
    drumDiameter: '550',
    workingPower: 6.75,
    equivalentPower: 5.261,
    requiredPower: 6.141,
    rotationSpeed: 31.252,
    torque: 2062866.01,
  });
  
  const [recommendedMotor, setRecommendedMotor] = useState({
    model: 'K160S4',
    power: 7.5,
    speed: 1450,
    weight: 94,
    efficiency: 0.89,
    startTorqueRatio: 2.2,
  });
  
  const [recommendedComponents, setRecommendedComponents] = useState<TransmissionComponent[]>([]);
  
  // Giả lập dữ liệu cho các linh kiện truyền động
  useEffect(() => {
    // Giả định dữ liệu sẽ được lấy từ API trong ứng dụng thực tế
    setTimeout(() => {
      // Tính toán dựa trên dữ liệu từ màn hình trước
      const components: TransmissionComponent[] = [
        {
          id: '1',
          name: 'Bộ truyền xích công nghiệp',
          type: 'chain',
          ratio: 2.578,
          image: mockAssets.chainDrive, 
          specs: {
            pitch: 19.05, // mm
            teethCount1: 18,
            teethCount2: 46,
            length: 1219.2, // mm
            axisDistance: 304.8, // mm
            efficiency: 0.96,
          },
        },
        {
          id: '2',
          name: 'Bánh răng trụ cấp 1',
          type: 'gear',
          ratio: 5.66,
          image: mockAssets.gearStage1,
          specs: {
            module: 4,
            teethCount1: 18,
            teethCount2: 102,
            angle: 0,
            width: 48, // mm
            material: 'Thép 40X',
            hardness: '45-50 HRC',
            efficiency: 0.96,
          },
        },
        {
          id: '3',
          name: 'Bánh răng trụ cấp 2',
          type: 'gear',
          ratio: 3.18,
          image: mockAssets.gearStage2,
          specs: {
            module: 3,
            teethCount1: 22,
            teethCount2: 70,
            angle: 0,
            width: 36, // mm
            material: 'Thép 40X',
            hardness: '45-50 HRC',
            efficiency: 0.96,
          },
        },
      ];
      
      setRecommendedComponents(components);
      setLoading(false);
    }, 1500);
  }, []);

  // Tính toán tổng tỉ số truyền
  const totalRatio = recommendedComponents.reduce((acc, component) => acc * component.ratio, 1);
  
  // Tính hiệu suất tổng
  const totalEfficiency = recommendedComponents.reduce(
    (acc, component) => acc * (component.specs.efficiency as number), 
    1
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Gợi ý Bộ Truyền</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Đang phân tích và tính toán...</Text>
        </View>
      ) : (
        <>
          {/* Phần động cơ */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Động Cơ Đề Xuất</Text>
            <View style={styles.motorCard}>
              <View style={styles.motorHeader}>
                <Text style={styles.motorModel}>{recommendedMotor.model}</Text>
                <Text style={styles.motorPower}>{recommendedMotor.power} kW</Text>
              </View>
              
              <View style={styles.motorSpecs}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Tốc độ quay:</Text>
                  <Text style={styles.specValue}>{recommendedMotor.speed} vg/ph</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Hiệu suất:</Text>
                  <Text style={styles.specValue}>{(recommendedMotor.efficiency * 100).toFixed(1)}%</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Tỉ số Tk/Tđm:</Text>
                  <Text style={styles.specValue}>{recommendedMotor.startTorqueRatio}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Khối lượng:</Text>
                  <Text style={styles.specValue}>{recommendedMotor.weight} kg</Text>
                </View>
              </View>
              
              <View style={styles.evaluationContainer}>
                <Text style={styles.evaluationTitle}>Đánh giá:</Text>
                <Text style={styles.evaluationText}>
                  Động cơ phù hợp với yêu cầu kỹ thuật (P{'\u2095'}{'\u1D9C'} = {recommendedMotor.power} kW &gt; 
                  P{'\u1D9C'}{'\u209C'} = {motorData.requiredPower.toFixed(2)} kW)
                </Text>
              </View>
            </View>
          </View>
          
          {/* Phần tổng quan tỉ số truyền */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tổng Quan Bộ Truyền</Text>
            <View style={styles.ratioCard}>
              <View style={styles.ratioHeader}>
                <Text style={styles.ratioHeaderText}>Tỉ số truyền tổng: {totalRatio.toFixed(3)}</Text>
              </View>
              
              <View style={styles.ratioDistribution}>
                {recommendedComponents.map((component, index) => (
                  <View key={component.id} style={styles.ratioItem}>
                    <Text style={styles.ratioItemName}>{component.name}</Text>
                    <Text style={styles.ratioItemValue}>u = {component.ratio}</Text>
                  </View>
                ))}
              </View>
              
              <View style={styles.efficiencyContainer}>
                <Text style={styles.efficiencyText}>
                  Hiệu suất tổng: {(totalEfficiency * 100).toFixed(1)}%
                </Text>
              </View>
            </View>
          </View>
          
          {/* Danh sách các linh kiện */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chi Tiết Linh Kiện</Text>
            
            {recommendedComponents.map((component) => (
              <View key={component.id} style={styles.componentCard}>
                <Text style={styles.componentTitle}>{component.name}</Text>
                
                <View style={styles.componentContent}>
                  <View style={styles.componentImageContainer}>
                    {/* Thay bằng hình ảnh thực tế trong ứng dụng */}
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.imagePlaceholderText}>
                        {component.type === 'chain' ? 'Xích' : 
                         component.type === 'gear' ? 'Bánh răng' : 'Đai'}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.componentSpecs}>
                    {Object.entries(component.specs).map(([key, value], index) => {
                      let label = key;
                      let unit = '';
                      
                      // Chuyển đổi tên thuộc tính sang tiếng Việt
                      if (key === 'pitch') { label = 'Bước'; unit = 'mm'; }
                      else if (key === 'teethCount1') { label = 'Số răng bánh 1'; }
                      else if (key === 'teethCount2') { label = 'Số răng bánh 2'; }
                      else if (key === 'length') { label = 'Chiều dài'; unit = 'mm'; }
                      else if (key === 'axisDistance') { label = 'Khoảng cách trục'; unit = 'mm'; }
                      else if (key === 'module') { label = 'Mô-đun'; }
                      else if (key === 'angle') { label = 'Góc nghiêng'; unit = '°'; }
                      else if (key === 'width') { label = 'Chiều rộng'; unit = 'mm'; }
                      else if (key === 'material') { label = 'Vật liệu'; }
                      else if (key === 'hardness') { label = 'Độ cứng'; }
                      else if (key === 'efficiency') { 
                        label = 'Hiệu suất'; 
                        value = `${(value as number * 100).toFixed(1)}%`;
                      }
                      
                      return (
                        <View key={key} style={styles.componentSpecRow}>
                          <Text style={styles.componentSpecLabel}>{label}:</Text>
                          <Text style={styles.componentSpecValue}>
                            {value} {unit}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            ))}
          </View>
          
          {/* Các nút chức năng */}
          <View style={styles.actionButtons}>
            <Pressable 
              style={[styles.button, styles.primaryButton]} 
              onPress={() => router.push('/(tabs)/reportGenerator')}
            >
              <Text style={styles.buttonText}>Xuất Báo Cáo Tính Toán</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.button, styles.secondaryButton]} 
              onPress={() => router.back()}
            >
              <Text style={styles.buttonSecondaryText}>Quay Lại Cấu Hình</Text>
            </Pressable>
          </View>
        </>
      )}
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
    marginTop: 40,
    marginBottom: 24,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  motorCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    overflow: 'hidden',
  },
  motorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  motorModel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  motorPower: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  motorSpecs: {
    marginBottom: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  specLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  specValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  evaluationContainer: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    padding: 12,
    borderRadius: 8,
  },
  evaluationTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  evaluationText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  ratioCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  ratioHeader: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  ratioHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  ratioDistribution: {
    padding: 16,
  },
  ratioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  ratioItemName: {
    fontSize: 14,
    color: '#aaa',
  },
  ratioItemValue: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '600',
  },
  efficiencyContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
  },
  efficiencyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  componentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  componentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  componentContent: {
    flexDirection: 'row',
    padding: 16,
  },
  componentImageContainer: {
    width: 100,
    height: 100,
    marginRight: 16,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  imagePlaceholderText: {
    color: '#aaa',
    fontSize: 14,
  },
  componentSpecs: {
    flex: 1,
  },
  componentSpecRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  componentSpecLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  componentSpecValue: {
    fontSize: 14,
    color: '#fff',
  },
  actionButtons: {
    marginVertical: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 25,
    marginBottom: 12,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#4A90E2',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A90E2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
});