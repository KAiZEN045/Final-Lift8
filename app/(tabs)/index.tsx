import React from 'react';
import { SafeAreaView, Text, StatusBar, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { useNavigation } from '@react-navigation/native';
const App: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('login'); // Replace 'Login' with your actual login screen name
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Logo Text */}
      <Text style={styles.logoText}>
  <Text style={styles.logoLift}>LIFT</Text>
  <Text style={styles.logoEight}>8</Text>
</Text>
      <Image source={require('../assets/images/gt.png')} style={styles.image} />
      {/* Welcome Message */}
      <Text style={styles.welcomeText}>Haul Smarter, {'\n'}Go Farther </Text>
      <Text style={styles.welcomeSub}>On Your Terms, every{'\n'}mile</Text>
      {/* Get Started Button */}
      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Let's Go</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image:{
    bottom: '5%'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  logoText: {
    fontSize: 62,
    color: '#0c2c47',
    bottom: '5%',
    flexDirection: 'row',
  },
  logoLift: {
    fontFamily: 'PoppinsSemiBold', // Semi-bold font style
  },
  logoEight: {
    fontFamily: 'PoppinsItalic', // Italic font style
  },
  welcomeText: {
    fontSize: 50,
    color: '#303575',
    textAlign: 'left',
    paddingLeft: '10%',
    alignItems: 'flex-start',
    fontFamily: 'PoppinsSemiBold',
    width: '100%',
  },
  welcomeSub:{
    fontSize: 22,
    textAlign: 'left',
    paddingLeft: '10%',
    alignItems: 'flex-start',
    width: '100%'
  },
  button: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#0c2c47',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width:'80%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PoppinsBold',
  },
});

export default App;
