import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
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

type ChatMessage = {
	id: string;
	text: string;
	sender: 'bot' | 'user';
};

type APIResponse = {
	status: number;
	description: string;
	response: APIChatResponse | null;
};

type APIChatResponse = {
	thread_id: string;
	message: string;
};

const ChatScreen: React.FC = () => {
	// States and constants
	const [messageList, setMessageList] = useState<ChatMessage[]>([
		{
			id: '1',
			text: 'Halo! 🌽 Saya CornAI. Bagaimana saya bisa bantu hari ini?',
			sender: 'bot',
		},
	]);
	const [input, setInput] = useState('');
	const [threadId, setThreadId] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	const safeInsets = useSafeAreaInsets();

	// Functions
	const callAPI = async (message: string) => {
		console.log("Sending API request.")
		console.log(`Thread ID: ${threadId}`);
		console.log(`Message: ${message}`);
		
		const chatEndpoint = process.env.EXPO_PUBLIC_AZURE_API_ENDPOINT + "chat";
		const formData = new FormData();
		formData.append("message", message);
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
			const json = await response.json();

			const responseInternal = json as APIResponse;
			return responseInternal;
		} catch (error) {
			console.error(error);
			return null;
		}
	}

	const handleSend = async () => {
		if (!input.trim() || loading) return;

		const userMessage: ChatMessage = {
			id: Date.now().toString(),
			text: input.trim(),
			sender: 'user',
		};
		
		setInput('');
		setMessageList((prev) => [...prev, userMessage]);
		setLoading(true);

		const botResponse = await callAPI(userMessage.text);
		console.log(botResponse);
		if (botResponse !== null && botResponse.response !== null) {
			setThreadId(botResponse.response.thread_id);
		}
		const replyText = botResponse?.response?.message;

		const botReply: ChatMessage = {
			id: (Date.now() + 1).toString(),
			text: replyText ?? "Maaf, terjadi kesalahan pada server.",
			sender: 'bot',
		};
		setMessageList((prev) => [...prev, botReply]);
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
					{messageList.map((msg) => (
						<ChatBubble key={msg.id} message={msg.text} sender={msg.sender} />
					))}
				</ScrollView>

				<View style={styles.inputBar}>
					<Text style={styles.icon}>📷</Text>
					<Text style={styles.icon}>🎤</Text>
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
	}
});

export default ChatScreen;