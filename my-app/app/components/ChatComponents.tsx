import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Message, formatTime } from '../helpers/chatService';

// Component hiển thị tin nhắn
export const MessageBubble = ({ message }: { message: Message }) => {
  return (
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
};

// Component hiển thị gợi ý chỉ báo bot đang nhập
export const TypingIndicator = () => {
  return (
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
};

// Component hiển thị gợi ý câu hỏi
export const SuggestionItem = ({ 
  suggestion, 
  onPress 
}: { 
  suggestion: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      style={styles.suggestionBubble}
      onPress={onPress}
    >
      <Text style={styles.suggestionText}>{suggestion}</Text>
    </TouchableOpacity>
  );
};

// Component hiển thị nút hành động
export const ActionButton = ({
  icon,
  label,
  onPress
}: {
  icon: string;
  label: string;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity 
      style={styles.actionButton} 
      onPress={onPress}
    >
      <FontAwesome name={icon as any} size={18} color="#4A90E2" />
      <Text style={styles.actionText}>{label}</Text>
    </TouchableOpacity>
  );
};

// Component header của chat
export const ChatHeader = ({
  title,
  onBack,
  onAction,
  actionIcon
}: {
  title: string;
  onBack: () => void;
  onAction?: () => void;
  actionIcon?: string;
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBack}
      >
        <FontAwesome name="arrow-left" size={20} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {onAction && actionIcon ? (
        <TouchableOpacity 
          style={styles.headerActionButton} 
          onPress={onAction}
        >
          <FontAwesome name={actionIcon as any} size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  // Styles for message containers
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
  
  // Styles for message bubbles
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
  
  // Styles for typing indicator
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
  
  // Styles for suggestion items
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
  
  // Styles for action buttons
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  
  // Styles for header
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
  spacer: {
    width: 36,
  },
});