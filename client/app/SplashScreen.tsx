// מסך טעינה של האפליקציה
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import * as Progress from "react-native-progress";
import { useRouter } from "expo-router";

export default function SplashScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(".");

  // loading effect .
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.01;
        if (next >= 1) {
          clearInterval(interval);
          setTimeout(() => {
            router.replace("/HomeScreen");
          }, 300);
        }
        return next;
      });
    }, 20);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/smart_home_logo_vibrant.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>SafetyHome</Text>
      <Text style={styles.subtitle}>Securing your smart home...</Text>

      <Progress.Bar
        progress={progress}
        width={250}
        height={12}
        borderRadius={6}
        color="#4A90E2"
        unfilledColor="#E0E0E0"
        borderWidth={0}
        animated
        style={styles.progress}
      />

      <Text style={styles.loadingText}>Loading{dots}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#7f8c8d",
    marginBottom: 30,
  },
  progress: {
    marginTop: 10,
  },
  loadingText: {
    fontSize: 16,
    color: "#888",
    marginTop: 15,
    fontStyle: "italic",
  },
});
