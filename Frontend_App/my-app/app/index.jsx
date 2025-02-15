import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
// import {BACKEND_URL} from "@env";
export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Check if the user has a valid token on app startup
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const isValid = await validateToken(token);
        if (isValid) {
          router.replace('/home');
        }
      }
    };
    checkToken();
  }, []);

  const handleSignIn = async () => {
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    try {
      // console.log(BACKEND_URL);
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();

      if (data.token) {
        await AsyncStorage.setItem('authToken', data.token); // Store token in AsyncStorage
        Alert.alert('Success', 'You are now signed in!');
        router.replace('/home'); // Redirect to Home page
      } else {
        Alert.alert('Error', 'Sign-in failed');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Function to validate token
  const validateToken = async (token) => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/v1/app/validatetoken`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button
        title="Don't have an account? Sign Up"
        onPress={() => router.push('/signup')}
        color="gray"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
    borderRadius: 5,
  },
});
