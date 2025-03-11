import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TripDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  
  const { selectedTruck } = route.params as {
    selectedTruck: { 
      name: string; 
      capacity: number; 
      baseFare: number; 
      perKmRate: number; 
      perKgRate: number; 
      image_url: string 
    };
  };

  const [from, setFrom] = useState('');
  const [drop, setDrop] = useState('');
  const [weight, setWeight] = useState('');
  const [description, setDescription] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedCost, setEstimatedCost] = useState<number | null>(null);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (from && drop) {
      setLoading(true);
      fetch(`https://gomaps.pro/api/distance?from=${encodeURIComponent(from)}&to=${encodeURIComponent(drop)}`)
        .then(response => response.json())
        .then(data => {
          setDistance(data.distance);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching distance:', error);
          setLoading(false);
        });
    }
  }, [from, drop]);

  const fetchLocationSuggestions = (query: string, setSuggestions: (suggestions: string[]) => void) => {
    if (query.length < 3) return;
    fetch(`https://gomaps.pro/api/autocomplete?q=${encodeURIComponent(query)}`)
      .then(response => response.json())
      .then(data => setSuggestions(data.suggestions || []))
      .catch(error => console.error('Error fetching location suggestions:', error));
  };

  const calculateEstimate = () => {
    if (distance === null || isNaN(distance) || distance <= 0) {
      alert('Invalid distance. Please check the locations entered.');
      return;
    }
    
    const wt = parseFloat(weight);
    if (isNaN(wt) || wt <= 0 || wt > selectedTruck.capacity) {
      alert(`Invalid weight. Max allowed: ${selectedTruck.capacity} kg`);
      return;
    }
    
    const cost = selectedTruck.baseFare + distance * selectedTruck.perKmRate + wt * selectedTruck.perKgRate;
    setEstimatedCost(cost);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>LIFT<Text style={styles.titleItalic}>8</Text></Text>
        <Text style={styles.subtitle}>On your terms, every mile</Text>
      </View>
      
      <Image source={{ uri: selectedTruck.image_url }} style={styles.truckImage} />
      <Text style={styles.truckName}>{selectedTruck.name}</Text>
      <Text style={styles.truckCapacity}>Max Capacity: {selectedTruck.capacity} kg</Text>
      
      <View style={styles.card}>
        <TextInput 
          style={styles.input} 
          placeholder="From Location" 
          value={from} 
          onChangeText={text => {
            setFrom(text);
            fetchLocationSuggestions(text, setFromSuggestions);
          }} 
        />
        {fromSuggestions.length > 0 && (
          <FlatList
            data={fromSuggestions}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setFrom(item); setFromSuggestions([]); }}>
                <Text style={styles.suggestion}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        
        <TextInput 
          style={styles.input} 
          placeholder="Drop Location" 
          value={drop} 
          onChangeText={text => {
            setDrop(text);
            fetchLocationSuggestions(text, setDropSuggestions);
          }} 
        />
        {dropSuggestions.length > 0 && (
          <FlatList
            data={dropSuggestions}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setDrop(item); setDropSuggestions([]); }}>
                <Text style={styles.suggestion}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
        
        <TextInput style={styles.input} placeholder="Enter Weight (kg)" keyboardType="numeric" value={weight} onChangeText={setWeight} />
        <TextInput style={styles.input} placeholder="Description" value={description} onChangeText={setDescription} />
        
        <TouchableOpacity style={styles.button} onPress={calculateEstimate}>
          <Text style={styles.buttonText}>Get Estimate</Text>
        </TouchableOpacity>
        
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
      </View>
      
      {estimatedCost !== null && (
        <View style={styles.estimateContainer}>
          <Text style={styles.estimateText}>Estimated Cost: ₹{estimatedCost.toFixed(2)}</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: '#f7f7f7' },
  header: { backgroundColor: '#141632', paddingVertical: 20, alignItems: 'flex-start', paddingLeft: 10 },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold' },
  titleItalic: { fontWeight: '300', fontStyle: 'italic' },
  subtitle: { fontSize: 14, color: '#fff', marginTop: 5 },
  truckImage: { width: '100%', height: 50, resizeMode: 'contain', marginVertical: 10 },
  truckName: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  truckCapacity: { fontSize: 16, textAlign: 'center', color: '#666', marginBottom: 10 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, elevation: 3 },
  input: { height: 50, borderColor: '#ccc', borderWidth: 1, borderRadius: 8, paddingHorizontal: 15, marginBottom: 10 },
  suggestion: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc', backgroundColor: '#fff' },
  button: { backgroundColor: '#141632', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { fontSize: 16, color: '#fff', fontWeight: 'bold' },
});

export default TripDetailsScreen;
