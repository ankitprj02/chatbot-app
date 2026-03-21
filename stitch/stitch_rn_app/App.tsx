import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import React, { useEffect } from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View, Platform } from 'react-native';
import Purchases from 'react-native-purchases';
import { RootNavigator } from './src/navigation/RootNavigator';
import { COLORS } from './src/theme/tokens';

export default function App() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    const apiKey = Platform.OS === 'ios' 
      ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS 
      : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID;
      
    if (apiKey) {
      Purchases.configure({ apiKey });
    }
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={styles.loader}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <RootNavigator />
    </>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
});
