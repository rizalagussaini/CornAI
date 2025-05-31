import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChatBubbleProps {
	message: string;
	role: 'assistant' | 'user';
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, role }) => {
	const isBot = role === 'assistant';
	return (
		<View style={[
			styles.bubble,
			isBot ? styles.botBubble : styles.userBubble,
		]}>
			<Text style={[
				styles.message,
				isBot ? styles.botMessage : styles.userMessage
			]}>
				{message}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	bubble: {
		borderRadius: 16,
		padding: 12,
		marginBottom: 10,
		maxWidth: '80%'
	},
	botBubble: {
		backgroundColor: '#f0f0f0',
		alignSelf: 'flex-start'
	},
	userBubble: {
		backgroundColor: '#007bff',
		alignSelf: 'flex-end'
	},
	message: {
		fontSize: 16,
	},
	botMessage: {
		color: '#333'
	},
	userMessage: {
		color: '#fff'
	},
});

export default ChatBubble;