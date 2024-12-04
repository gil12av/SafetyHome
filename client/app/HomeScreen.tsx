import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  UserForm: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleScanNetwork = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/scan-network');
      const data = await response.json();
      Alert.alert('Scan Results', JSON.stringify(data));
    } catch (error) {
      Alert.alert('Error', 'Failed to scan the network');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/main_logo.png')} // התמונה חייבת להיות תחת assets/images
        style={styles.logo} // שימוש בסגנון המוגדר
      />
      <Text style={styles.title}>Welcome to Smart Home Security</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('UserForm')}
      >
        <Text style={styles.buttonText}>Sign In / Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.scanButton]}
        onPress={handleScanNetwork}
      >
        <Text style={styles.buttonText}>Scan Network</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  logo: {
    width: 150, // גודל התמונה
    height: 150,
    marginBottom: 20, // מרווח תחתון
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  scanButton: {
    backgroundColor: '#28a745',
  },
});

export default HomeScreen;
