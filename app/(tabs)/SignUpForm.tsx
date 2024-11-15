import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Animated, Alert } from 'react-native';
import { supabase } from './supabase'; // Ensure your Supabase client is initialized correctly
import { useNavigation } from '@react-navigation/native';

interface SignUpFormProps {
  onSwitch: () => void;
}

const SignUpForm: React.FC<SignUpFormProps> = ({ onSwitch }) => {
  const [emailnew, setEmail] = useState('');
  const [passwordnew, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const buttonAnimation = useState(new Animated.Value(1))[0];

  const navigation = useNavigation();

  const signUp = async () => {
    if (passwordnew !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      // Check if the email is already registered
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', emailnew)
        .single();

      if (existingUser) {
        Alert.alert('Error', 'This email is already registered.');
        return;
      }

      // Create the user with Supabase auth
      const { 
        data:{session},
         error } = await supabase.auth.signUp({ email: emailnew, password: passwordnew });
      if (error) {
        console.error('Supabase SignUp Error:', error);
        Alert.alert('Error', error.message || 'An error occurred during sign-up.');
        return;
      }

      if(session){
        navigation.navigate('login')
      }

      const user = data?.user;
      if (user) {
        // Save additional user data to the "profiles" table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, first_name: firstName, last_name: lastName }]);

        if (profileError) {
          console.error('Supabase Profile Insert Error:', profileError);
          Alert.alert('Error', profileError.message || 'Failed to create user profile.');
          return;
        }

        Alert.alert('Success', 'Please check your email for verification!');
        navigation.navigate('login');
      }
    } catch (err) {
      console.error('Unexpected Error:', err);
      Alert.alert('Error', 'An unexpected error occurred during sign-up.');
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonAnimation, { toValue: 0.9, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnimation, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to Lift8</Text>
      <Text style={styles.subHeaderText}>Ready to simplify your truck booking experience</Text>

      {/* First Name Input */}
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
        placeholderTextColor="#AAA"
      />

      {/* Last Name Input */}
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
        placeholderTextColor="#AAA"
      />

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email ID"
        value={emailnew}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholderTextColor="#AAA"
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Create Password"
        value={passwordnew}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#AAA"
      />

      {/* Confirm Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Re-enter the password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#AAA"
      />

      {/* Sign-Up Button */}
      <Animated.View style={{ transform: [{ scale: buttonAnimation }] }}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            animateButton();
            signUp();
          }}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Toggle Text to switch between Sign Up and Login */}
      <Text style={styles.toggleText} onPress={onSwitch}>
        Already have an account? Login
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f7f7f7', // Light background color
  },
  headerText: {
    fontSize: 26,
    fontFamily: 'Poppins-Bold',
    color: '#303575',
    textAlign: 'center',
    marginBottom: 10,
  },
  subHeaderText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#7D7D7D',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    backgroundColor: '#FFF',
  },
  button: {
    backgroundColor: '#141632',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
  },
  toggleText: {
    color: '#141632',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
});

export default SignUpForm;
