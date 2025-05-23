import React, { useState } from 'react';
import { View, StyleSheet, TextInput, FlatList, KeyboardAvoidingView, Platform, Button } from 'react-native';
import ChatBubble from 'components/ChatBubble.tsx';

type ChatMessage = {
  id: string;
  message: string;
  isUser: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', message: 'Hai CornAI, saya menemukan beberapa serangga di tanaman jagung saya. Bisa bantu saya identifikasi?', isUser: true },
    { id: '2', message: 'Tentu, silakan kirimkan foto serangga yang Anda temukan, saya akan membantu mengidentifikasinya.', isUser: false },
  ]);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      message: input,
      isUser: true,
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ChatBubble message={item.message} isUser={item.isUser} />}
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
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
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

