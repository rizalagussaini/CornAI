import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import ChatBubble from '../../components/ChatBubble';

type ChatMessage = {
  id: string;
  message: string;
  isUser: boolean;
  isOption?: boolean;
  type?: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      message: 'Halo! 🌽 Saya CornAI. Bagaimana saya bisa bantu hari ini? Silakan pilih salah satu opsi berikut:',
      isUser: false,
    },
    { id: '1', message: '📊 Analisis Data Tanaman', isUser: false, isOption: true, type: 'analisis' },
    { id: '2', message: '🤖 Rekomendasi AI', isUser: false, isOption: true, type: 'ai' },
    { id: '3', message: '🌤️ Cek Prakiraan Cuaca', isUser: false, isOption: true, type: 'cuaca' },
  ]);
  const [input, setInput] = useState('');

const handleOption = (type: string, message: string) => {
  const userMsg = { id: Date.now().toString(), message, isUser: true };
  setMessages(prev => [...prev, userMsg]);

  setTimeout(() => {
    const botMsg = {
      id: Date.now().toString(),
      message:
        type === 'analisis'
          ? 'Silakan kirim gambar tanaman Anda 🌿'
          : type === 'ai'
          ? 'Fitur AI akan segera tersedia.'
          : 'Sedang mengambil data cuaca hari ini... 🌤️',
      isUser: false,
    };
    setMessages(prev => [...prev, botMsg]);
  }, 800);
};


  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), message: input, isUser: true },
      {
        id: Date.now().toString(),
        message: '🤖 Terima kasih! Saya sedang memproses informasi tersebut.',
        isUser: false,
      },
    ]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) =>
          item.isOption ? (
            <TouchableOpacity
              onPress={() => handleOption(item.type || '', item.message)}
            >
              <ChatBubble message={item.message} isUser={false} />
            </TouchableOpacity>
          ) : (
            <ChatBubble message={item.message} isUser={item.isUser} />
          )
        }
        contentContainerStyle={styles.chat}
        ListHeaderComponent={
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/cornai-logo.png')}
              style={styles.logo}
            />
          </View>
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Kirim pesan..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>Kirim</Text>
        </TouchableOpacity>
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
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    height: 40,
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
