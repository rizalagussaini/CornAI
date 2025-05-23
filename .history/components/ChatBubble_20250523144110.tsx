import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.rightAlign : styles.leftAlign]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 10,
  },
  rightAlign: {
    alignItems: 'flex-end',
  },
  leftAlign: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: 12,
    padding: 10,
  },
  userBubble: {
    backgroundColor: '#c7d8ff',
  },
  botBubble: {
    backgroundColor: '#f0f0f0',
  },
  userText: {
    color: '#1a237e',
  },
  botText: {
    color: '#333',
  },
  text: {
    fontSize: 14,
  },
});

export default ChatBubble;
