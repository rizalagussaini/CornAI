import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import ChatBubble from '../../components/ChatBubble';

type ChatMessage = {
  id: string;
  message: string;
  isUser: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: 'Halo! 🌽 Saya CornAI. Bagaimana saya bisa bantu hari ini?',
      isUser: false,
    },
    { id: '2', message: '📊 Analisis Data Tanaman', isUser: false },
    { id: '3', message: '🤖 Rekomendasi AI', isUser: false },
    { id: '4', message: '🌤️ Cek Prakiraan Cuaca', isUser: false },
  ]);

  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: input,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // Simulasi balasan CornAI (dummy)
    setTimeout(() => {
      const replyMessage: ChatMessage = {
        id: Date.now().toString(),
        message:
          '🤖 Terima kasih! Saya sedang memproses informasi tersebut. 🔍',
        isUser: false,
      };
      setMessages(prev => [...prev, replyMessage]);
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ChatBubble message={item.message} isUser={item.isUser} />
        )}
        contentContainerStyle={styles.chat}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Ketik pesan..."
        />
        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  chat: {
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 8,
  },
});
