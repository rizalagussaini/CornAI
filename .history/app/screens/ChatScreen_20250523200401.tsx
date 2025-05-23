import { Audio } from 'expo-av';
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
import * as ImagePicker from 'expo-image-picker';

type ChatMessage = {
  id: string;
  message?: string;
  image?: string;
  isUser: boolean;
  isOption?: boolean;
  type?: string;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '0',
      message:
        'Halo! 🌽 Saya CornAI. Bagaimana saya bisa bantu hari ini? Silakan pilih salah satu opsi berikut:',
      isUser: false,
    },
    {
      id: '1',
      message: '📊 Analisis Data Tanaman',
      isUser: false,
      isOption: true,
      type: 'analisis',
    },
    {
      id: '2',
      message: '🤖 Rekomendasi AI',
      isUser: false,
      isOption: true,
      type: 'ai',
    },
    {
      id: '3',
      message: '🌤️ Cek Prakiraan Cuaca',
      isUser: false,
      isOption: true,
      type: 'cuaca',
    },
  ]);

  const [input, setInput] = useState('');
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);

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

  const handleImageUpload = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;

      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), image: selectedImage, isUser: true },
        {
          id: Date.now().toString(),
          message: '📷 Gambar berhasil diterima, sedang dianalisis...',
          isUser: false,
        },
      ]);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    setRecording(null);

    if (uri) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), message: '[Pesan Suara]', isUser: true },
        {
          id: Date.now().toString(),
          message: '🎧 Saya menerima pesan suara Anda! (simulasi)',
          isUser: false,
        },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.chat, { paddingBottom: 100 }]}
        renderItem={({ item }) =>
          item.image ? (
            <View style={[styles.chatBubbleContainer, item.isUser ? styles.userAlign : styles.botAlign]}>
              <Image
                source={{ uri: item.image }}
                style={{ width: 180, height: 180, borderRadius: 8 }}
                
              />
            </View>
          ) : item.isOption ? (
            <TouchableOpacity onPress={() => handleOption(item.type || '', item.message || '')}>
              <ChatBubble message={item.message || ''} isUser={false} />
            </TouchableOpacity>
          ) : (
            <ChatBubble message={item.message || ''} isUser={item.isUser} />
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
        <TouchableOpacity onPress={handleImageUpload} style={{ marginRight: 8 }}>
          <Text style={{ fontSize: 18 }}>📷</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={isRecording ? stopRecording : startRecording} style={{ marginRight: 8 }}>
          <Text style={{ fontSize: 18 }}>{isRecording ? '⏹️' : '🎤'}</Text>
        </TouchableOpacity>

        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Kirim pesan..."
        />

        <TouchableOpacity onPress={sendMessage}>
          <Text style={styles.sendButton}>➕</Text>
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
  chatBubbleContainer: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  userAlign: {
    alignSelf: 'flex-end',
  },
  botAlign: {
    alignSelf: 'flex-start',
  },
});
