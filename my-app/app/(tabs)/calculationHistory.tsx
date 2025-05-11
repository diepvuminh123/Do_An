import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';

interface CalculationHistoryEntry {
  id: string;
  date: string;
  description: string;
  parameters: {
    forceF: string;
    beltSpeed: string;
    drumDiameter: string;
    lifetimeYears: string;
    loadTimeRatioT1: string;
    loadTimeRatioT2: string;
    loadRatioT1: string;
    loadRatioT2: string;
  };
  results: {
    workingPower: number;
    equivalentPower: number;
    systemEfficiency: number;
    requiredPower: number;
    rotationSpeed: number;
    torque: number;
    totalRatio: number;
    motorRpm: number;
  };
}

export default function CalculationHistoryScreen() {
  const [calculationHistory, setCalculationHistory] = useState<CalculationHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Giả lập dữ liệu lịch sử tính toán
  useEffect(() => {
    // Trong thực tế, bạn sẽ lấy dữ liệu từ API hoặc AsyncStorage
    const mockData: CalculationHistoryEntry[] = [
      {
        id: '1',
        date: '12/05/2025 10:30 AM',
        description: 'Phương án 1',
        parameters: {
          forceF: '8500',
          beltSpeed: '0.8',
          drumDiameter: '500',
          lifetimeYears: '10',
          loadTimeRatioT1: '20',
          loadTimeRatioT2: '48',
          loadRatioT1: '1',
          loadRatioT2: '0.6'
        },
        results: {
          workingPower: 6.8,
          equivalentPower: 5.32,
          systemEfficiency: 0.85,
          requiredPower: 6.26,
          rotationSpeed: 30.56,
          torque: 2062450.0,
          totalRatio: 47.45,
          motorRpm: 1450
        }
      },
      {
        id: '2',
        date: '11/05/2025 3:45 PM',
        description: 'Phương án 2',
        parameters: {
          forceF: '7500',
          beltSpeed: '0.9',
          drumDiameter: '550',
          lifetimeYears: '8',
          loadTimeRatioT1: '36',
          loadTimeRatioT2: '15',
          loadRatioT1: '1',
          loadRatioT2: '0.5'
        },
        results: {
          workingPower: 6.75,
          equivalentPower: 5.26,
          systemEfficiency: 0.857,
          requiredPower: 6.14,
          rotationSpeed: 31.25,
          torque: 2062866.01,
          totalRatio: 46.4,
          motorRpm: 1450
        }
      },
      {
        id: '3',
        date: '10/05/2025 9:15 AM',
        description: 'Phương án tùy chỉnh',
        parameters: {
          forceF: '8200',
          beltSpeed: '0.85',
          drumDiameter: '530',
          lifetimeYears: '9',
          loadTimeRatioT1: '30',
          loadTimeRatioT2: '20',
          loadRatioT1: '1',
          loadRatioT2: '0.7'
        },
        results: {
          workingPower: 6.97,
          equivalentPower: 5.58,
          systemEfficiency: 0.86,
          requiredPower: 6.49,
          rotationSpeed: 30.65,
          torque: 2155000.0,
          totalRatio: 47.31,
          motorRpm: 1450
        }
      }
    ];

    // Giả lập thời gian tải dữ liệu
    setTimeout(() => {
      setCalculationHistory(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  const viewCalculationDetails = (calculation: CalculationHistoryEntry) => {
    // Trong thực tế, bạn có thể chuyển đến màn hình hiển thị báo cáo với dữ liệu đã lưu
    router.push({
      pathname: '/reportGenerator',
      params: {
        calculationId: calculation.id
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lịch Sử Tính Toán</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
        </View>
      ) : (
        <ScrollView>
          {calculationHistory.length > 0 ? (
            calculationHistory.map((calculation) => (
              <Pressable 
                key={calculation.id}
                style={styles.calculationCard}
                onPress={() => viewCalculationDetails(calculation)}
              >
                <View style={styles.calculationHeader}>
                  <Text style={styles.calculationTitle}>{calculation.description}</Text>
                  <Text style={styles.calculationDate}>{calculation.date}</Text>
                </View>
                
                <View style={styles.calculationDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Công suất yêu cầu:</Text>
                    <Text style={styles.detailValue}>{calculation.results.requiredPower.toFixed(2)} kW</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Moment xoắn:</Text>
                    <Text style={styles.detailValue}>{calculation.results.torque.toLocaleString()} N.mm</Text>
                  </View>
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Số vòng quay trục công tác:</Text>
                    <Text style={styles.detailValue}>{calculation.results.rotationSpeed.toFixed(2)} v/p</Text>
                  </View>
                </View>
                
                <View style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
                </View>
              </Pressable>
            ))
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>
                Chưa có dữ liệu tính toán nào được lưu trữ.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
      
      <Pressable 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Text style={styles.backButtonText}>Quay lại trang cấu hình</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001627',
    padding: 16,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  calculationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  calculationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculationTitle: {
    color: '#4A90E2',
    fontSize: 18,
    fontWeight: 'bold',
  },
  calculationDate: {
    color: '#aaa',
    fontSize: 12,
  },
  calculationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    color: '#ccc',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  viewDetailsButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  viewDetailsText: {
    color: '#4A90E2',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyStateContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyStateText: {
    color: '#ccc',
    textAlign: 'center',
    fontSize: 16,
  },
  backButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
});
