import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import FooterComponent from "@/components/Footer";
import { useAuth } from "../context/AuthContext";
import LottieView from "lottie-react-native";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "@/styles/globalStyles";

export default function Profile() {
  const { user, logout } = useAuth();

  return (
    <>
      <ScreenWithBackButton title="Profile" style={globalStyles.screenContainer}>
        <View style={styles.content}>
          <LottieView
            source={require("../assets/animations/under_construction.json")}
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.title}>Profile Page Under Construction</Text>
          <Text style={styles.subText}>
            {`Logged in as: ${user?.firstName || "Guest"}`}
          </Text>

          <TouchableOpacity style={styles.logoutButton} onPress={logout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScreenWithBackButton>

      <FooterComponent />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    justifyContent: "center",
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 30,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
