import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import FooterComponent from "@/components/Footer";

import { AuthContext } from "../context/AuthContext";
import Scan from "../components/Scan";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

const ScanScreen = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  return (
    <ScreenWithBackButton title="Scan">
        <View style={styles.container}>
          <Text style={styles.title}>Network Scan</Text>
          <Text>{`Logged in as: ${user?.firstName || "Guest"}`}</Text>
          <Scan />
        </View>
      <FooterComponent />
    </ScreenWithBackButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#1E1E1E",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginVertical: 20,
  },
});

export default ScanScreen;
