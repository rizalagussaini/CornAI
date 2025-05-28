import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

import ChatScreen from './ChatScreen';
import SearchScreen from './SearchScreen';
import HistoryScreen from './HistoryScreen';
import CustomDrawerContent from './CustomDrawerContent';
import { ChatThread } from './ChatScreen'; // sesuaikan path import

export type RootDrawerParamList = {
  Chat: undefined;
  Profile: undefined;
  Search: undefined;
  History: { threads: ChatThread[] };
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator drawerContent={props => <CustomDrawerContent {...props} />} initialRouteName="Chat">
        <Drawer.Screen name="Chat" component={ChatScreen} />
        <Drawer.Screen name="Search" component={SearchScreen} />
        <Drawer.Screen name="History" component={HistoryScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
