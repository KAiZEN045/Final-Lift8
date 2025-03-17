import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { supabase } from './supabase';

const ConsumerNegotiationScreen: React.FC = () => {
  const route = useRoute();
  const { selectedTruck, truckOwnerId, consumerId, estimatedCost } = route.params as {
    selectedTruck: { id: string; name: string; image_url: string };
    truckOwnerId: string;
    consumerId: string;
    estimatedCost: number;
  };

  const [offerPrice, setOfferPrice] = useState('');
  const [negotiation, setNegotiation] = useState<any>(null);

  // Define the allowed price range
  const minPrice = estimatedCost * 0.8;
  const maxPrice = estimatedCost;

  // Validate and send an offer
  const sendOffer = async () => {
    const price = parseFloat(offerPrice);
    
    if (!offerPrice || isNaN(price)) {
      Alert.alert("Invalid input", "Please enter a valid numeric price.");
      return;
    }

    if (price < minPrice || price > maxPrice) {
      Alert.alert(
        "Invalid Offer",
        `Your offer must be between ₹${minPrice.toFixed(2)} and ₹${maxPrice.toFixed(2)}`
      );
      return;
    }

    const { data, error } = await supabase
      .from('negotiations')
      .insert([
        {
          consumer_id: consumerId,
          truck_owner_id: truckOwnerId,
          truck_id: selectedTruck.id,
          requested_price: price,
          status: "pending",
        }
      ])
      .select()
      .single();

    if (error) {
      Alert.alert("Error sending offer", error.message);
    } else {
      setNegotiation(data);
    }
  };

  // Listen for real-time negotiation updates
  useEffect(() => {
    const subscription = supabase
      .channel('negotiation_updates')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'negotiations' }, (payload) => {
        if (payload.new.consumer_id === consumerId) {
          setNegotiation(payload.new);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Accept the counteroffer
  const acceptOffer = async () => {
    const { error } = await supabase
      .from('negotiations')
      .update({ status: "confirmed" })
      .eq('id', negotiation.id);

    if (error) {
      Alert.alert("Error accepting offer", error.message);
    } else {
      Alert.alert("Booking Confirmed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.truckName}>{selectedTruck.name}</Text>
      <Text style={styles.priceRange}>
        Offer must be between **₹{minPrice.toFixed(2)} and ₹{maxPrice.toFixed(2)}**
      </Text>
      {negotiation ? (
        <View style={styles.negotiationBox}>
          <Text>Status: {negotiation.status.toUpperCase()}</Text>
          {negotiation.counter_offer ? (
            <>
              <Text>Truck Owner Counteroffer: ₹{negotiation.counter_offer}</Text>
              <TouchableOpacity style={styles.acceptButton} onPress={acceptOffer}>
                <Text style={styles.buttonText}>Accept Counteroffer</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Waiting for Truck Owner's Response...</Text>
          )}
        </View>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your price"
            keyboardType="numeric"
            value={offerPrice}
            onChangeText={setOfferPrice}
          />
          <TouchableOpacity style={styles.button} onPress={sendOffer}>
            <Text style={styles.buttonText}>Negotiate Price</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  truckName: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  priceRange: { fontSize: 16, color: 'gray', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, width: '80%', borderRadius: 5, marginBottom: 10 },
  button: { backgroundColor: '#141632', padding: 15, borderRadius: 5, alignItems: 'center', width: '80%' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  negotiationBox: { padding: 20, borderWidth: 1, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  acceptButton: { marginTop: 10, backgroundColor: 'green', padding: 10, borderRadius: 5 },
});

export default ConsumerNegotiationScreen;
