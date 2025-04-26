import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

// Định nghĩa kiểu dữ liệu cho tin nhắn
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isQuickReply?: boolean;
}

// Các câu hỏi gợi ý
const suggestions = [
  "Làm sao để tính công suất động cơ?",
  "Tỉ số truyền tổng là gì?",
  "Cách chọn động cơ phù hợp?",
  "Khi nào cần dùng bộ truyền xích?",
  "Hiệu suất hệ thống là gì?",
  "Làm thế nào để tính toán mô-men xoắn?",
];

// Câu trả lời theo từ khóa
const keywordResponses = {
  'công suất': 'Công suất động cơ được tính bằng công thức P = (F × v) / 1000, trong đó F là lực kéo (N) và v là vận tốc băng tải (m/s).',
  'tỉ số': 'Tỉ số truyền tổng (u_t) là tích của các tỉ số truyền thành phần. Trong ứng dụng này, u_t = u_xích × u_bánh_răng_1 × u_bánh_răng_2.',
  'động cơ': 'Động cơ được chọn dựa trên công suất cần thiết (P_ct), số vòng quay yêu cầu và hệ số an toàn. Thông thường chọn P_đc ≥ 1.1 × P_ct.',
  'xích': 'Bộ truyền xích thường được sử dụng khi cần truyền công suất lớn ở tốc độ thấp và trung bình, đặc biệt trong môi trường bụi bẩn.',
  'hiệu suất': 'Hiệu suất hệ thống là tích các hiệu suất thành phần: η = η_xích × η_bánh_răng² × η_ổ_lăn⁴ × η_khớp_nối.',
  'mô-men': 'Mô-men xoắn được tính theo công thức: T = 9.55 × 10⁶ × (P / n), trong đó P là công suất (kW) và n là số vòng quay (vg/ph).',
  'báo cáo': 'Bạn có thể tạo báo cáo PDF trong tab "Báo Cáo" sau khi hoàn tất các tính toán thiết kế.',
  'vật liệu': 'Các bánh răng thường được làm từ thép 40X với độ cứng 45-50 HRC để đảm bảo độ bền và khả năng chịu tải.',
};

