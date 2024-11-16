import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

const TruckListScreen: React.FC = () => {
  const route = useRoute();
  const { truckType } = route.params as { truckType: string };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{truckType} Trucks</Text>
      <Text>Displaying a list of {truckType.toLowerCase()} trucks.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default TruckListScreen;
