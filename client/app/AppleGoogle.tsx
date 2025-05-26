import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import LottieView from "lottie-react-native";
import AppScreen from "@/components/AppScreen";

const { width } = Dimensions.get("window");

export default function AuthOptions() {
  return (
    <AppScreen title="Auth" showBackButton>
      <View style={styles.container}>
        <LottieView
          source={require("../assets/animations/under_construction.json")}
          autoPlay
          loop
          style={{ width: width * 0.8, height: width * 0.8 }}
        />
        <Text style={styles.text}>This feature is under construction... Stay tuned :) </Text>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "500",
    color: "#555",
  },
});
