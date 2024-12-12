import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { FadeIn, BounceIn } from "react-native-reanimated";

export default function Dashboard() {
  const router = useRouter();

  const userName = "John Doe"; // ניתן להחליף במידע מהשרת
  const greeting = new Date().getHours() < 12 ? "Good Morning" : "Good Evening";

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have successfully logged out.");
    router.push("/UserForm"); // ניווט למסך התחברות
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
      {/* ברכת משתמש */}
      <Text style={styles.greeting}>
        {greeting}, <Text style={styles.userName}>{userName}!</Text>
      </Text>

      {/* כרטיסיות */}
      <View style={styles.card}>
        <Icon name="search" size={40} color="#007BFF" />
        <Text style={styles.cardTitle}>Scan Devices</Text>
        <Text style={styles.cardDescription}>Find and scan devices on your network.</Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => router.push("/ScanScreen")}
        >
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Icon name="account-circle" size={40} color="#28a745" />
        <Text style={styles.cardTitle}>Profile</Text>
        <Text style={styles.cardDescription}>Manage your profile and settings.</Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => router.push("/Profile")}
        >
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Icon name="logout" size={40} color="#dc3545" />
        <Text style={styles.cardTitle}>Logout</Text>
        <Text style={styles.cardDescription}>Sign out of your account securely.</Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 20,
  },
  userName: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5, // הצללה
    alignItems: "center",
    width: "90%",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 10,
  },
  cardButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "60%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

