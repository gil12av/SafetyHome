import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import LottieView from "lottie-react-native";
import ScreenWithBackButton from "../components/ScreenWithBackButton";

export default function Profile() {
  return (
    <ScreenWithBackButton title="Profile">
    <View style={styles.container}>
      {/* אנימציה */}
      <LottieView
        source={require("../assets/animations/under_construction.json")}
        autoPlay
        loop
        style={styles.animation}
      />

      {/* הודעה מרכזית */}
      <Text style={styles.title}>Profile Page Under Construction</Text>
      <Text style={styles.subtitle}>
        We're working on building an amazing profile page for you. Stay tuned!
      </Text>

      {/* כפתור חזרה */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
    </ScreenWithBackButton>
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
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
