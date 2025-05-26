import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import AppScreen from "@/components/AppScreen";
import { colors } from "@/styles/theme";

const IntroToSecurityScreen = () => {
  const router = useRouter();

  const openVideo = () => {
    Linking.openURL("https://www.youtube.com/watch?v=eY4uYwC4ZLE");
  };

  return (
  <AppScreen title="Why Scanning Matters" showBackButton showBottomNav={false}>
  <ScrollView contentContainerStyle={styles.container}>
    <LottieView
      source={require("../assets/animations/IntroToScan.json")}
      autoPlay
      loop
      style={{ width: 250, height: 250, marginBottom: 20 }}
    />

    <Text style={styles.header}>Your Smart Home Security Starts Here</Text>

    <Text style={styles.paragraph}>
      Smart devices like routers, cameras, and even vacuums can be hacked if left unsecured.
    </Text>

    <Text style={styles.paragraph}>
      Hackers exploit default passwords or outdated software.
    </Text>

    <Text style={styles.paragraph}>
      A simple scan reveals connected devices and their risk level.
    </Text>

    <TouchableOpacity style={styles.linkButton} onPress={openVideo}>
      <Text style={styles.linkButtonText}>🎬 Watch a short video</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.startButton} onPress={() => router.push("/UserForm")}>
      <Text style={styles.startButtonText}>Start Your First Scan</Text>
    </TouchableOpacity>
  </ScrollView>
</AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: colors.background,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.header,
    marginBottom: 15,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  linkButton: {
    marginVertical: 20,
  },
  linkButtonText: {
    fontSize: 16,
    color: colors.primary,
    textDecorationLine: "underline",
  },
  startButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
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
