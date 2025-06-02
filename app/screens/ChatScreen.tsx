import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from 'react';
import {
	ActivityIndicator,
	Image,
	KeyboardAvoidingView,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ChatBubble from '../../components/ChatBubble';
import ImageBubble from '../../components/ImageBubble';
import { APIResponse } from '../../types/APIResponses';

type ChatBubbleMessage = {
	id: string;
	type: 'text' | 'image'
	text?: string;
	base64Image?: string;
	role: 'assistant' | 'user';
};

const ChatScreen: React.FC = () => {
	// States and constants
	const [messageList, setMessageList] = useState<ChatBubbleMessage[]>([]);
	const [input, setInput] = useState('');
	const [threadId, setThreadId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	const safeInsets = useSafeAreaInsets();

	// Functions
	useFocusEffect(useCallback(() => {
		const loadCurrentThread = async () => {
			const storageThreadId = await AsyncStorage.getItem("current-thread");
			setThreadId(storageThreadId);
			console.log(`(chat) Current thread: ${storageThreadId}`);
		}
	
		loadCurrentThread();
	}, []));

	useEffect(() => {
		const loadMessageList = async () => {
			const storageMessageList: ChatBubbleMessage[] = JSON.parse(await AsyncStorage.getItem(threadId ?? "null") ?? "[]");
			setMessageList(storageMessageList);
			console.log(`(chat) Loaded ${storageMessageList.length} message(s).`)
		}

		loadMessageList();
	}, [threadId]);
	
	const openImagePicker = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (!permissionResult.granted) {
			alert('Permission to access media library is required!');
			return;
		}

		const pickerResult = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ['images'],
			allowsEditing: true,
			quality: 0.7,
		});

		if (!pickerResult.canceled) {
			setSelectedImage(pickerResult.assets[0].uri);
		}
	};

	const convertImageToBase64 = async (uri: string): Promise<string> => {
		try {
			const base64 = await FileSystem.readAsStringAsync(uri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			const extension = uri.split('.').pop()?.toLowerCase();
			const mimeMap: Record<string, string> = {
				jpg: 'image/jpeg',
				jpeg: 'image/jpeg',
				png: 'image/png',
				webp: 'image/webp',
				gif: 'image/gif',
				bmp: 'image/bmp',
				heic: 'image/heic',
			};

			const mimeType = mimeMap[extension ?? ''] || 'image/*'; // Fallback
			return `data:${mimeType};base64,${base64}`;
		} catch (error) {
			console.error('Error converting image to base64:', error);
			throw error;
		}
	};

	const callAPI = async (message: string = "", imageUrl?: string | null) => {
		if (message === "") return null;
		
		console.log("Sending API request.")
		console.log(`Thread ID: ${threadId}`);
		console.log(`Message: ${message}`);
		
		const chatEndpoint = process.env.EXPO_PUBLIC_AZURE_API_ENDPOINT + "chat";
		const formData = new FormData();
		formData.append("message", message);
		if (imageUrl) {
			formData.append("image", imageUrl);
		}
		if (threadId !== null) {
			formData.append("thread_id", threadId);
		}

		try {
			const response = await fetch(chatEndpoint, {
				method: 'POST',
				headers: {
					'Accept': 'application/json'
				},
				body: formData
			});
			console.log(`Response status: ${response.status}`);
			const json = await response.json();

			const responseInternal = json as APIResponse;
			return responseInternal;
		} catch (error) {
			console.error(`(chat) ${error}`);
			return null;
		}
	}

	const handleSend = async () => {
		if (!input.trim() || loading) return;
		
		setLoading(true);

		const userMessage: ChatBubbleMessage = {
			id: Date.now().toString(),
			type: 'text',
			text: input.trim(),
			role: 'user',
		};
		setInput('');
		setMessageList((prev) => [...prev, userMessage]);
		
		let base64: string | null = null;
		if (selectedImage) {
			base64 = await convertImageToBase64(selectedImage);
			const imageMessage: ChatBubbleMessage = {
				id: Date.now().toString(),
				type: 'image',
				base64Image: base64,
				role: 'user',
			}
			setSelectedImage(null);
			setMessageList((prev) => [...prev, imageMessage]);
		}

		const botResponse = await callAPI(userMessage.text, base64);
		console.log(botResponse);
		if (botResponse !== null && botResponse.response !== undefined && threadId === null) {
			const threadId = botResponse.response.thread_id;
			setThreadId(threadId);
			await AsyncStorage.setItem("current-thread", threadId);
			
			const loadThreadList = async () => {
				let storageThreadsStr = await AsyncStorage.getItem("thread-list");
				if (storageThreadsStr === null) {
					storageThreadsStr = JSON.stringify([]);
					await AsyncStorage.setItem("thread-list", storageThreadsStr);
				}
				
				return JSON.parse(storageThreadsStr);
			};

			const prev = await loadThreadList();
			await AsyncStorage.setItem("thread-list", JSON.stringify([...prev, {
				thread_id: threadId,
				title: (Date.now()).toString(),
			}]))
		}
		const replyText = botResponse?.response?.message;

		const botReply: ChatBubbleMessage = {
			id: (Date.now() + 1).toString(),
			type: 'text',
			text: replyText ?? "Maaf, terjadi kesalahan pada server.",
			role: 'assistant',
		};
		setMessageList((prev) => [...prev, botReply]);
		if (threadId !== null) {
			await AsyncStorage.setItem(threadId, JSON.stringify(messageList));
		}

		setLoading(false);
	};

	// User Interface
	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
		>
			<View style={styles.container}>
				<View style={[styles.header, { marginTop: safeInsets.top }]}>
					<Image
						source={require('../../assets/images/cornai-logo.png')}
						style={styles.logo}
					/>
				</View>

				<ScrollView contentContainerStyle={styles.chatContainer}>
					{messageList.map((msg) => {
						if (msg.type === 'image') {
							return <ImageBubble key={msg.id} base64Image={msg.base64Image} role={msg.role} />;
						} else {
							return <ChatBubble key={msg.id} message={msg.text} role={msg.role} />
						}
					})}
				</ScrollView>
				
				{selectedImage && (
				<View style={styles.imagePreviewContainer}>
					<Image source={{ uri: selectedImage }} style={styles.previewImage} />
					<TouchableOpacity onPress={() => setSelectedImage(null)} style={styles.removeButton}>
						<Text style={styles.removeButtonText}>×</Text>
					</TouchableOpacity>
				</View>
				)}

				<View style={styles.inputBar}>
					<TouchableOpacity onPress={openImagePicker} style={styles.imageButton}>
						<Ionicons name="image" size={20} color="#28a745" />
					</TouchableOpacity>
					<TextInput
						style={styles.input}
						placeholder="Kirim pesan..."
						placeholderTextColor="#999"
						value={input}
						onChangeText={setInput}
					/>
					<TouchableOpacity onPress={handleSend} style={[styles.sendButton, loading && styles.sendButtonDisabled]} disabled={loading}>
						{loading ? (
							<ActivityIndicator size="small" color="white" />
						) : (
							<Ionicons name="send" size={16} color="white" />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderBottomWidth: 1,
		borderColor: '#eee',
	},
	chatContainer: {
		padding: 16
	},
	optionButton: {
		backgroundColor: '#eaeaea',
		padding: 12,
		borderRadius: 12,
		marginVertical: 6,
	},
	optionText: {
		fontSize: 16,
	},
	inputBar: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		borderTopWidth: 1,
		borderColor: '#ddd',
	},
	icon: {
		fontSize: 20,
		marginHorizontal: 4,
	},
	logo: {
		width: 60,
		height: 60,
		borderRadius: 40,
		marginVertical: 10,
		marginHorizontal: 'auto',
		alignSelf: 'center',
		resizeMode: 'contain',
	},
	input: {
		flex: 1,
		paddingHorizontal: 12,
		paddingVertical: 8,
		backgroundColor: '#f1f1f1',
		borderRadius: 20,
		marginHorizontal: 8,
		fontSize: 16,
	},
	sendButton: {
		backgroundColor: '#28a745',
		borderRadius: 25,
		width: 36,
		height: 36,
		alignItems: 'center',
		justifyContent: 'center',
	},
	sendButtonDisabled: {
		backgroundColor: '#4ad36a',
	},
	imageButton: {
		padding: 8,
		justifyContent: 'center',
		alignItems: 'center',
	},
	imageButtonText: {
		fontSize: 20,
	},
	imagePreviewContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 8,
		marginHorizontal: 12,
		backgroundColor: '#f1f1f1',
		borderRadius: 8,
		padding: 6,
	},
	previewImage: {
		width: 50,
		height: 50,
		borderRadius: 6,
	},
	removeButton: {
		marginLeft: 10,
		padding: 4,
		backgroundColor: '#ccc',
		borderRadius: 4,
	},
	removeButtonText: {
		fontSize: 16,
		fontWeight: 'bold',
	},
});

export default ChatScreen;