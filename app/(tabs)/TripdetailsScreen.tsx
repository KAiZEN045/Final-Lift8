import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, FlatList, ActivityIndicator, Modal } from 'react-native';
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
  const [showEstimateModal, setShowEstimateModal] = useState(false);

    // Fetch location suggestions
    const fetchLocationSuggestions = async (input: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
      if (!input) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await fetch(
          `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=AlzaSy7qYPQQchhwiMbyXmTeCZGWGhk7Cz706XR&components=country:in`
        );
        const data = await response.json();
        setSuggestions(data.predictions.map((item: any) => item.description).slice(0, 3));
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
      }
    };

    
  // Handle selecting a suggestion
  const handleSelectSuggestion = (text: string, setText: React.Dispatch<React.SetStateAction<string>>, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
    setText(text);
    setSuggestions([]); // Hide suggestions
  };

  // Fetch distance
  const fetchDistance = async () => {
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(from)}&destinations=${encodeURIComponent(drop)}&key=AlzaSy7qYPQQchhwiMbyXmTeCZGWGhk7Cz706XR`
      );
      const data = await response.json();

      if (!data.rows || !data.rows[0].elements || data.rows[0].elements[0].status !== "OK") {
        alert("Unable to fetch distance. Please check your locations.");
        return null;
      }

      const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
      setDistance(distanceInKm);
      return distanceInKm;
    } catch (error) {
      alert("Network issue. Please try again.");
      console.error("Error fetching distance:", error);
      return null;
    }
  };

  const calculateEstimate = async () => {
    if (!from || !drop) {
      alert("Please enter both From and Drop locations.");
      return;
    }
  
    setLoading(true);
  
    const distanceInKm = await fetchDistance();
    if (distanceInKm === null || isNaN(distanceInKm) || distanceInKm <= 0) {
      alert("Invalid distance. Please check the locations entered.");
      setLoading(false);
      return;
    }
  
    const wt = parseFloat(weight);
    if (isNaN(wt) || wt <= 0 || wt > selectedTruck.capacity) {
      alert(`Invalid weight. Max allowed: ${selectedTruck.capacity} kg`);
      setLoading(false);
      return;
    }
  
    const cost = selectedTruck.baseFare + distanceInKm * selectedTruck.perKmRate + wt * selectedTruck.perKgRate;
    setEstimatedCost(cost);
    setLoading(false);
    setShowEstimateModal(true);
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
        
        {loading ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={calculateEstimate}>
            <Text style={styles.buttonText}>{estimatedCost === null ? "Get Estimate" : "Book Truck"}</Text>
          </TouchableOpacity>
        )}
      </View>
      
       {/* Estimate Modal */}
       <Modal visible={showEstimateModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Estimated Cost</Text>
            <Text style={styles.modalTruck}>{selectedTruck.name} (Max {selectedTruck.capacity} kg)</Text>
            <Text style={styles.modalCost}>₹{estimatedCost?.toFixed(2)}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowEstimateModal(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%', alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalTruck: { fontSize: 16, marginBottom: 5 },
  modalCost: { fontSize: 22, fontWeight: 'bold', color: '#007AFF' },
  closeButton: { marginTop: 10, backgroundColor: '#141632', padding: 10, borderRadius: 5 },
  closeButtonText: { color: '#fff', fontSize: 16 },
});

export default TripDetailsScreen;
