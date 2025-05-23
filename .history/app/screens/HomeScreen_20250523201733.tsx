import React from 'react';
import {
  View,
  Text,
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
