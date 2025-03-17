import React from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { supabase } from './supabase';

const HomePage: React.FC = () => {
  const navigation = useNavigation();

  const handleRoleSelection = async (role: 'truck_owner' | 'consumer') => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user?.user) {
      Alert.alert('Error', 'Could not retrieve user.');
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('user_id', user.user.id);

    if (error) {
      Alert.alert('Error', 'Could not update role.');
    } else {
      navigation.navigate(role === 'truck_owner' ? 'TruckOwnerPortal' : 'user1');
    }
  };

  return (
    <ImageBackground
      source={require('../assets/images/home1.png')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.headerText}>Embrace your new journey with us</Text>
          <Text style={styles.subText}>Tell us about yourself!</Text>
        </View>

        {/* Buttons for Truck owner and Consumer */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleRoleSelection('truck_owner')}>
            <Text style={styles.buttonText}>I'm a Truck Owner</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.consumerButton]} onPress={() => handleRoleSelection('consumer')}>
            <Text style={styles.buttonText}>I'm a Consumer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center', alignItems: 'center' },
  head: { backgroundColor: 'rgba(255, 255, 255, 0.6)', width: '100%', padding: 10, alignItems: 'center', marginBottom: 20 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, bottom: '10%' },
  headerText: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, color: '#141632', margin: 15, fontFamily: 'PoppinsBold' },
  subText: { fontSize: 16, marginBottom: 25, color: '#141632', alignSelf: 'flex-start', margin: 15, marginTop: 0, fontFamily: 'PoppinsRegular' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'center', gap: 10 },
  button: { backgroundColor: '#141632', padding: 15, borderRadius: 8, width: '45%', alignItems: 'center' },
  consumerButton: { backgroundColor: '#141632' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default HomePage;
