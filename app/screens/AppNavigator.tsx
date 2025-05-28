import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import ChatScreen from './ChatScreen';  // Layar Chat
import ProfileScreen from './ProfileScreen';  // Layar Profil Pengguna
import SearchScreen from './SearchScreen'; // Layar Pencarian
import HistoryScreen from './HistoryScreen'; // Layar Riwayat Chat
import CustomDrawerContent from './CustomDrawerContent'; // CustomDrawer untuk menu

export type RootDrawerParamList = {
  Chat: undefined;
  Profile: undefined;
  Search: undefined;
  History: undefined;
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Chat"  // Layar pertama yang muncul saat aplikasi dibuka
        drawerContent={(props) => <CustomDrawerContent {...props} />} // Custom Drawer menu
      >
        <Drawer.Screen name="Chat" component={ChatScreen} />
        <Drawer.Screen name="Profile" component={ProfileScreen} />
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="History" component={HistoryScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
