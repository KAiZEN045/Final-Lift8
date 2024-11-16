import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';

const EmailOtpScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Function to send OTP to the user's email
  const sendOtp = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    try {
      setLoading(true);

      // Attempt to send OTP email using Supabase
      const { error } = await supabase.auth.signInWithOtp({ email });

      // Error handling with detailed logging
      if (error) {
        console.error('Supabase Error:', error);
        Alert.alert('Error', error.message || 'Failed to send OTP. Please try again.');
        return;
      }

      Alert.alert('OTP Sent', 'A 6-digit OTP has been sent to your email.');
      navigation.navigate('verify', { email });
    } catch (err) {
      console.error('Unexpected Error:', err);
      Alert.alert('Error', 'An unexpected error occurred while sending the OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>
  <Text style={styles.logoLift}>LIFT</Text>
  <Text style={styles.logoEight}>8</Text>
</Text>
      <Text style={styles.headerText}>Email Verification</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#aaa"
        editable={!loading}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={sendOtp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Sending...' : 'Send OTP'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  logoText: {
    fontSize: 62,
    color: '#0c2c47',
    bottom: '10%',
    flexDirection: 'row',
    alignSelf: 'center'
  },
  logoLift: {
    fontFamily: 'PoppinsSemiBold', // Semi-bold font style
  },
  logoEight: {
    fontFamily: 'PoppinsItalic', // Italic font style
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'PoppinsSemiBold',
    color: '#141632',
    bottom: '10%'
  },
  input: {
    width: '100%',
    height: 50,
    padding: 12,
    backgroundColor: '#E6E6E6',
    borderRadius: 8,
    marginBottom: 20,
    bottom: '10%',
  },
  button: {
    backgroundColor: '#141632',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    bottom: '10%'
  },
  buttonDisabled: {
    backgroundColor: '#888',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'PoppinsSemiBold'
  },
});

export default EmailOtpScreen;
