import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { supabase } from './supabase';
import { useNavigation, useRoute } from '@react-navigation/native';

const VerifyOtpScreen: React.FC = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [timer, setTimer] = useState(60);
  const inputs = useRef<Array<TextInput | null>>([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params as { email: string };

  useEffect(() => {
    if (isResendDisabled) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false);
            return 60;
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isResendDisabled]);

  const handleChange = (text: string, index: number) => {
    if (text.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } else if (text.length === 0 && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const verifyOtp = async () => {
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit OTP.');
      return;
    }

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email',
      });

      if (error) throw error;

      Alert.alert('Success', 'OTP verified successfully!');
      navigation.navigate('updatepass', { email });
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Invalid OTP. Please try again.');
    }
  };

  const resendOtp = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      Alert.alert('Resent', 'A new verification code has been sent to your email.');
      setIsResendDisabled(true);
      setTimer(60); // Reset the timer to 60 seconds
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Email Verification</Text>
      <Text style={styles.text}>Verification code sent! Check your{'\n'}email to continue.</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            keyboardType="numeric"
            maxLength={1}
            autoFocus={index === 0}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={verifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={resendOtp} disabled={isResendDisabled}>
        <Text style={[styles.resendText, isResendDisabled && styles.disabledText]}>
          {isResendDisabled ? `Resend in ${timer}s` : "Didn’t receive an email? Resend"}
        </Text>
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
    alignSelf: 'flex-start',
    bottom: '20%',
    fontFamily: 'PoppinsSemiBold',
    color: '#141632',
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'PoppinsRegular',
    bottom: '21%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    color: '#141632',
    bottom: '350%',
  },
  button: {
    backgroundColor: '#141632',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    bottom: '20%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'PoppinsSemiBold',
  },
  resendText: {
    marginTop: 20,
    fontSize: 14,
    color: '#141632',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: 'PoppinsRegular',
    bottom: '475%',
  },
  disabledText: {
    color: '#aaa',
  },
});

export default VerifyOtpScreen;
