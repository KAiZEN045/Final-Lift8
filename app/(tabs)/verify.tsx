import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { supabase } from './supabase';
import { useNavigation, useRoute } from '@react-navigation/native';

const VerifyOtpScreen: React.FC = () => {
  const [otp, setOtp] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const verifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }

    try {
      // Verify the OTP using Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email', // Use 'sms' if the OTP is sent via phone
      });

      if (error) throw error;

      Alert.alert('Success', 'OTP verified successfully!');

      // Navigate to the update password screen, passing the user email
      navigation.navigate('updatepass', { email });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Invalid OTP. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Enter OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the 6-digit OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric"
        maxLength={6}
        placeholderTextColor="#aaa"
      />
      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#141632',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
  },
});

export default VerifyOtpScreen;
