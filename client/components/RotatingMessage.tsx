import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const messages = [
  "Your smart home, simplified.",
  "Track and secure your devices.",
  "Stay updated with smart alerts.",
];

export default function RotatingMessage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(callback);
  };

  useEffect(() => {
    fadeIn();
    const interval = setInterval(() => {
      fadeOut(() => {
        setCurrentIndex((prev) => (prev + 1) % messages.length);
        fadeIn();
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, marginVertical: 20 }}>
      <Text style={styles.text}>{messages[currentIndex]}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
