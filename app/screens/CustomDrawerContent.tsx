import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => props.navigation.navigate('Profile')} style={styles.menuItem}>
        <Text style={styles.menuText}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate('Search')} style={styles.menuItem}>
        <Text style={styles.menuText}>Search</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate('History')} style={styles.menuItem}>
        <Text style={styles.menuText}>History</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => props.navigation.navigate('Chat')} style={styles.menuItem}>
        <Text style={styles.menuText}>New Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: '#f7f7f7',
  },
  menuItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  menuText: {
    fontSize: 16,
  },
});

export default CustomDrawerContent;
