import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
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
    <ImageBackground
      source={require('../assets/images/home1.png')} // Ensure correct path for your image
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.headerText}>Embrace your new journey with us</Text>
          <Text style={styles.subText}>Tell us about yourself!</Text>
        </View>

        {/* Buttons for Truck owner and Consumer */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleLogout}>
            <Text style={styles.buttonText}>I'm a Truck Owner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.consumerButton]} onPress={() =>navigation.navigate('user1')}>
            <Text style={styles.buttonText}>I'm a Consumer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the entire screen without distortion
    justifyContent: 'center', // Centers the content vertically
    alignItems: 'center', // Centers content horizontally
  },
  head: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    width: '100%',
    padding: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    bottom: '10%'
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#141632',
    margin: 15,
  },
  subText: {
    fontSize: 16,
    marginBottom: 25,
    color: '#000',
    alignSelf: 'flex-start',
    margin: 15,
    marginTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row', // Aligns buttons side by side
    justifyContent: 'center', // Centers the buttons horizontally
    gap: 10, // Adds space between the buttons
  },
  button: {
    backgroundColor: '#141632',
    padding: 15,
    borderRadius: 8,
    width: '45%', // Makes buttons responsive and equal in size
    alignItems: 'center',
  },
  consumerButton: {
    backgroundColor: '#141632', // Different color for the consumer button
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomePage;
