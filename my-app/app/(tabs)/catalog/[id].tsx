// app/tabs/catalog/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Pressable
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import axios from 'axios';
const API_URL = 'http://localhost:9898';

// Định nghĩa interface cho item hộp giảm tốc
interface GearboxItem {
  _id: string;
  motorType: string;
  outputSpeedRpm: string;
  ratio: string;
  outputTorqueNm: string;
  serviceFactor: string;
  overhungLoad: string;
  unitDesignation: string;
  baseUnitWeightKg: string;
  motorSize: string;
}

// Định nghĩa interface cho response API
interface ApiResponse {
  status: string;
  data: {
    gearbox: GearboxItem;
    relatedGearboxes: GearboxItem[];
  };
}

// Danh sách các thông số kỹ thuật để hiển thị
const specsList = [
  { key: 'motorType', label: 'Công suất động cơ', unit: '' },
  { key: 'outputSpeedRpm', label: 'Tốc độ đầu ra', unit: 'vg/ph' },
  { key: 'ratio', label: 'Tỉ số truyền', unit: '' },
  { key: 'outputTorqueNm', label: 'Mô-men đầu ra', unit: 'Nm' },
  { key: 'serviceFactor', label: 'Hệ số vận hành', unit: '' },
  { key: 'overhungLoad', label: 'Tải trọng ngang', unit: 'N' },
  { key: 'baseUnitWeightKg', label: 'Khối lượng', unit: 'kg' },
  { key: 'motorSize', label: 'Kích thước động cơ', unit: '' }
];

