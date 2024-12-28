import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AuthWrapper from "../components/AuthWrapper";
import { AuthContext } from "../context/AuthContext";
import LottieView from "lottie-react-native";

export default function Profile() {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;

  return (
    <AuthWrapper>
      <View style={styles.container}>
        <LottieView
          source={require("../assets/animations/under_construction.json")}
          autoPlay
          loop
          style={styles.animation}
        />
        <Text style={styles.title}>Profile Page Under Construction</Text>
        <Text>{`Logged in as: ${user?.firstName || "Guest"}`}</Text>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AuthWrapper>
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
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#dc3545",
    padding: 15,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
  },
});
