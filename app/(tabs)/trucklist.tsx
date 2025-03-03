import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TruckListScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { truckType } = route.params as { truckType: string };

  const trucks = {
    Open: [
      { id: '1', name: 'E-loader', capacity: 'max: 350 kg', image: require('../assets/images/e_loader.png') },
      { id: '2', name: '3 Wheeler', capacity: 'max: 500 kg', image: require('../assets/images/3_wheeler.png') },
      { id: '3', name: 'Tata Ace', capacity: 'max: 750 kg', image: require('../assets/images/tata_ace.png') }
    ],
    Closed: [
      { id: '4', name: 'Mini Van', capacity: 'max: 1,250 kg', image: require('../assets/images/Pickup_8ft.png') },
      { id: '5', name: 'Box Truck', capacity: 'max: 1,700 kg', image: require('../assets/images/Pickup_9ft.png') },
      { id: '6', name: 'Tata 407', capacity: 'max: 2,500 kg', image: require('../assets/images/tata-407.png')},
      { id: '7', name: 'Pickup 14ft', capacity: 'max: 3,500 kg', image: require('../assets/images/Pickup_14ft.png')},
    ]
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.head}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            LIFT<Text style={{ fontWeight: '300', fontStyle: 'italic' }}>8</Text>
          </Text>
          <Text style={styles.subtitle}>On your terms, every mile</Text>
        </View>
      </View>

      {/* Truck List */}
      <FlatList
        data={trucks[truckType] || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.truckCard}
            onPress={() => navigation.navigate('TripdetailsScreen', { truck: item })}
          >
            <Image source={item.image} style={styles.truckImage} />
            <View style={styles.textContainer}>
              <Text style={styles.truckName}>{item.name}</Text>
              <Text style={styles.truckCapacity}>{item.capacity}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },

  /** HEADER STYLES **/
  head: {
    backgroundColor: '#141632', 
    paddingVertical: 20,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontFamily: 'Poppins-Bold'
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 5,
  },

  /** TRUCK LIST STYLES **/
  listContainer: {
    padding: 15,
  },
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
  truckImage: {
    width: 80,
    height: 80,
    marginRight: 15,
    resizeMode: 'contain',
  },
  textContainer: {
    flex: 1,
  },
  truckName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  truckCapacity: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
});

export default TruckListScreen;
