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
  Alert,
  ActivityIndicator,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { StatusBar } from 'expo-status-bar';
import { router } from 'expo-router';
import { OpenAI } from 'openai';

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

// API Key constants
const OPENAI_API_KEY_STORAGE = 'openai_api_key';

// Initialize OpenAI client with empty API key first
// We'll set the API key dynamically later when needed
const openai = new OpenAI({
  apiKey: '',
  dangerouslyAllowBrowser: true
});

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
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState('');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [useAI, setUseAI] = useState(true); // State to toggle between AI and rule-based responses
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [apiKeyStatus, setApiKeyStatus] = useState<'unknown' | 'valid' | 'invalid' | 'checking'>('unknown');
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Refs
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  
  // Load API key on startup
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        // Workaround: Simulate loading API key from storage
        // In actual implementation, use AsyncStorage or SecureStore
        setTimeout(() => {
          setApiKey('');
          openai.apiKey = ''; // Set the API key dynamically
          setApiKeyStatus('unknown');
          setIsInitializing(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading API key:', error);
        setIsInitializing(false);
      }
    };
    
    loadApiKey();
  }, []);
  
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
  
  // Save API key
  const saveApiKey = async (key: string) => {
    try {
      setApiKeyStatus('checking');
      
      // Validate API key by making a small test request
      const testOpenAI = new OpenAI({
        apiKey: key,
        dangerouslyAllowBrowser: true
      });
      
      try {
        await testOpenAI.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "user", content: "Hello" }
          ],
          max_tokens: 5
        });
        
        // If no error, key is valid
        // In actual implementation, use AsyncStorage.setItem(OPENAI_API_KEY_STORAGE, key);
        setApiKey(key);
        openai.apiKey = key; // Update the global OpenAI instance
        setApiKeyStatus('valid');
        setShowApiKeyModal(false);
        Alert.alert("Thành công", "API key đã được lưu thành công!");
      } catch (error) {
        console.error('API key validation error:', error);
        setApiKeyStatus('invalid');
        Alert.alert("Lỗi", "API key không hợp lệ hoặc đã hết hạn.");
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      setApiKeyStatus('invalid');
      Alert.alert("Lỗi", "Không thể lưu API key.");
    }
  };
  
  // Gửi tin nhắn
  const sendMessage = async (text = inputText) => {
    if (text.trim() === '') return;
    
    const newUserMessage = createMessage(text.trim(), 'user', text !== inputText);
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInputText('');
    setIsTyping(true);
    setShowSuggestions(false);
    
    try {
      let botReply: string;
      
      if (useAI && advancedMode) {
        // Check if API key is available
        if (!apiKey) {
          throw new Error("API key is not set");
        }
        
        // API key should be already set in the OpenAI instance
        
        // Call OpenAI API in advanced mode
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini", // or "gpt-4o-mini" if available
          messages: [
            {
              role: "system" as const,
              content: `Bạn là trợ lý ảo chuyên về kỹ thuật hộp giảm tốc và bộ truyền động cơ khí. 
              Bạn có kiến thức chuyên sâu về:
              - Các loại hộp giảm tốc (1 cấp, 2 cấp, đa cấp)
              - Tính toán tỉ số truyền, hiệu suất, mô-men
              - Vật liệu chế tạo bánh răng và các chi tiết máy
              - Tính toán độ bền cho các chi tiết
              - Tiêu chuẩn kỹ thuật ngành cơ khí Việt Nam và quốc tế
              - Thiết kế và lựa chọn động cơ cho hệ thống truyền động
              
              Hãy trả lời ngắn gọn nhưng đầy đủ về mặt kỹ thuật. Sử dụng các công thức và giá trị thực tế. 
              Nếu cần thông số cụ thể mà người dùng không cung cấp, hãy hỏi thêm.`
            },
            // Include previous context (last 10 messages for better context)
            ...messages.slice(-10).map(msg => ({
              role: (msg.sender === 'user' ? "user" : "assistant") as 'user' | 'assistant',
              content: msg.text
            })),
            { role: "user" as const, content: text }
          ],
          temperature: 0.3, // Lower temperature for more precise, technical responses
          max_tokens: 800,
        });

        botReply = response.choices[0].message.content || 
          "Xin lỗi, tôi không thể xử lý yêu cầu này. Vui lòng thử lại.";
      } else {
        // Use the original rule-based response in basic mode
        botReply = analyzeUserMessage(text);
        
        // Add a small delay to simulate processing time
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      const newBotMessage = createMessage(botReply, 'bot');
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      
    } catch (error) {
      console.error("Error processing message:", error);
      
      // If error is due to missing API key, prompt to set it
      if ((error as Error).message.includes("API key")) {
        setShowApiKeyModal(true);
      }
      
      // Fallback to original keyword-based response if AI fails
      const botReply = analyzeUserMessage(text);
      const newBotMessage = createMessage(botReply, 'bot');
      setMessages(prevMessages => [...prevMessages, newBotMessage]);
      
      if (useAI && advancedMode) {
        if (!apiKey) {
          // Notify user of missing API key
          Alert.alert(
            "API Key chưa được thiết lập",
            "Bạn cần thiết lập OpenAI API Key để sử dụng tính năng AI.",
            [
              { text: "Để sau", style: "cancel" },
              { 
                text: "Thiết lập ngay", 
                onPress: () => setShowApiKeyModal(true)
              }
            ]
          );
        } else {
          // Notify user of API error
          Alert.alert(
            "Lỗi kết nối",
            "Không thể kết nối với trợ lý AI. Đã chuyển sang chế độ phản hồi cơ bản.",
            [{ text: "OK" }]
          );
        }
      }
    } finally {
      setIsTyping(false);
      
      // Hiển thị lại các gợi ý sau khi bot trả lời
      setTimeout(() => {
        setShowSuggestions(true);
      }, 500);
      
      // Focus vào input sau khi bot trả lời
      setTimeout(() => {
        inputRef.current?.focus();
      }, 200);
    }
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
  
  // Toggle AI mode
  const toggleAIMode = () => {
    if (!advancedMode && !useAI) {
      // If trying to turn off AI in basic mode, don't allow
      return;
    }
    
    if (!useAI && advancedMode && !apiKey) {
      // If trying to turn on AI but no API key set
      setShowApiKeyModal(true);
      return;
    }
    
    setUseAI(!useAI);
  };
  
  // Handle advanced mode toggle
  const toggleAdvancedMode = (value: boolean) => {
    setAdvancedMode(value);
    // Ensure AI is enabled when advanced mode is enabled
    if (value) {
      setUseAI(true);
      
      // If we don't have an API key, show the modal
      if (!apiKey) {
        setTimeout(() => {
          setShowApiKeyModal(true);
        }, 300);
      }
    }
  };
  
  // Open API key settings
  const openApiKeySettings = () => {
    setTempApiKey(apiKey);
    setShowApiKeyModal(true);
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
  
  // Show loading indicator while initializing
  if (isInitializing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Đang khởi tạo trợ lý ảo...</Text>
      </SafeAreaView>
    );
  }

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
                  onValueChange={toggleAdvancedMode}
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
              <ActionButton 
                icon={useAI ? "magic" : "book"} 
                label={useAI ? "AI" : "Cơ bản"} 
                onPress={toggleAIMode} 
              />
              <ActionButton 
                icon="key" 
                label="API Key" 
                onPress={openApiKeySettings} 
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
              multiline={true}
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
          
          {/* Modal API Key Settings */}
          <Modal
            visible={showApiKeyModal}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setShowApiKeyModal(false)}
          >
            <TouchableWithoutFeedback onPress={() => setShowApiKeyModal(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                      <Text style={styles.modalTitle}>Thiết lập OpenAI API Key</Text>
                      <TouchableOpacity onPress={() => setShowApiKeyModal(false)}>
                        <FontAwesome name="times" size={20} color="#fff" />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.modalBody}>
                      <Text style={styles.modalText}>
                        Nhập OpenAI API Key của bạn để kích hoạt tính năng trí tuệ nhân tạo. 
                        API Key sẽ được lưu trên thiết bị của bạn.
                      </Text>
                      <Text style={[styles.modalText, styles.apiKeyInstructions]}>
                        Bạn có thể tạo OpenAI API Key tại: https://platform.openai.com/api-keys
                      </Text>
                      <TextInput
                        style={styles.apiKeyInput}
                        placeholder="sk-..."
                        placeholderTextColor="#8a8a8a"
                        value={tempApiKey}
                        onChangeText={setTempApiKey}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      {apiKeyStatus === 'checking' && (
                        <View style={styles.apiKeyStatusContainer}>
                          <ActivityIndicator size="small" color="#4A90E2" />
                          <Text style={styles.apiKeyStatusText}>Đang kiểm tra...</Text>
                        </View>
                      )}
                      {apiKeyStatus === 'invalid' && (
                        <View style={styles.apiKeyStatusContainer}>
                          <FontAwesome name="times-circle" size={16} color="#FF5252" />
                          <Text style={[styles.apiKeyStatusText, styles.invalidApiKey]}>
                            API Key không hợp lệ
                          </Text>
                        </View>
                      )}
                      <TouchableOpacity 
                        style={[
                          styles.apiKeySaveButton,
                          (!tempApiKey || apiKeyStatus === 'checking') && styles.disabledButton
                        ]}
                        onPress={() => saveApiKey(tempApiKey)}
                        disabled={!tempApiKey || apiKeyStatus === 'checking'}
                      >
                        <Text style={styles.apiKeySaveButtonText}>Lưu API Key</Text>
                      </TouchableOpacity>
                      {apiKey && (
                        <TouchableOpacity 
                          style={styles.apiKeyClearButton}
                          onPress={() => {
                            Alert.alert(
                              "Xác nhận xóa",
                              "Bạn có chắc chắn muốn xóa API Key?",
                              [
                                { text: "Hủy", style: "cancel" },
                                { 
                                  text: "Xóa", 
                                  style: "destructive",
                                  onPress: async () => {
                                    // In actual implementation, use AsyncStorage.removeItem(OPENAI_API_KEY_STORAGE);
                                    setApiKey('');
                                    openai.apiKey = ''; // Clear the API key from OpenAI instance
                                    setTempApiKey('');
                                    setApiKeyStatus('unknown');
                                    setShowApiKeyModal(false);
                                  }
                                }
                              ]
                            );
                          }}
                        >
                          <Text style={styles.apiKeyClearButtonText}>Xóa API Key</Text>
                        </TouchableOpacity>
                      )}
                    </View>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: '#001627',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
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
    marginBottom: 16,
  },
  apiKeyInstructions: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 20,
  },
  apiKeyInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    marginBottom: 16,
  },
  apiKeyStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  apiKeyStatusText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
  },
  invalidApiKey: {
    color: '#FF5252',
  },
  apiKeySaveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  apiKeySaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  apiKeyClearButton: {
    backgroundColor: 'rgba(255, 82, 82, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 82, 82, 0.4)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  apiKeyClearButtonText: {
    color: '#FF5252',
    fontSize: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
});