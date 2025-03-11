import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from './supabase'; // Import Supabase client

// Define route params type for better TypeScript support
type RouteParams = {
  truckType?: string;
};

const TruckListScreen: React.FC = () => {
  const route = useRoute<RouteProp<Record<string, RouteParams>, string>>();
  const navigation = useNavigation();

  // Ensure truckType is valid, otherwise use an empty string
  const truckType = route.params?.truckType || '';

  const [trucks, setTrucks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrucks = async () => {
      setLoading(true);
  
      console.log("Selected Truck Type:", truckType); // Debugging log
  
      if (!truckType) {
        console.warn("No truck type selected");
        setLoading(false);
        return;
      }
  
      const { data, error } = await supabase
        .from('trucks')
        .select('*')
        .eq('type', truckType); // Filter by truck type
  
      if (error) {
        console.error('Error fetching trucks:', error.message);
        Alert.alert("Error", "Failed to fetch truck data.");
      } else {
        console.log("Fetched Trucks:", data); // Debugging log
        setTrucks(data || []); // Ensure empty array if data is null
      }
      setLoading(false);
    };
  
    fetchTrucks();
  }, [truckType]);

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
              onPress={() => navigation.navigate('TripdetailsScreen', { selectedTruck: item })}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
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
});

export default TruckListScreen;
