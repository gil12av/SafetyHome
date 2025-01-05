import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

export default function DevicesScreen() {
  return (
    <ScreenWithBackButton title="Device">
      <View style={styles.container}>
        <Text style={styles.title}>Connected Devices</Text>
        <Text>This is the Devices screen. Content will be added soon.</Text>
      </View>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
