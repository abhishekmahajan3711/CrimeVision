import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { AuthProvider } from './Context/userContext';
import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider>
      <Stack>
        <Stack.Screen name="home/index" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{headerShown:false}}/>
        <Stack.Screen name="signup" options={{headerShown:false}}/>
        <Stack.Screen name="dashboard" options={{title:"Dashboard"}}/>
        {/* <Stack.Screen name="CrimeSelection" options={{headerShown:false}}/> */}
        <Stack.Screen name="CrimeSelection" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="dataVisualization" options={{title:"Data Visualization"}}/>
        <Stack.Screen name='profile' options={{title:"Profile"}}/>
        <Stack.Screen name='aboutus' options={{title:"About Us"}}/>
        <Stack.Screen name='notifications' options={{title:"Notifications"}}/>
        <Stack.Screen name='settings' options={{title:"Settings"}}/>
        <Stack.Screen name='dataAnalytics' options={{title:"Data Visualization"}}/>
      </Stack>
      <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}
