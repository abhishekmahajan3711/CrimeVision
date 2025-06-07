import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'; // If using Expo Router

// Logout Function
const logout = async () => {
  try {
    // Remove the auth token
    await AsyncStorage.removeItem('authToken');

    // Optionally, clear all AsyncStorage data
    // await AsyncStorage.clear();

    Alert.alert('Logged Out', 'You have successfully logged out.');

    // Redirect to the login screen
    router.replace('/index'); // Ensure '/login' route exists
  } catch (error) {
    console.error('Error during logout:', error);
    Alert.alert('Error', 'Logout failed. Please try again.');
  }
};
