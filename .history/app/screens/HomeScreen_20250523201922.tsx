import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';

const options = [
  { label: '📊 Analisis Data Tanaman' },
  { label: '🤖 Dapatkan Rekomendasi Berbasis AI' },
  { label: '🌤️ Cek Prakiraan Cuaca' },
  { label: '📚 Jelajahi Wawasan Pertanian' },
  { label: '🧑‍🌾 Tanya Saran Ahli' },
  { label: '♻️ Pelajari Praktik Berkelanjutan' },
];

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

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/images/cornai-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.message}>
          Halo! 🌽 Saya CornAI. Bagaimana saya bisa mendukung perjalanan pertanian berkelanjutan Anda hari ini? Silakan pilih salah satu opsi berikut:
        </Text>
        {options.map((option, index) => (
          <TouchableOpacity key={index} style={styles.button}>
            <Text style={styles.buttonText}>{option.label}</Text>
          </TouchableOpacity>
        ))}

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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 60,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#e0f2f1',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    width: '100%',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#00695c',
  },
});
