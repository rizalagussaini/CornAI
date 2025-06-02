import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

type ImageBubbleProps = {
	base64Image?: string;
	role: 'assistant' | 'user';
};

const ImageBubble: React.FC<ImageBubbleProps> = ({ base64Image, role = 'user' }) => {
	return (
		<View style={[styles.bubble, role === 'user' ? styles.userBubble : styles.botBubble]}>
			<Image
				source={{ uri: base64Image }}
				style={styles.image}
				resizeMode="cover"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	bubble: {
		marginVertical: 4,
		marginHorizontal: 8,
		maxWidth: '70%',
		borderRadius: 12,
		overflow: 'hidden',
	},
	userBubble: {
		alignSelf: 'flex-end',
		backgroundColor: '#d1e7dd',
	},
	botBubble: {
		alignSelf: 'flex-start',
		backgroundColor: '#f8d7da',
	},
	image: {
		width: 200,
		height: 200,
		borderRadius: 12,
	},
});

export default ImageBubble;