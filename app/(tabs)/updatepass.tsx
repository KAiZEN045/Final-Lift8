import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { supabase } from './supabase';
import { useNavigation, useRoute } from '@react-navigation/native';

const UpdatePasswordScreen: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { email } = route.params as { email: string };

  const updatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        email,
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert('Success', 'Password updated successfully!');
      // Navigate back to the login screen
      navigation.navigate('login')
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Failed to update password.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Create New Password</Text>
      <Text style={styles.text}>It must be different from previously{'\n'}used password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity style={styles.button} onPress={updatePassword}>
        <Text style={styles.buttonText}>Update Password</Text>
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
    textAlign: 'left',
    bottom: '20%',
    fontFamily: 'PoppinsSemiBold',
    color:'#141632'
  },
  text: {
    fontSize: 16,
    marginBottom: 20,
    fontFamily: 'PoppinsRegular',
    bottom: '21%',
  },
  input: {
    width: '100%',
    height: 50,
    padding: 12,
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    marginBottom: 20,
    bottom: '20%'
  },
  button: {
    backgroundColor: '#141632',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    bottom: '20%'
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontFamily: 'PoppinsSemiBold'
  },
});

export default UpdatePasswordScreen;
