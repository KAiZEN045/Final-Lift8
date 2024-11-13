import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Animated, Alert } from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

interface SignUpFormProps {
  onSwitch: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const buttonAnimation = useState(new Animated.Value(1))[0];

  const navigation = useNavigation(); // Initialize navigation hook

  const signUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Sign up the user with email and password
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      const user = data.user;

      // Save additional user data to "profiles" table if user exists
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, firstName, lastName }]);

        if (profileError) throw profileError;

        // Navigate to login screen after successful sign-up
        navigation.navigate('login'); // Navigate to login screen
        Alert.alert('Success', 'Please check your email for verification!');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred during sign-up.');
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
      <Text style={styles.headerText}>Create Account</Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#aaa"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#aaa"
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#aaa"
      />
      <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            animateButton();
            signUp();
          }}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </Animated.View>
      <Text style={styles.toggleText} onPress={onSwitch}>
        Already have an account? Login
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

export default SignUpForm;
