import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';

const HomePage: React.FC = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      Alert.alert('Logged Out', 'You have successfully logged out.');
      navigation.navigate('login'); // Navigate back to Login screen
    } catch (error) {
      Alert.alert('Error', 'An error occurred during logout.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Welcome to the Home Page!</Text>
      <Text style={styles.subText}>You are successfully logged in.</Text>

      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subText: {
    fontSize: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#4A90E2',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomePage;
