import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';

const User1Page: React.FC = () => {
  const [location, setLocation] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<string>('Truck'); // Default tab

  useEffect(() => {
    let locationSubscription: any = null;

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (userLocation) => {
          setLocation(userLocation.coords);
        }
      );
    };

    getLocation();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>

      {/* Display Error Message if Permission Denied */}
      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : (
        <>
          {/* Show Map if Location is Available */}
          {location && (
            <MapView
              style={styles.map}
              region={{
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              showsUserLocation={true}
              followsUserLocation={true}
            >
              <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
            </MapView>
          )}

          {/* Bottom Card with Tab Navigation */}
          <View style={styles.bottomCard}>
            {/* Tab Options */}
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={() => setSelectedTab('Share Load')}>
                <Text style={[styles.tabText, selectedTab === 'Share Load' && styles.activeTab]}>Share Load</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTab('Truck')}>
                <Text style={[styles.tabText, selectedTab === 'Truck' && styles.activeTab]}>Truck Type</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSelectedTab('Documents')}>
                <Text style={[styles.tabText, selectedTab === 'Documents' && styles.activeTab]}>Documents</Text>
              </TouchableOpacity>
            </View>

            {/* Content Based on Selected Tab */}
            <View style={styles.contentContainer}>
              {selectedTab === 'Share Load' && (
                <>
                  <Text style={styles.contentTitle}>Share Load</Text>
                  <Text>Find available loads to share with others.</Text>
                </>
              )}
              {selectedTab === 'Truck' && (
                <>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.openButton}>
                      <Text style={styles.buttonText1}>Open</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.closedButton}>
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style= {styles.txt}>To ensure a smooth continuation of your process, please select an option.</Text>
                </>
              )}
              {selectedTab === 'Documents' && (
                <>
                  <Text style={styles.contentTitle}>Documents</Text>
                  <Text>Upload or manage your transport documents.</Text>
                </>
              )}
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    txt:{
        fontSize: 14,
        fontFamily: 'PoppinsRegular'
    },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    padding: 20,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  map: {
    width: '100%',
    height: '105%',
    marginBottom: 20,
    resizeMode: 'cover',
    zIndex: -1,
  },
  bottomCard: {
    width: '90%',
    height: 200,
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#888',
    fontFamily: 'Poppins'
  },
  activeTab: {
    color: '#000',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  contentContainer: {
    marginTop: 20,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
    marginBottom: 30
  },
  openButton: {
    borderColor: '#141632',
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  closedButton: {
    backgroundColor: '#141632',
    padding: 10,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold'
  },
  buttonText1: {
    color: '#141632',
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold'
  },
});

export default User1Page;
