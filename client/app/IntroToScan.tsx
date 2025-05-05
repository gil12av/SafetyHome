import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import LottieView from "lottie-react-native";

const IntroToSecurityScreen = () => {
  const router = useRouter();

  const openVideo = () => {
    Linking.openURL("https://www.youtube.com/watch?v=eY4uYwC4ZLE");
  };

  return (
    <ScreenWithBackButton title="Why Scanning Matters">
      <ScrollView contentContainerStyle={styles.container}>
        <LottieView
          source={require("../assets/animations/IntroToScan.json")}
          autoPlay
          loop
          style={{ width: 250, height: 250, marginBottom: 20 }}
        />
        <Text style={styles.header}>Your Smart Home Security Starts Here</Text>

        <Text style={styles.paragraph}>
          In today’s world, smart devices like routers, cameras, and even robotic vacuums can be easily hacked if proper precautions are not taken.
        </Text>

        <Text style={styles.paragraph}>
          One of the most common ways hackers get in is through default passwords or outdated software versions.
        </Text>

        <Text style={styles.paragraph}>
          With a simple scan, you can find out which devices are connected to your network and what their risk level is.
        </Text>

        <TouchableOpacity style={styles.linkButton} onPress={openVideo}>
          <Text style={styles.linkButtonText}>🎬 Watch a short introduction video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/ScanScreen")}
        >
          <Text style={styles.startButtonText}>Start Your First Scan</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWithBackButton>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  linkButton: {
    marginVertical: 20,
  },
  linkButtonText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default IntroToSecurityScreen;
