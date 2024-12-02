import React from 'react';
import { View, Text, StyleSheet, Button, Image } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/main_logo.png')}
        style={styles.logo}
      />
      <Text style={styles.title}>Welcome to My Smart Home App</Text>
      <Text style={styles.subtitle}>
        Manage and secure your smart devices easily with AI assistance.
      </Text>
      <Button
        title="Sign In / Register"
        onPress={() => navigation.navigate('UserForm')}
        color="#007BFF"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;
