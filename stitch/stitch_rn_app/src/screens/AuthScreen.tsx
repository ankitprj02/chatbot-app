import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { COLORS, FONT_FAMILY, RADII, SHADOWS, SPACING, TYPOGRAPHY } from '../theme/tokens';

export function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function signInWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    else if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>{isSignUp ? 'Create an Account' : 'Welcome to Helper Cane'}</Text>
          <Text style={styles.subtitle}>{isSignUp ? 'Sign up to get started' : 'Sign in to your account to chat'}</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setEmail(text)}
            value={email}
            placeholder="email@address.com"
            placeholderTextColor={COLORS.onSurfaceVariant}
            autoCapitalize={'none'}
            autoCorrect={false}
          />
          <TextInput
            style={styles.input}
            onChangeText={(text) => setPassword(text)}
            value={password}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={COLORS.onSurfaceVariant}
            autoCapitalize={'none'}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={() => isSignUp ? signUpWithEmail() : signInWithEmail()} 
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.switchButton} 
              onPress={() => setIsSignUp(!isSignUp)}
              disabled={loading}
            >
              <Text style={styles.switchButtonText}>
                {isSignUp ? 'Already have an account? Sign In' : 'New here? Create an account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: SPACING.xl * 2,
    alignItems: 'center',
  },
  title: {
    ...TYPOGRAPHY.headlineLg,
    color: COLORS.onSurface,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onSurfaceVariant,
  },
  formContainer: {
    gap: SPACING.md,
  },
  input: {
    backgroundColor: COLORS.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: `${COLORS.outlineVariant}50`,
    borderRadius: RADII.md,
    padding: SPACING.md,
    ...TYPOGRAPHY.bodyLg,
    color: COLORS.onSurface,
  },
  buttonContainer: {
    marginTop: SPACING.lg,
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: RADII.full,
    alignItems: 'center',
    ...SHADOWS.lifted,
  },
  buttonText: {
    ...TYPOGRAPHY.labelLg,
    color: COLORS.onPrimary,
  },
  switchButton: {
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  switchButtonText: {
    ...TYPOGRAPHY.labelLg,
    color: COLORS.primary,
  },
});
