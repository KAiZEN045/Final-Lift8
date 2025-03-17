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
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        // Fetch user role from Supabase
        const { data: userData, error: roleError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single();

        if (roleError) {
          Alert.alert('Error', 'User role not found.');
          return;
        }

        if (!userData?.role){
          navigation.navigate('home' , {userId: data.user.id})
          return;
        }

        Alert.alert('Success', 'You are logged in!');

        // Navigate based on role
        if (userData.role === 'truck_owner') {
          navigation.navigate('TruckOwnerPortal');
        } else {
          navigation.navigate('user1');
        }
      } catch (error) {
        Alert.alert('Error', 'Invalid Credentials');
      }
    };

    const animateButton = () => {
      Animated.sequence([
        Animated.timing(buttonAnimation, { toValue: 0.9, duration: 100, useNativeDriver: true }),
        Animated.timing(buttonAnimation, { toValue: 1, duration: 100, useNativeDriver: true }),
      ]).start();
    };

    return (
      <View>
        <Text style={styles.headerText}>
          <Text style={styles.headerText1}>Let's get moving{'\n'}</Text>
          <Text style={styles.headerText2}>We're glad to have you on board</Text>
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Email ID"
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
        <TouchableOpacity onPress={() => navigation.navigate('forgot')}>
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
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.toggleText} onPress={onSwitch}>
          Don’t have an account? Create Account
        </Text>
      </View>
    );
  };

  const styles = StyleSheet.create({
    headerText: {
      bottom: '40%',
      marginBottom: 20,
    },
    headerText1: {
      fontSize: 22,
      color: '#303575',
      fontFamily: 'PoppinsSemiBold',
    },
    headerText2: {
      fontSize: 16,
      color: '#000',
      fontFamily: 'PoppinsRegular',
    },
    input: {
      bottom: '25%',
      width: 341,
      height: 50,
      padding: 12,
      marginBottom: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ddd',
      fontFamily: 'PoppinsRegular',
      fontSize: 15,
    },
    forgotPasswordText: {
      color: '#141632',
      fontSize: 14,
      marginBottom: 10,
      bottom: 90,
      alignSelf: 'flex-end',
      marginRight: 10,
    },
    button: {
      bottom: 90,
      backgroundColor: '#141632',
      padding: 15,
      borderRadius: 8,
      width: '100%',
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontSize: 17,
      fontFamily: 'PoppinsMedium',
    },
    toggleText: {
      color: '#141632',
      fontSize: 14,
      alignSelf: 'center',
      bottom: '20%',
      fontFamily: 'PoppinsRegular'
    },
  });

  export default LoginForm;
