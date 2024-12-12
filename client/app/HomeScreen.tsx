import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

// טקסטים מתחלפים
const RotatingMessage = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const messages = [
    "Keep your home safe and secure!",
    "Track all your smart devices easily.",
    "Security starts with awareness.",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000); // מתחלף כל 3 שניות
    return () => clearInterval(interval);
  }, []);

  return <Text style={styles.rotatingMessage}>{messages[currentMessage]}</Text>;
};

const HomeScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* לוגו */}
      <Image
        source={require("../assets/images/main_logo.png")}
        style={styles.logo}
      />
      {/* טקסט מתחלף */}
      <RotatingMessage />

      {/* כרטיסיות */}
      <View style={styles.card}>
        <Icon name="login" size={40} color="#4CAF50" />
        <Text style={styles.cardTitle}>Sign In / Register</Text>
        <Text style={styles.cardDescription}>
          Access your account or create a new one.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => router.push("./UserForm")}
        >
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Icon name="shield" size={40} color="#FF5722" />
        <Text style={styles.cardTitle}>Start Scan</Text>
        <Text style={styles.cardDescription}>
          Scan your network for devices and check vulnerabilities.
        </Text>
        <TouchableOpacity
          style={styles.cardButton}
          onPress={() => router.push("./ScanScreen")}
        >
          <Text style={styles.buttonText}>Start Now</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f7ff", // צבע רקע עדין
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 60, // עיגול סביב התמונה
  },
  rotatingMessage: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
    fontStyle: "italic",
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
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
    width: "70%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HomeScreen;
