import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ChatboxIndexScreen() {
  const [selectedMode, setSelectedMode] = useState<'basic' | 'advanced'>('basic');

  const navigateToChatMode = () => {
    if (selectedMode === 'basic') {
      router.push('./basic');
    } else {
      router.push('./advanced');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Trợ Lý Ảo</Text>
          <Text style={styles.subtitle}>Hỗ trợ tính toán hộp giảm tốc</Text>
        </View>

        <View style={styles.infoCard}>
          <FontAwesome name="info-circle" size={24} color="#4A90E2" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Trợ lý ảo sẽ giúp bạn giải đáp thắc mắc về việc tính toán và thiết kế hộp giảm tốc.
            Bạn có thể hỏi về công thức, thông số kỹ thuật, hoặc hướng dẫn sử dụng ứng dụng.
          </Text>
        </View>

        <View style={styles.modeSelectionContainer}>
          <Text style={styles.sectionTitle}>Chọn chế độ trò chuyện:</Text>
          
          <TouchableOpacity 
            style={[
              styles.modeOption,
              selectedMode === 'basic' && styles.selectedModeOption
            ]}
            onPress={() => setSelectedMode('basic')}
          >
            <View style={styles.modeIconContainer}>
              <FontAwesome 
                name="comments" 
                size={28} 
                color={selectedMode === 'basic' ? '#fff' : '#4A90E2'} 
              />
            </View>
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>Trợ lý cơ bản</Text>
              <Text style={styles.modeDescription}>
                Giao diện đơn giản, dễ sử dụng với các câu trả lời cơ bản
              </Text>
            </View>
            <View style={styles.modeCheckContainer}>
              {selectedMode === 'basic' && (
                <FontAwesome name="check-circle" size={24} color="#4A90E2" />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.modeOption,
              selectedMode === 'advanced' && styles.selectedModeOption
            ]}
            onPress={() => setSelectedMode('advanced')}
          >
            <View style={styles.modeIconContainer}>
              <FontAwesome 
                name="comments-o" 
                size={28} 
                color={selectedMode === 'advanced' ? '#fff' : '#4A90E2'} 
              />
            </View>
            <View style={styles.modeTextContainer}>
              <Text style={styles.modeTitle}>Trợ lý nâng cao</Text>
              <Text style={styles.modeDescription}>
                Hỗ trợ câu hỏi gợi ý, truy cập nhanh thông tin kỹ thuật và liên kết đến các tính năng khác
              </Text>
            </View>
            <View style={styles.modeCheckContainer}>
              {selectedMode === 'advanced' && (
                <FontAwesome name="check-circle" size={24} color="#4A90E2" />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Tính năng:</Text>
          
          <View style={styles.featureRow}>
            <View style={styles.featureIconContainer}>
              <FontAwesome name="question-circle" size={20} color="#4A90E2" />
            </View>
            <Text style={styles.featureText}>Hỏi đáp về cách tính toán hộp giảm tốc</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.featureIconContainer}>
              <FontAwesome name="calculator" size={20} color="#4A90E2" />
            </View>
            <Text style={styles.featureText}>Tra cứu công thức và thông số kỹ thuật</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.featureIconContainer}>
              <FontAwesome name="lightbulb-o" size={20} color="#4A90E2" />
            </View>
            <Text style={styles.featureText}>Gợi ý các bước tính toán phù hợp</Text>
          </View>
          
          <View style={styles.featureRow}>
            <View style={styles.featureIconContainer}>
              <FontAwesome name="link" size={20} color="#4A90E2" />
            </View>
            <Text style={styles.featureText}>Truy cập nhanh đến các phần của ứng dụng</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.startButton}
          onPress={navigateToChatMode}
        >
          <Text style={styles.startButtonText}>Bắt đầu trò chuyện</Text>
          <FontAwesome name="arrow-right" size={20} color="#fff" style={styles.startButtonIcon} />
        </TouchableOpacity>
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
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: 'rgba(74, 144, 226, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.3)',
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  modeSelectionContainer: {
    marginBottom: 24,
  },
  modeOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  selectedModeOption: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderColor: '#4A90E2',
  },
  modeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeTextContainer: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#aaa',
  },
  modeCheckContainer: {
    width: 30,
    alignItems: 'center',
  },
  featuresContainer: {
    marginBottom: 30,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  startButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  startButtonIcon: {
    marginLeft: 10,
  },
});