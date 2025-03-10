import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  SafeAreaView,
  Modal,
  FlatList,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

const GOMAPS_API_KEY = "AlzaSy7qYPQQchhwiMbyXmTeCZGWGhk7Cz706XR"; // Replace with actual API key

const TripDetailsScreen: React.FC = () => {
  const route = useRoute();
  const { selectedTruck } = route.params as {
    selectedTruck: { name: string; capacity: number; baseFare: number; perKmRate: number; perKgRate: number };
  };

  const [fromLocation, setFromLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [estimate, setEstimate] = useState<number | null>(null);
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<string[]>([]);
  const [dropSuggestions, setDropSuggestions] = useState<string[]>([]);

  // Fetch location suggestions
  const fetchLocationSuggestions = async (input: string, setSuggestions: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (!input) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOMAPS_API_KEY}&components=country:in`
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
        `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(fromLocation)}&destinations=${encodeURIComponent(dropLocation)}&key=${GOMAPS_API_KEY}`
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
    if (!fromLocation || !dropLocation || !weight) {
      alert("Please fill in all fields.");
      return;
    }
  
    const enteredWeight = Number(weight);
    if (isNaN(enteredWeight) || enteredWeight <= 0) {
      alert("Weight must be a valid positive number.");
      return;
    }
  
    if (enteredWeight > selectedTruck.capacity) {
      alert("Exceeds truck capacity.");
      return;
    }
  
    const calculatedDistance = await fetchDistance();
    if (calculatedDistance === null) return;
  
    const estimatedCost =
      selectedTruck.baseFare +
      (calculatedDistance || 0) * selectedTruck.perKmRate +
      enteredWeight * selectedTruck.perKgRate;
  
    setEstimate(estimatedCost);
    setShowEstimateModal(true);
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            LIFT<Text style={styles.italic}>8</Text>
          </Text>
          <Text style={styles.subtitle}>On your terms, every mile</Text>
        </View>

        {/* Truck Details */}
        <View style={styles.truckCard}>
          <Text style={styles.truckTitle}>{selectedTruck.name}</Text>
          <Text style={styles.truckDetails}>Capacity: {selectedTruck.capacity} kg</Text>
        </View>

        {/* Input Fields */}
        <View style={styles.card}>
          {/* From Location */}
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter from location"
              placeholderTextColor={"#777"}
              value={fromLocation}
              onChangeText={(text) => {
                setFromLocation(text);
                fetchLocationSuggestions(text, setFromSuggestions);
              }}
            />
          </View>
          {fromSuggestions.length > 0 && (
            <FlatList
              data={fromSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectSuggestion(item, setFromLocation, setFromSuggestions)}>
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Drop Location */}
          <View style={styles.inputContainer}>
            <Ionicons name="navigate" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter drop location"
              placeholderTextColor={"#777"}
              value={dropLocation}
              onChangeText={(text) => {
                setDropLocation(text);
                fetchLocationSuggestions(text, setDropSuggestions);
              }}
            />
          </View>
          {dropSuggestions.length > 0 && (
            <FlatList
              data={dropSuggestions}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectSuggestion(item, setDropLocation, setDropSuggestions)}>
                  <Text style={styles.suggestionItem}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          {/* Description */}
          <View style={styles.inputContainer}>
            <Ionicons name="cube" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter weight (kg)"
              placeholderTextColor={"#777"}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="clipboard" size={20} color="#555" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter weight (kg)"
              placeholderTextColor={"#777"}
              keyboardType="numeric"
              value={weight}
              onChangeText={setWeight}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={calculateEstimate}>
            <Text style={styles.buttonText}>Get Estimate</Text>
          </TouchableOpacity>
        </View>

        {/* Modal for Estimate */}
        <Modal visible={showEstimateModal} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Estimated Fare</Text>
              <Text style={styles.modalText}>Distance: {distance?.toFixed(2)} km</Text>
              <Text style={styles.modalText}>Estimated Cost: ₹{estimate?.toFixed(2)}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowEstimateModal(false)}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },

  header: { backgroundColor: "#141632", padding: 20, alignItems: "center" },
  title: { fontSize: 24, color: "#fff", fontWeight: "bold" },
  italic: { fontWeight: "300", fontStyle: "italic" },
  subtitle: { fontSize: 14, color: "#fff", marginTop: 5 },

  truckCard: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  truckTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  truckDetails: { fontSize: 14, color: "#555", marginTop: 5 },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    marginBottom: 10,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16 },

  suggestionItem: {
    padding: 10,
    backgroundColor: "#f1f1f1",
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },

  button: {
    backgroundColor: "#141632",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },

  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  modalText: { fontSize: 16, marginBottom: 5 },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#141632",
    padding: 10,
    borderRadius: 5,
  },
});


export default TripDetailsScreen;
