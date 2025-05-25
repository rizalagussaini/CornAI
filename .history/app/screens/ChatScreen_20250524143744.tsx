import { Audio } from 'expo-av'; // untuk fitur rekam audio
import React, { useState, useRef } from 'react';
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

// Komponen utama ChatScreen
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
      isOption: true, // pesan ini bisa diklik sebagai opsi
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

  // untuk tahu kapan bot sedang "mengetik" / loading
  const [isBotTyping, setIsBotTyping] = useState(false);

  // State untuk menyimpan input teks dari user
  const [input, setInput] = useState('');

  // State untuk menyimpan objek rekaman audio (null jika tidak ada)
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // State untuk status apakah sedang merekam audio atau tidak
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef<FlatList>(null);


  // Fungsi saat user memilih salah satu opsi (analisis, ai, cuaca)
  const handleOption = (type: string, message: string) => {
    // Tambahkan pesan dari user ke daftar pesan
    const userMsg = { id: Date.now().toString(), message, isUser: true };
    // Setelah 800ms, tambahkan balasan dari bot sesuai tipe opsi
    setMessages(prev => [...prev, userMsg]);
    // Set bot sedang mengetik
    setIsBotTyping(true);

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
      // Sembunyikan loading indikator setelah balasan muncul
      setIsBotTyping(false);
    }, 800);
  };

  // Fungsi untuk mengirim pesan teks yang diketik user
  const sendMessage = () => {
    // Jika input kosong (atau hanya spasi), jangan lakukan apa-apa
    if (!input.trim()) return;
    // Tambahkan pesan user dan balasan bot ke daftar pesan
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), message: input, isUser: true },
    ]);

    // Set bot sedang mengetik (loading)
    setIsBotTyping(true);

    // Kosongkan input setelah mengirim
    setInput('');

    // Simulasikan delay balasan bot
    // Simulasikan delay balasan bot (1.5 detik)
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          message: '🤖 Terima kasih! Saya sedang memproses informasi tersebut.',
          isUser: false,
        },
      ]);
      // Sembunyikan loading indikator setelah balasan muncul
      setIsBotTyping(false);
    }, 1500);
    
  };

  // Fungsi untuk memilih gambar dari galeri dan mengirim ke chat
  const handleImageUpload = async () => {
    // Buka galeri dan pilih gambar dengan kualitas 0.7 (70%)
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    // Jika user tidak batal dan memilih gambar
    if (!result.canceled && result.assets.length > 0) {
      const selectedImage = result.assets[0].uri;

      // Tambahkan gambar user dan pesan bot balasan ke daftar pesan
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

  // Fungsi untuk mulai rekaman suara
  const startRecording = async () => {
    try {
      // Minta izin akses mikrofon
      await Audio.requestPermissionsAsync();

      // Set mode audio supaya bisa rekam di iOS
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Mulai rekaman dengan kualitas tinggi
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      // Simpan objek rekaman dan set status rekam true
      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  // Ambil URI file audio yang direkam
  const stopRecording = async () => {
    if (!recording) return;
    setIsRecording(false); 
    await recording.stopAndUnloadAsync(); // Hapus objek rekaman dari state
    const uri = recording.getURI(); // Ambil URI file audio yang direkam
    setRecording(null);

    // Jika ada file rekaman
    if (uri) {
      // Tambahkan pesan suara ke chat dan balasan bot (simulasi)
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

  // Fungsi untuk render loading indikator saat bot mengetik
  const renderLoading = () => {
    if (!isBotTyping) return null; // Kalau bot tidak mengetik, tidak tampilkan apa-apa

    return (
      <View style={[styles.chatBubbleContainer, styles.botAlign]}>
        <Text style={styles.loadingText}>🤖 Sedang mengetik...</Text>
      </View>
    );
  };


  // Bagian tampilan utama (UI)
  return (
    // KeyboardAvoidingView supaya keyboard tidak menutupi input di iOS
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.chat, { paddingBottom: 70 }]}
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
        
        ListHeaderComponent={
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/cornai-logo.png')}
              style={styles.logo}
            />
          </View>
        }
      />

      {renderLoading()}

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

// Style untuk tampilan
const styles = StyleSheet.create({
  container: {
    flex: 1, // memanfaatkan seluruh layar
    backgroundColor: '#fff', // background putih
  },
  chat: {
    padding: 10, // jarak dalam chat list
    paddingBottom: 100, // beri padding bawah untuk space floating bar
  },
  header: {
    alignItems: 'center', // rata tengah
    marginBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40, // bentuk lingkaran
    marginBottom: 10,
  },
  inputContainer: {
    position: 'absolute',   // posisi absolut supaya floating
    bottom: 0,              // pas di bawah layar
    left: 0,
    right: 0,
    flexDirection: 'row', // komponen input berjajar secara horizontal
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    alignItems: 'center', // rata tengah vertikal
  },
  input: {
    flex: 1, // input mengambil ruang sebanyak mungkin
    backgroundColor: '#f1f1f1', 
    paddingHorizontal: 15,
    borderRadius: 20, // sudut membulat
    marginRight: 10,
    height: 40,
  },
  sendButton: {
    backgroundColor: '#4CAF50', // hijau
    color: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  chatBubbleContainer: {
    marginVertical: 4,
    maxWidth: '80%', // maksimal lebar balon chat
  },
  userAlign: {
    alignSelf: 'flex-end', // pesan user rata kanan
  },
  botAlign: {
    alignSelf: 'flex-start', // pesan bot rata kiri
  },
  loadingText: {
  fontStyle: 'italic',
  color: '#666',
  marginVertical: 4,
},
});
