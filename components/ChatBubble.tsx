import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  onPress?: () => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isUser, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;

  return (
    <View style={[styles.container, isUser ? styles.right : styles.left]}>
      <Wrapper
        style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}
        onPress={onPress}
      >
        <Text style={styles.text}>{message}</Text>
      </Wrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  right: {
    alignSelf: 'flex-end',
  },
  left: {
    alignSelf: 'flex-start',
  },
  bubble: {
    padding: 10,
    borderRadius: 12,
  },
  userBubble: {
    backgroundColor: '#dcf8c6',
  },
  botBubble: {
    backgroundColor: '#f1f0f0',
  },
  text: {
    fontSize: 14,
    color: '#333',
  },
});

export default ChatBubble;
