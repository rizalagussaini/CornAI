import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.right : styles.left]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  right: {
    alignItems: 'flex-end',
  },
  left: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#c7d8ff',
  },
  botBubble: {
    backgroundColor: '#f1f1f1',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});

export default ChatBubble;
