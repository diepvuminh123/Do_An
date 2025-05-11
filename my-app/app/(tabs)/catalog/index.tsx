// app/tabs/catalog/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
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
  results: number;
  total: number;
  totalPages: number;
  currentPage: number;
  data: {
    gearboxes: GearboxItem[];
  };
}

export default function CatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [gearboxes, setGearboxes] = useState<GearboxItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchGearboxes = async (page = 1, search = searchQuery) => {
    try {
      setLoading(true);
      setError(null);
      
      // Xây dựng URL với tham số truy vấn
      const url = `${API_URL}/api/gearboxes?page=${page}&limit=10${search ? `&search=${search}` : ''}`;
      
      // Gọi API
      const response = await axios.get<ApiResponse>(url);
      
      if (response.data.status === 'success') {
        setGearboxes(response.data.data.gearboxes);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.total);
        setCurrentPage(response.data.currentPage);
      } else {
        setError('Không thể lấy dữ liệu. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Error fetching gearboxes:', err);
      setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      
      // Mock data cho trường hợp phát triển
      setGearboxes([
        {
          _id: "682022c47156ec8fb315265b",
          motorType: "7,5kW",
          outputSpeedRpm: "405",
          ratio: "3,58",
          outputTorqueNm: "173",
          serviceFactor: "1,17",
          overhungLoad: "4803",
          unitDesignation: "R04223.6_M_-__7.5A--",
          baseUnitWeightKg: "99",
          motorSize: "132M"
        },
        // Thêm các mục khác nếu cần
      ]);
      setTotalPages(1);
      setTotalItems(1);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch dữ liệu ban đầu khi component mount
  useEffect(() => {
    fetchGearboxes();
  }, []);

  // Xử lý tìm kiếm với debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      fetchGearboxes(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Xử lý refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setCurrentPage(1);
    fetchGearboxes(1);
  };

  // Xử lý tải thêm dữ liệu
  const handleLoadMore = () => {
    if (currentPage < totalPages && !loading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchGearboxes(nextPage);
    }
  };

  // Chuyển đến trang chi tiết
    const goToDetail = (id: string) => {
    router.push({
        pathname: '/catalog/[id]',
        params: { id }
    });
    };

  // Render mỗi item trong danh sách
  const renderGearboxItem = ({ item }: { item: GearboxItem }) => (
    <TouchableOpacity 
      style={styles.gearboxCard}
      onPress={() => goToDetail(item._id)}
    >
      <View style={styles.gearboxHeader}>
        <View style={styles.gearboxImageContainer}>
          <Image
            source={require('@/assets/images/Gearbox.png')} 
            style={styles.gearboxImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.gearboxTitleContainer}>
          <Text style={styles.gearboxTitle}>{item.unitDesignation}</Text>
          <Text style={styles.gearboxSubtitle}>
            Công suất: {item.motorType} | Tỉ số truyền: {item.ratio}
          </Text>
        </View>
      </View>
      
      <View style={styles.gearboxSpecs}>
        <View style={styles.specRow}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Tốc độ đầu ra</Text>
            <Text style={styles.specValue}>{item.outputSpeedRpm} vg/ph</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Mô-men</Text>
            <Text style={styles.specValue}>{item.outputTorqueNm} Nm</Text>
          </View>
        </View>
        
        <View style={styles.specRow}>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Hệ số vận hành</Text>
            <Text style={styles.specValue}>{item.serviceFactor}</Text>
          </View>
          <View style={styles.specItem}>
            <Text style={styles.specLabel}>Khối lượng</Text>
            <Text style={styles.specValue}>{item.baseUnitWeightKg} kg</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.viewDetailsContainer}>
        <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
        <FontAwesome name="chevron-right" size={12} color="#4A90E2" />
      </View>
    </TouchableOpacity>
  );

  // Render phần footer của list
  const renderFooter = () => {
    if (!loading || refreshing) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#4A90E2" />
        <Text style={styles.footerText}>Đang tải thêm...</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh Mục Hộp Giảm Tốc</Text>
      
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={16} color="#aaa" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm hộp giảm tốc..."
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times-circle" size={16} color="#aaa" style={styles.clearIcon} />
          </TouchableOpacity>
        )}
      </View>
      
      {/* Kết quả số lượng */}
      <Text style={styles.resultsCount}>
        {totalItems} kết quả được tìm thấy
      </Text>
      
      {/* Hiển thị lỗi nếu có */}
      {error && (
        <View style={styles.errorContainer}>
          <FontAwesome name="exclamation-circle" size={20} color="#e74c3c" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      
      {/* Danh sách các hộp giảm tốc */}
      <FlatList
        data={gearboxes}
        renderItem={renderGearboxItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.gearboxList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#4A90E2" />
            ) : (
              <>
                <FontAwesome name="exclamation-circle" size={50} color="#ccc" />
                <Text style={styles.emptyText}>Không tìm thấy kết quả nào</Text>
              </>
            )}
          </View>
        )}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#4A90E2"]}
            tintColor="#4A90E2"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
      />
      
      {/* Phân trang */}
      {gearboxes.length > 0 && (
        <View style={styles.paginationContainer}>
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
            onPress={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                fetchGearboxes(currentPage - 1);
              }
            }}
            disabled={currentPage === 1}
          >
            <FontAwesome name="chevron-left" size={14} color={currentPage === 1 ? "#888" : "#fff"} />
          </TouchableOpacity>
          
          <Text style={styles.paginationText}>
            Trang {currentPage} / {totalPages}
          </Text>
          
          <TouchableOpacity 
            style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
            onPress={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                fetchGearboxes(currentPage + 1);
              }
            }}
            disabled={currentPage === totalPages}
          >
            <FontAwesome name="chevron-right" size={14} color={currentPage === totalPages ? "#888" : "#fff"} />
          </TouchableOpacity>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: 40,
    marginBottom: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
  },
  clearIcon: {
    marginLeft: 10,
  },
  resultsCount: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#e74c3c',
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#ccc',
    marginTop: 16,
    fontSize: 16,
  },
  gearboxList: {
    paddingBottom: 16,
  },
  gearboxCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gearboxHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  gearboxImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  gearboxImage: {
    width: 70,
    height: 70,
  },
  gearboxTitleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  gearboxTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A90E2',
    marginBottom: 4,
  },
  gearboxSubtitle: {
    fontSize: 14,
    color: '#fff',
  },
  gearboxSpecs: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specItem: {
    width: '48%',
  },
  specLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 4,
  },
  specValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '500',
  },
  viewDetailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  viewDetailsText: {
    fontSize: 14,
    color: '#4A90E2',
    marginRight: 8,
  },
  footerLoader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    color: '#aaa',
    marginLeft: 8,
    fontSize: 14,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  paginationButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.8)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  paginationText: {
    color: '#fff',
    marginHorizontal: 16,
    fontSize: 14,
  },
});