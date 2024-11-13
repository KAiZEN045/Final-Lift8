// LoginForm.tsx
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Animated, Alert } from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';

interface LoginFormProps {
  onSwitch: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const buttonAnimation = useState(new Animated.Value(1))[0];
  const navigation = useNavigation();

  const signIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      Alert.alert('Success', 'You are logged in!');
      
      // Navigate to Home page
      navigation.navigate('home');
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign-in.');
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnimation, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnimation, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.headerText}>Sign In</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Reset password feature coming soon!')}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            animateButton();
            signIn();
          }}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.toggleText} onPress={onSwitch}>
        Don’t have an account? Create Account
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  forgotPasswordText: {
    color: '#4A90E2',
    fontSize: 14,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  toggleText: {
    color: '#4A90E2',
    marginTop: 15,
    fontSize: 14,
  },
});

export default LoginForm;
