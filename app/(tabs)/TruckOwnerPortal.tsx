import React, { useState, useEffect } from 'react';
import { 
  View, Text, TouchableOpacity, FlatList, 
  StyleSheet, Alert, ActivityIndicator, Image 
} from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TruckOwnerPortal = () => {
  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // Store logged-in user ID
  const navigation = useNavigation();

  useEffect(() => {
    fetchTrucks();
    getCurrentUser();
  }, []);

  // Fetch logged-in user's ID
  const getCurrentUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (data?.user) {
      setUserId(data.user.id);
    } else {
      console.error('Error fetching user:', error?.message);
    }
  };

  // Fetch all trucks
  const fetchTrucks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('trucks').select('*');
    if (error) {
      Alert.alert('Error', 'Could not fetch trucks.');
    } else {
      setTrucks(data || []);
    }
    setLoading(false);
  };

  // Handle ownership confirmation and update truck ownership
  const handleOwnership = (truck: any ) => {
    Alert.alert(
      'Confirm Ownership',
      'Are you sure you want to claim ownership of this truck?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'OK', 
          onPress: async () => {
            if (!userId) {
              Alert.alert('Error', 'User not authenticated.');
              return;
            }
            
            const { error } = await supabase
              .from('trucks')
              .update({ owner_id: userId })
              .eq('id', truckId);
            
            if (error) {
              Alert.alert('Error', 'Failed to assign truck ownership.');
            } else {
              Alert.alert('Success', 'You are now the owner of this truck.');
              fetchTrucks(); // Refresh truck list
              navigation.navigate('UserRequest', {selectedtruck : truck})
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.head}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            LIFT<Text style={{ fontWeight: '300', fontStyle: 'italic' }}>8</Text>
          </Text>
          <Text style={styles.subtitle}>On your terms, every mile</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#141632" style={{ marginTop: 20 }} />
      ) : trucks.length > 0 ? (
        <FlatList
          data={trucks}
          keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.truckCard}
              onPress={() => handleOwnership(item.id)}
            >
              <Image source={{ uri: item.image_url || 'https://via.placeholder.com/80' }} style={styles.truckImage} />
              <View style={styles.textContainer}>
                <Text style={styles.truckName}>{item.name || 'Unknown Truck'}</Text>
                <Text style={styles.truckCapacity}>Max Capacity: {item.capacity || 'N/A'} kg</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.noTrucksContainer}>
          <Text style={styles.noTrucksText}>No trucks available for this category.</Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('RegisterTruckScreen')}>
        <Text style={styles.addButtonText}>Register a New Truck</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  head: { backgroundColor: '#141632', paddingVertical: 20, paddingHorizontal: 15 },
  titleContainer: { flexDirection: 'column' },
  title: { fontSize: 24, color: '#fff', fontFamily: 'Poppins-Bold' },
  subtitle: { fontSize: 14, color: '#fff', marginTop: 5 },
  listContainer: { padding: 15 },
  truckCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  truckImage: { width: 80, height: 80, marginRight: 15, resizeMode: 'contain' },
  textContainer: { flex: 1 },
  truckName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  truckCapacity: { fontSize: 16, color: '#555', marginTop: 5 },
  noTrucksContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noTrucksText: { fontSize: 18, color: '#888' },
  addButton: { backgroundColor: '#141632', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  addButtonText: { color: '#fff', fontSize: 16 },
});

export default TruckOwnerPortal;
