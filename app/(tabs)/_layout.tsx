import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
	return (
		<Tabs screenOptions={{ headerShown: false }}>
			<Tabs.Screen
				name="index"
				options={{
					title: 'Beranda',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="home-outline" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="chat"
				options={{
					title: 'Chat',
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}