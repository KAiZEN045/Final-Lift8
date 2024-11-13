// LoginScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';

const LoginScreen: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {isSignUp ? (
          <SignUpForm onSwitch={() => setIsSignUp(false)} />
        ) : (
          <LoginForm onSwitch={() => setIsSignUp(true)} />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
  },
});

export default LoginScreen;
