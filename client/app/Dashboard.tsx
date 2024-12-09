import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const userName = "John Doe"; // ניתן להחליף במידע מהשרת
  const greeting = new Date().getHours() < 12 ? "Good Morning" : "Good Evening";

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have successfully logged out.");
    router.push("/UserForm"); // ניווט למסך התחברות
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>
        {greeting}, {userName}!
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push("/ScanScreen")}>
        <Text style={styles.buttonText}>Scan Devices</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.profileButton]} onPress={() => router.push("/Profile")}>
        <Text style={styles.buttonText}>Go to Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  greeting: {
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
    width: "80%",
  },
  profileButton: {
    backgroundColor: "#28a745",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