export default function ChatboxAdvancedScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là trợ lý ảo hỗ trợ tính toán hộp giảm tốc. Bạn cần giúp đỡ gì không?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Mảng các câu trả lời có sẵn cho bot
  const botResponses = [
    "Để tính toán công suất, bạn cần biết lực kéo và vận tốc băng tải.",
    "Tỉ số truyền tổng là tích các tỉ số truyền thành phần.",
    "Bạn có thể xem thêm thông tin chi tiết trong phần Thông Số Kỹ Thuật.",
    "Hiệu suất hệ thống thường dao động từ 85-95% tùy vào từng loại bộ truyền.",
    "Bạn cần nhập đủ các thông số trong phần Cấu Hình Động Cơ để nhận kết quả chính xác.",
    "Ứng dụng hỗ trợ tính toán cho băng tải có lực kéo từ 1000-15000N.",
    "Động cơ được đề xuất dựa trên công suất tính toán và hệ số an toàn.",
    "Bạn có thể xuất báo cáo PDF từ phần Báo Cáo sau khi hoàn tất tính toán.",
  ];

  // Phân tích tin nhắn người dùng
  const analyzeUserMessage = (message: string) => {
    message = message.toLowerCase();
    
    // Kiểm tra từ khóa trong tin nhắn
    for (const keyword in keywordResponses) {
      if (message.includes(keyword)) {
        return keywordResponses[keyword as keyof typeof keywordResponses];
      }
    }
    
    // Nếu không tìm thấy từ khóa, trả về câu trả lời ngẫu nhiên
    const randomIndex = Math.floor(Math.random() * botResponses.length);
    return botResponses[randomIndex];
  };

  // Gửi tin nhắn
  const sendMessage = (text = inputText) => {
    if (text.trim() === '') return;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
      isQuickReply: text !== inputText,
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsTyping(true);
    setShowSuggestions(false);
    
    // Scroll xuống tin nhắn mới nhất
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 100);
    
    // Giả lập bot đang nhập tin nhắn
    setTimeout(() => {
      // Phân tích tin nhắn và trả lời phù hợp
      const botReply = analyzeUserMessage(text);
      
      const newBotMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setIsTyping(false);
      
      // Hiển thị lại các gợi ý sau khi bot trả lời
      setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
      
      // Scroll xuống tin nhắn mới nhất
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }, 1500);
  };

  // Xóa lịch sử chat
  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: 'Xin chào! Tôi là trợ lý ảo hỗ trợ tính toán hộp giảm tốc. Bạn cần giúp đỡ gì không?',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    setShowSuggestions(true);
  };

  // Hiển thị thông tin kỹ thuật
  const showTechnicalInfo = (infoType: string) => {
    let info = '';
    
    switch(infoType) {
      case 'formula':
        info = `Các công thức quan trọng:

• Công suất làm việc: P = (F × v) / 1000
• Số vòng quay trục công tác: n = (60000 × v) / (π × D)
• Mô-men xoắn: T = 9.55 × 10⁶ × (P / n)
• Tỉ số truyền tổng: u_t = n_đc / n_lv
• Công suất tương đương: P_td = P_lv × √[(t₁(T₁/T)² + t₂(T₂/T)²)/(t₁+t₂)]`;
        break;
      case 'motor':
        info = `Thông số động cơ K160S4:

• Công suất: 7.5 kW
• Tốc độ quay: 1450 vg/ph
• Hiệu suất: 89%
• Hệ số công suất: 0.82
• Khối lượng: 94 kg
• Dòng điện định mức: 15.5 A
• Điện áp: 380V
• Mô-men khởi động: 2.2 × mô-men định mức`;
        break;
      case 'transmission':
        info = `Thông số bộ truyền:

• Bộ truyền xích:
  - Bước xích: 19.05 mm
  - Số răng đĩa chủ động/bị động: 18/46
  - Tỉ số truyền: 2.578
  - Hiệu suất: 96%

• Hộp giảm tốc bánh răng trụ:
  - Cấp 1: z₁/z₂ = 18/102, mô-đun = 4, u = 5.66
  - Cấp 2: z₁/z₂ = 22/70, mô-đun = 3, u = 3.18
  - Hiệu suất mỗi cấp: 96%`;
        break;
    }
    
    setSelectedInfo(info);
    setShowInfoModal(true);
  };

  // Chuyển đến các tab khác trong ứng dụng
  const navigateTo = (screen: string) => {
    router.push(`../(tabs)/${screen}`);
  };

  // Format thời gian tin nhắn
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Render từng tin nhắn
  const renderMessage = ({ item }: { item: Message }) => {
    return (
      <View style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
        item.isQuickReply && styles.quickReplyContainer
      ]}>
        <View style={[
          styles.messageBubble,
          item.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble,
          item.isQuickReply && styles.quickReplyBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timeText}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <View style={styles.header}>
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => router.back()}
              >
                <FontAwesome name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Trợ Lý Ảo Nâng Cao</Text>
              <TouchableOpacity 
                style={styles.headerActionButton} 
                onPress={clearChat}
              >
                <FontAwesome name="trash" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.messagesContainer}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
              onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
            />
            
            {isTyping && (
              <View style={styles.typingContainer}>
                <View style={styles.typingBubble}>
                  <View style={styles.typingIndicator}>
                    <View style={styles.typingDot} />
                    <View style={[styles.typingDot, styles.typingDotMiddle]} />
                    <View style={styles.typingDot} />
                  </View>
                </View>
              </View>
            )}
            
            {showSuggestions && messages.length > 0 && !isTyping && (
              <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.suggestionsContainer}
              >
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.suggestionBubble}
                    onPress={() => sendMessage(suggestion)}
                  >
                    <Text style={styles.suggestionText}>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => navigateTo('motorConfig')}
              >
                <FontAwesome name="cog" size={18} color="#4A90E2" />
                <Text style={styles.actionText}>Cấu hình</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => navigateTo('gearboxRecommendations')}
              >
                <FontAwesome name="gears" size={18} color="#4A90E2" />
                <Text style={styles.actionText}>Bộ truyền</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => navigateTo('reportGenerator')}
              >
                <FontAwesome name="file-text" size={18} color="#4A90E2" />
                <Text style={styles.actionText}>Báo cáo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => showTechnicalInfo('formula')}
              >
                <FontAwesome name="calculator" size={18} color="#4A90E2" />
                <Text style={styles.actionText}>Công thức</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập tin nhắn..."
                placeholderTextColor="#8a8a8a"
                value={inputText}
                onChangeText={setInputText}
                multiline={true}
                numberOfLines={1}
                returnKeyType="send"
                onSubmitEditing={() => sendMessage()}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  !inputText.trim() && styles.disabledSendButton
                ]} 
                onPress={() => sendMessage()}
                disabled={!inputText.trim()}
              >
                <FontAwesome name="send" size={20} color={!inputText.trim() ? "#8a8a8a" : "#fff"} />
              </TouchableOpacity>
            </View>
            
            {/* Modal hiển thị thông tin chi tiết */}
            <Modal
              visible={showInfoModal}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowInfoModal(false)}
            >
              <TouchableWithoutFeedback onPress={() => setShowInfoModal(false)}>
                <View style={styles.modalOverlay}>
                  <TouchableWithoutFeedback>
                    <View style={styles.modalContent}>
                      <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Thông tin kỹ thuật</Text>
                        <TouchableOpacity onPress={() => setShowInfoModal(false)}>
                          <FontAwesome name="times" size={20} color="#fff" />
                        </TouchableOpacity>
                      </View>
                      <ScrollView style={styles.modalBody}>
                        <Text style={styles.modalText}>{selectedInfo}</Text>
                      </ScrollView>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001627',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  messageContainer: {
    marginVertical: 8,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  botMessageContainer: {
    alignSelf: 'flex-start',
  },
  quickReplyContainer: {
    maxWidth: '70%',
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
  },
  userMessageBubble: {
    backgroundColor: '#4A90E2',
    borderBottomRightRadius: 4,
  },
  botMessageBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomLeftRadius: 4,
  },
  quickReplyBubble: {
    backgroundColor: 'rgba(74, 144, 226, 0.7)',
  },
  messageText: {
    color: '#fff',
    fontSize: 16,
  },
  timeText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    alignSelf: 'flex-end',
    marginTop: 4,
    marginRight: 2,
  },
  typingContainer: {
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginVertical: 8,
  },
  typingBubble: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 10,
    minHeight: 40,
    justifyContent: 'center',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    marginHorizontal: 3,
    opacity: 0.7,
  },
  typingDotMiddle: {
    opacity: 0.5,
  },
  suggestionsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  suggestionBubble: {
    backgroundColor: 'rgba(74, 144, 226, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.4)',
  },
  suggestionText: {
    color: '#fff',
    fontSize: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: 'rgba(74, 144, 226, 0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#001F36',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 1,
    borderColor: 'rgba(74, 144, 226, 0.4)',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalBody: {
    padding: 16,
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  modalText: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
  },
});