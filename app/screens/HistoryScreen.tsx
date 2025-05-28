import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { RootDrawerParamList } from './AppNavigator'; // path sesuai

type HistoryScreenRouteProp = RouteProp<RootDrawerParamList, 'History'>;

type Props = {
  route: HistoryScreenRouteProp;
  navigation: any;
};

export default function HistoryScreen({ route, navigation }: Props) {
  const { threads } = route.params || { threads: [] };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Riwayat Chat</Text>
      <FlatList
        data={threads}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              // Navigasi kembali ke chat dengan thread yang dipilih
              navigation.navigate('Chat', { threadId: item.id });
            }}
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text numberOfLines={1} style={styles.itemLastMessage}>
              {item.messages[item.messages.length - 1]?.message || ''}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text>Tidak ada riwayat chat.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  item: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  itemTitle: { fontSize: 18, fontWeight: '600' },
  itemLastMessage: { fontSize: 14, color: '#666', marginTop: 5 },
});
