import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const TripDetailsScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { truck } = route.params as { truck: { id: string; name: string; capacity: string; image: any } };
  const [tripType, setTripType] = useState<'One-way' | 'Round Trip'>('One-way');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>LIFT<Text style={{ fontWeight: '300', fontStyle: 'italic' }}>8</Text></Text>
        <Text style={styles.subtitle}>On your terms, every mile</Text>
      </View>

      {/* Trip Details Card */}
      <View style={styles.card}>
        {/* Trip Type Selector */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, tripType === 'One-way' && styles.activeTab]}
            onPress={() => setTripType('One-way')}>
            <Text style={[styles.tabText, tripType === 'One-way' && styles.activeTabText]}>One-way</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tripType === 'Round Trip' && styles.activeTab]}
            onPress={() => setTripType('Round Trip')}>
            <Text style={[styles.tabText, tripType === 'Round Trip' && styles.activeTabText]}>Round Trip</Text>
          </TouchableOpacity>
        </View>

        {/* Trip Details Form */}
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="\u25BE  Manchester, UK" />
          <TextInput style={styles.input} placeholder="\uD83C\uDF10  Paris, France" />
          <View style={styles.row}>
            <TouchableOpacity style={[styles.input, styles.halfInput]}>
              <Ionicons name="calendar-outline" size={18} color="#555" style={{ marginRight: 5 }} />
              <Text>Sun, Nov 6</Text>
            </TouchableOpacity>
            <TextInput style={[styles.input, styles.halfInput]} placeholder="Parcel Weight" />
          </View>
          <TextInput style={styles.input} placeholder="\u270F\uFE0F  Parcel description" />
        </View>
        
        {/* Get Estimate Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TripSummary', { truck, tripType })}>
          <Text style={styles.buttonText}>Get Estimate</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: '#141632',
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 15,
  },
  tabContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 5,
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#141632',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#141632',
    fontWeight: 'bold',
  },
  form: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#141632',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default TripDetailsScreen;
