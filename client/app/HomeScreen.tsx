// דף הבית כשרוצים לחזור אחורה.
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from "react-native";
import { useRouter } from "expo-router";

const HomeScreen = () => {
  const router = useRouter();

  const handleRegisterSuccess = () => {
    Alert.alert("Success", "Your registration was successful!");
  };

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/main_logo.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to Smart Home Security</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("./UserForm")}>
        <Text style={styles.buttonText}>Sign In / Register</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.scanButton]} onPress={() => router.push("/ScanScreen")}>
        <Text style={styles.buttonText}>Go to Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  scanButton: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default HomeScreen;