export default function CatalogDetailScreen() {
  const params = useLocalSearchParams();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gearbox, setGearbox] = useState<GearboxItem | null>(null);
  const [relatedGearboxes, setRelatedGearboxes] = useState<GearboxItem[]>([]);

  useEffect(() => {
    fetchGearboxDetail();
  }, [id]);

  const fetchGearboxDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Gọi API lấy chi tiết
      const url = `${API_URL}/api/gearboxes/${id}`;
      const response = await axios.get<ApiResponse>(url);
      
      if (response.data.status === 'success') {
        setGearbox(response.data.data.gearbox);
        setRelatedGearboxes(response.data.data.relatedGearboxes);
      } else {
        setError('Không thể lấy thông tin chi tiết. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error fetching gearbox details:', err);
      setError('Đã xảy ra lỗi khi tải thông tin chi tiết. Vui lòng thử lại sau.');
      
      // Mock data cho trường hợp phát triển
      const mockDetail: GearboxItem = {
        _id: id as string,
        motorType: "7,5kW",
        outputSpeedRpm: "405",
        ratio: "3,58",
        outputTorqueNm: "173",
        serviceFactor: "1,17",
        overhungLoad: "4803",
        unitDesignation: "R04223.6_M_-__7.5A--",
        baseUnitWeightKg: "99",
        motorSize: "132M"
      };
      
      const mockRelated: GearboxItem[] = [
        {
          _id: "682022c47156ec8fb315265c",
          motorType: "5,5kW",
          outputSpeedRpm: "380",
          ratio: "3,82",
          outputTorqueNm: "138",
          serviceFactor: "1,25",
          overhungLoad: "4210",
          unitDesignation: "R03817.2_M_-__5.5A--",
          baseUnitWeightKg: "87",
          motorSize: "132S"
        },
        {
          _id: "682022c47156ec8fb315265d",
          motorType: "11kW",
          outputSpeedRpm: "320",
          ratio: "4,53",
          outputTorqueNm: "328",
          serviceFactor: "1,32",
          overhungLoad: "5740",
          unitDesignation: "R05326.8_M_-__11A--",
          baseUnitWeightKg: "125",
          motorSize: "160M"
        }
      ];
      
      setGearbox(mockDetail);
      setRelatedGearboxes(mockRelated);
    } finally {
      setLoading(false);
    }
  };

    const goToDetail = (newId: string) => {
    router.push({
        pathname: '/catalog/[id]',
        params: { id: newId }
    });
    };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Đang tải thông tin chi tiết...</Text>
        </View>
      </View>
    );
  }

  if (error || !gearbox) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-triangle" size={50} color="#e74c3c" />
          <Text style={styles.errorText}>
            {error || 'Không tìm thấy thông tin hộp giảm tốc'}
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Pressable style={styles.backButtonSmall} onPress={() => router.back()}>
        <FontAwesome name="arrow-left" size={16} color="#fff" />
        <Text style={styles.backButtonSmallText}>Quay lại</Text>
      </Pressable>
      
      <Text style={styles.title}>Chi Tiết Hộp Giảm Tốc</Text>
      
      {/* Phần thông tin chính */}
      <View style={styles.mainInfoContainer}>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/Gearbox.png')} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{gearbox.unitDesignation}</Text>
          <Text style={styles.productCategory}>
            Hộp giảm tốc công nghiệp {gearbox.motorType}
          </Text>
        </View>
        
        <View style={styles.keySpecsContainer}>
          <View style={styles.keySpecItem}>
            <Text style={styles.keySpecValue}>{gearbox.outputTorqueNm} Nm</Text>
            <Text style={styles.keySpecLabel}>Mô-men</Text>
          </View>
          
          <View style={styles.keySpecDivider} />
          
          <View style={styles.keySpecItem}>
            <Text style={styles.keySpecValue}>{gearbox.ratio}</Text>
            <Text style={styles.keySpecLabel}>Tỉ số truyền</Text>
          </View>
          
          <View style={styles.keySpecDivider} />
          
          <View style={styles.keySpecItem}>
            <Text style={styles.keySpecValue}>{gearbox.outputSpeedRpm}</Text>
            <Text style={styles.keySpecLabel}>Tốc độ (vg/ph)</Text>
          </View>
        </View>
      </View>
      
      {/* Phần thông số kỹ thuật */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông Số Kỹ Thuật</Text>
        
        <View style={styles.specsTable}>
          {specsList.map((spec, index) => (
            <View key={spec.key} style={styles.specRow}>
              <Text style={styles.specLabel}>{spec.label}</Text>
              <Text style={styles.specValue}>
                {gearbox[spec.key as keyof GearboxItem]} {spec.unit}
              </Text>
            </View>
          ))}
        </View>
      </View>
      
      {/* Phần ứng dụng */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ứng Dụng</Text>
        
        <View style={styles.applicationContainer}>
          <Text style={styles.applicationText}>
            Hộp giảm tốc {gearbox.unitDesignation} phù hợp với các ứng dụng:
          </Text>
          
          <View style={styles.applicationList}>
            <View style={styles.applicationItem}>
              <FontAwesome name="check-circle" size={16} color="#4caf50" style={styles.applicationIcon} />
              <Text style={styles.applicationItemText}>Máy sản xuất và đóng gói</Text>
            </View>
            
            <View style={styles.applicationItem}>
              <FontAwesome name="check-circle" size={16} color="#4caf50" style={styles.applicationIcon} />
              <Text style={styles.applicationItemText}>Băng tải công nghiệp</Text>
            </View>
            
            <View style={styles.applicationItem}>
              <FontAwesome name="check-circle" size={16} color="#4caf50" style={styles.applicationIcon} />
              <Text style={styles.applicationItemText}>Thiết bị nâng hạ</Text>
            </View>
            
            <View style={styles.applicationItem}>
              <FontAwesome name="check-circle" size={16} color="#4caf50" style={styles.applicationIcon} />
              <Text style={styles.applicationItemText}>Hệ thống xử lý vật liệu</Text>
            </View>
          </View>
        </View>
      </View>
      
      {/* Phần sản phẩm liên quan */}
      {relatedGearboxes.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản Phẩm Liên Quan</Text>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.relatedProductsContainer}
          >
            {relatedGearboxes.map((item) => (
              <TouchableOpacity 
                key={item._id} 
                style={styles.relatedProductCard}
                onPress={() => goToDetail(item._id)}
              >
                <Image
                  source={require('@/assets/images/Gearbox.png')} 
                  style={styles.relatedProductImage}
                  resizeMode="contain"
                />
                
                <Text style={styles.relatedProductName} numberOfLines={1}>{item.unitDesignation}</Text>
                
                <View style={styles.relatedProductSpecs}>
                  <Text style={styles.relatedProductSpec}>
                    <Text style={styles.relatedProductSpecLabel}>Công suất: </Text>
                    {item.motorType}
                  </Text>
                  
                  <Text style={styles.relatedProductSpec}>
                    <Text style={styles.relatedProductSpecLabel}>Tỉ số: </Text>
                    {item.ratio}
                  </Text>
                  
                  <Text style={styles.relatedProductSpec}>
                    <Text style={styles.relatedProductSpecLabel}>Mô-men: </Text>
                    {item.outputTorqueNm} Nm
                  </Text>
                </View>
                
                <View style={styles.relatedProductViewButton}>
                  <Text style={styles.relatedProductViewButtonText}>Xem chi tiết</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
      
      {/* Nút tư vấn */}
      <TouchableOpacity style={styles.consultButton}>
        <Text style={styles.consultButtonText}>Liên hệ tư vấn</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001627',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  backButtonSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 16,
  },
  backButtonSmallText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  mainInfoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  image: {
    width: '100%',
    height: 180,
  },
  productHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#aaa',
  },
  keySpecsContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  keySpecItem: {
    flex: 1,
    alignItems: 'center',
  },
  keySpecValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  keySpecLabel: {
    fontSize: 12,
    color: '#aaa',
  },
  keySpecDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
  },
  section: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  specsTable: {
    padding: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
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
  applicationContainer: {
    padding: 16,
  },
  applicationText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 16,
  },
  applicationList: {
    marginBottom: 8,
  },
  applicationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  applicationIcon: {
    marginRight: 10,
  },
  applicationItemText: {
    fontSize: 14,
    color: '#fff',
  },
  relatedProductsContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  relatedProductCard: {
    width: 160,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 8,
    marginRight: 12,
    overflow: 'hidden',
  },
  relatedProductImage: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  relatedProductName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4A90E2',
    padding: 8,
    paddingBottom: 4,
  },
  relatedProductSpecs: {
    padding: 8,
    paddingTop: 0,
  },
  relatedProductSpec: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  relatedProductSpecLabel: {
    color: '#aaa',
  },
  relatedProductViewButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    padding: 8,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  relatedProductViewButtonText: {
    fontSize: 12,
    color: '#4A90E2',
  },
  consultButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingVertical: 16,
    marginBottom: 40,
    alignItems: 'center',
  },
  consultButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});