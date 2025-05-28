//npx react-native start
//npx expo start 
import { Audio } from 'expo-av'; // untuk fitur rekam audio
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useRef, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Pastikan sudah menginstal react-native-vector-icons
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { ParamListBase } from '@react-navigation/native';
import { RootDrawerParamList } from './AppNavigator'; // sesuaikan path
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ChatBubble from '../../components/ChatBubble';

type ChatMessage = {
  id: string;
  message?: string;
  image?: string;
  isUser: boolean;
  isOption?: boolean;
  type?: string;
};

type ChatThread = {
  id: string;
  title: string;
  messages: ChatMessage[];
};

type ChatScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Chat'>;

type Props = {
  navigation: ChatScreenNavigationProp;
};

// Komponen utama ChatScreen
export default function ChatScreen({ navigation }: Props) {
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'thread-1',
      title: 'Chat Baru',
      messages: [
        {
          id: 'msg-0',
          message: 'Halo! 🌽 Saya CornAI. Mulai chat baru.',
          isUser: false,
        },
      ],
    },
  ]);
  // Thread aktif yang sedang dibuka
  //const [activeThreadId, setActiveThreadId] = useState(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  //const [messages, setMessages] = useState<ChatMessage[]>([
  //const activeThread = threads.find(t => t.id === activeThreadId);

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
  // State untuk menyimpan input teks dari user
  const [input, setInput] = useState('');
  // untuk tahu kapan bot sedang "mengetik" / loading
  const [isBotTyping, setIsBotTyping] = useState(false);
  // State untuk menyimpan objek rekaman audio (null jika tidak ada)
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  // State untuk status apakah sedang merekam audio atau tidak
  const [isRecording, setIsRecording] = useState(false);

  const flatListRef = useRef<FlatList>(null); // buat ref FlatList

  const [threadId, setThreadId] = useState<string | null>(null); //chatAsync

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
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput(''); // kosongkan input dulu
    setIsBotTyping(true);

    // Jika belum ada thread ID (pertama kali user kirim pesan)
    if (!activeThreadId) {
      const newThreadId = 'thread-' + Date.now();
      setActiveThreadId(newThreadId);
      setThreads(prev => [
        ...prev,
        {
          id: newThreadId,
          title: 'Percakapan Baru',
          messages: [
            { id: Date.now().toString(), message: userMessage, isUser: true },
          ],
        },
      ]);
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), message: userMessage, isUser: true },
      ]);
      return;
    }

    // Tambahkan pesan user ke thread aktif
    setThreads(prev =>
      prev.map(thread => {
        if (thread.id === activeThreadId) {
          return {
            ...thread,
            messages: [
              ...thread.messages,
              { id: Date.now().toString(), message: userMessage, isUser: true },
            ],
          };
        }
        return thread;
      })
    );

    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), message: userMessage, isUser: true },
    ]);

    try {
      console.log("test")
      const response = await fetch('https://corn-ai.azurewebsites.net/api/chat', {
        //mode: 'no-cors',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thread_id: activeThreadId, message: userMessage }),
      });
      console.log("Mengirim ke server:", activeThreadId, userMessage);

      const json = await response.json();
      const botReply = json?.response?.message ?? 'Bot tidak membalas.';

      // Update threadId dari response jika diperlukan
      if (json.response.thread_id && json.response.thread_id !== activeThreadId) {
        // Opsional: update activeThreadId & threads jika server kirim ID baru
      }

      // Tambahkan balasan bot ke thread aktif
      setThreads(prev =>
        prev.map(thread => {
          if (thread.id === activeThreadId) {
            return {
              ...thread,
              messages: [
                ...thread.messages,
                { id: Date.now().toString(), message: json.response.message, isUser: false },
              ],
            };
          }
          return thread;
        })
      );
    } catch (error) {
      // Tambahkan pesan error ke thread aktif
      setThreads(prev =>
        prev.map(thread => {
          if (thread.id === activeThreadId) {
            return {
              ...thread,
              messages: [
                ...thread.messages,
                { id: Date.now().toString(), message: 'Maaf, terjadi kesalahan saat menghubungi server.', isUser: false },
              ],
            };
          }
          return thread;
        })
      );
    } finally {
      setIsBotTyping(false);
    }
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
  const activeThread = threads.find(t => t.id === activeThreadId);

  useEffect(() => {
  // Update messages hanya jika activeThreadId sudah ada dan thread ditemukan
    if (activeThreadId && activeThread) {
      setMessages(activeThread.messages);
    }
    if (flatListRef.current) {
    flatListRef.current.scrollToEnd({ animated: true });
    }
    // Kalau activeThreadId null, biarkan messages tetap di default awal
  }, [activeThreadId, activeThread]);


  // Bagian tampilan utama (UI)
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header dengan tombol menu dan logo */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ padding: 10 }}>
          <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>

        <Image
          source={require('../../assets/images/cornai-logo.png')}
          style={styles.logo}
        />
      </View>

      {/* FlatList untuk chat */}
      <FlatList
        ref={flatListRef}
        data={activeThreadId && activeThread ? activeThread.messages : messages}
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
      />

      {renderLoading()}

      {/* Input dan tombol kirim */}
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
    width: 70,
    height: 70,
    borderRadius: 40, // bentuk lingkaran
    marginBottom: 10,
    position: 'absolute',
    alignSelf: 'center',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    resizeMode: 'contain',
  },
  inputContainer: {
    position: 'absolute',   // posisi absolut supaya floating
    bottom: 0,              // pas di bawah layar
    left: 0,
    right: 0,
    height: 60, // contoh tinggi tetap
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
  // Tambahkan style ini:
  headerContainer: {
    flexDirection: 'row',       // supaya isi header berjajar horizontal
    alignItems: 'center',       // supaya vertikal rata tengah
    paddingHorizontal: 16,      // jarak kiri kanan
    paddingVertical: 12,        // jarak atas bawah
    backgroundColor: '#f5f5f5', // opsional, bisa diganti warna lain
    borderBottomWidth: 1,       // garis bawah header
    borderBottomColor: '#ddd',
    position: 'relative',  // warna garis bawah
  },
});
