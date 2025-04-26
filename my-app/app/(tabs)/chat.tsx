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
  Keyboard,
  TouchableWithoutFeedback,
  SafeAreaView,
  Modal,
  ScrollView,
  Dimensions,
  Switch,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';

// Import từ service và components
import { 
  Message, 
  botResponses, 
  suggestions, 
  analyzeUserMessage, 
  technicalInfo,
  formatTime,
  createMessage
} from '../helpers/chatService';

// Các component UI
const MessageBubble = ({ message }: { message: Message }) => (
  <View style={[
    styles.messageContainer,
    message.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer,
    message.isQuickReply && styles.quickReplyContainer
  ]}>
    <View style={[
      styles.messageBubble,
      message.sender === 'user' ? styles.userMessageBubble : styles.botMessageBubble,
      message.isQuickReply && styles.quickReplyBubble
    ]}>
      <Text style={styles.messageText}>{message.text}</Text>
      <Text style={styles.timeText}>{formatTime(message.timestamp)}</Text>
    </View>
  </View>
);

const TypingIndicator = () => (
  <View style={styles.typingContainer}>
    <View style={styles.typingBubble}>
      <View style={styles.typingIndicator}>
        <View style={styles.typingDot} />
        <View style={[styles.typingDot, styles.typingDotMiddle]} />
        <View style={styles.typingDot} />
      </View>
    </View>
  </View>
);

const SuggestionItem = ({ suggestion, onPress }: { suggestion: string; onPress: () => void }) => (
  <TouchableOpacity
    style={styles.suggestionBubble}
    onPress={onPress}
  >
    <Text style={styles.suggestionText}>{suggestion}</Text>
  </TouchableOpacity>
);

const ActionButton = ({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) => (
  <TouchableOpacity 
    style={styles.actionButton} 
    onPress={onPress}
  >
    <FontAwesome name={icon as any} size={18} color="#4A90E2" />
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

export default function ChatboxScreen() {
  // State
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
  const [advancedMode, setAdvancedMode] = useState(false);
  
  // Refs
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  
  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({animated: true});
      }, 100);
    }
  }, [messages]);
  
  // Đảm bảo input luôn giữ focus sau khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 1 && !isTyping) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
  }, [messages, isTyping]);
  
  // Gửi tin nhắn
  const sendMessage = (text = inputText) => {
    if (text.trim() === '') return;
    
    const newUserMessage = createMessage(text.trim(), 'user', text !== inputText);
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsTyping(true);
    setShowSuggestions(false);
    
    // Giả lập bot đang nhập tin nhắn
    setTimeout(() => {
      // Phân tích tin nhắn và trả lời phù hợp
      const botReply = analyzeUserMessage(text);
      
      const newBotMessage = createMessage(botReply, 'bot');
      
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      setIsTyping(false);
      
      // Hiển thị lại các gợi ý sau khi bot trả lời
      setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
      
      // Focus vào input sau khi bot trả lời
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
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
    
    // Focus vào input sau khi xóa lịch sử
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  // Hiển thị thông tin kỹ thuật
  const showTechnicalInfo = (infoType: keyof typeof technicalInfo) => {
    setSelectedInfo(technicalInfo[infoType]);
    setShowInfoModal(true);
  };

  // Chuyển đến các tab khác trong ứng dụng
  const navigateTo = (screen: string) => {
    router.push(`../(tabs)/${screen}`);
  };
  
  // Render từng tin nhắn
  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble message={item} />
  );

  // Xử lý khi nhấn nút gửi
  const handleSend = () => {
    sendMessage();
    
    // Focus vào input sau khi gửi
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inner}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Trợ Lý Ảo</Text>
            <View style={styles.headerRight}>
              <View style={styles.advancedModeContainer}>
                <Text style={styles.advancedModeText}>Chế độ nâng cao</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#4A90E2' }}
                  thumbColor={advancedMode ? '#fff' : '#f4f3f4'}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={setAdvancedMode}
                  value={advancedMode}
                />
              </View>
              <TouchableOpacity onPress={clearChat} style={styles.iconButton}>
                <FontAwesome name="trash" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({animated: true})}
            onLayout={() => flatListRef.current?.scrollToEnd({animated: true})}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="none"
          />
          
          {isTyping && <TypingIndicator />}
          
          {advancedMode && showSuggestions && messages.length > 0 && !isTyping && (
            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.suggestionsContainer}
              keyboardShouldPersistTaps="always"
            >
              {suggestions.map((suggestion: string, index: number) => (
                <SuggestionItem
                  key={index}
                  suggestion={suggestion}
                  onPress={() => sendMessage(suggestion)}
                />
              ))}
            </ScrollView>
          )}
          
          {advancedMode && (
            <View style={styles.actionsContainer}>
              <ActionButton 
                icon="cog" 
                label="Cấu hình" 
                onPress={() => navigateTo('motorConfig')} 
              />
              <ActionButton 
                icon="gears" 
                label="Bộ truyền" 
                onPress={() => navigateTo('gearboxRecommendations')} 
              />
              <ActionButton 
                icon="file-text" 
                label="Báo cáo" 
                onPress={() => navigateTo('reportGenerator')} 
              />
              <ActionButton 
                icon="calculator" 
                label="Công thức" 
                onPress={() => showTechnicalInfo('formula')} 
              />
            </View>
          )}
          
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              placeholder="Nhập tin nhắn..."
              placeholderTextColor="#8a8a8a"
              value={inputText}
              onChangeText={setInputText}
              multiline={false}
              numberOfLines={1}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="send"
              blurOnSubmit={false}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                !inputText.trim() && styles.disabledSendButton
              ]} 
              onPress={handleSend}
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
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  advancedModeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  advancedModeText: {
    color: '#fff',
    fontSize: 13,
    marginRight: 8,
  },
  iconButton: {
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