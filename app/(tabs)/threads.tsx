import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
	FlatList,
	SafeAreaView,
	StyleSheet,
	Text,
	TouchableOpacity
} from 'react-native';

type Thread = {
	thread_id: string;
	title: string;
};

type ThreadMessage = {
	id: string;
	role: string;
	content: MessageContent[];
};

type MessageContent = {
	type: string;
	text?: string;
	image_url?: {
		url: string;
	}
}

const ThreadListScreen: React.FC = () => {
	const [threads, setThreads] = useState<Thread[]>([]);
	const [currentThread, setCurrentThread] = useState<string | null>(null);
	const router = useRouter();

	useFocusEffect(
		useCallback(() => {
			const loadThreads = async () => {
				let storageThreadsStr = await AsyncStorage.getItem("thread-list");
				if (storageThreadsStr === null) {
					storageThreadsStr = JSON.stringify([]);
					await AsyncStorage.setItem("thread-list", storageThreadsStr);
				}
				
				const storageThreads: Thread[] = JSON.parse(storageThreadsStr);
				console.log(`(threads) Found ${storageThreads.length} thread ids in storage.`);
				setThreads(storageThreads);
			};
			const loadCurrentThread = async () => {
				const threadId = await AsyncStorage.getItem("current-thread");
				setCurrentThread(threadId);
				console.log(`(threads) Current thread: ${threadId}`)
			};
		
			loadThreads();
			loadCurrentThread();
		}, [])
	);

	const callChatHistoryAPI = async (threadId: string) => {
		console.log("(threads) Sending API request.")
		console.log(`(threads) Thread ID: ${threadId}`);
		
		try {
			const chatEndpoint = `${process.env.EXPO_PUBLIC_AZURE_API_ENDPOINT}chat/history?thread=${threadId}`;
			const response = await fetch(chatEndpoint, {
				method: 'GET',
				headers: {
					'Accept': 'application/json'
				}
			});
			console.log(`Response status: ${response.status}`);
			const json = await response.json();
			const result: ThreadMessage[] = json.response;
			console.log(result);
			return result;
		} catch (error) {
			console.error(`(threads) ${error}`);
			return null;
		}
	};

	const handleSelectThread = async (threadId: string) => {
		try {
			await AsyncStorage.setItem("current-thread", threadId);
			
			const threadHistory = await callChatHistoryAPI(threadId);
			let threadHistoryInternal: object[] = [];
			if (threadHistory !== null) {
				threadHistory.forEach(tm => {
					let textContent = "";
					tm.content.forEach(mc => {
						if (mc.type === "text") {
							textContent += mc.text;
						}
					});
					if (textContent.length > 0) {
						threadHistoryInternal.push({
							id: tm.id,
							text: textContent,
							role: tm.role
						})
					}
				});
	
				await AsyncStorage.setItem(threadId, JSON.stringify(threadHistoryInternal));
				console.log(`(threads) Retrieved ${threadHistoryInternal.length} message(s) from the server.`)
			} else {
				console.warn(`(threads) Failed to fetch conversation history on thread ${threadId}. Falling back to local storage.`);
			}
		} catch (error) {
			console.error(`(threads) ${error}`);
		} finally {
			router.back();
		}
	};
	const handleNewThread = async () => {
		await AsyncStorage.removeItem("current-thread");
		router.back();
	};

	return (
		<SafeAreaView style={styles.container}>
			<FlatList
				data={threads}
				keyExtractor={(item) => item.thread_id}
				contentContainerStyle={styles.listContent}
				renderItem={({ item }) => (
					<TouchableOpacity onPress={() => handleSelectThread(item.thread_id)} style={styles.threadItem}>
						<Text style={[styles.threadTitle, (item.thread_id === currentThread) && styles.currentThreadItem]} numberOfLines={1}>{item.title}</Text>
						<Text style={[styles.threadId, (item.thread_id === currentThread) && styles.currentThreadItem]}>{item.thread_id}</Text>
					</TouchableOpacity>
				)}
			/>
			<TouchableOpacity onPress={() => handleNewThread()} style={styles.threadItem}>
				<Text style={styles.threadTitle}>Buat percakapan baru...</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
	listContent: {
		paddingVertical: 8,
		alignItems: 'stretch',
	},
	threadItem: {
		padding: 16,
		borderBottomColor: '#ccc',
		borderBottomWidth: 1,
	},
	currentThreadItem: {
		color: '#28a745',
	},
	threadTitle: {
		fontWeight: 'bold',
		fontSize: 16,
		color: '#666',
	},
	threadId: {
		fontSize: 14,
		color: '#666',
	},
});

export default ThreadListScreen;