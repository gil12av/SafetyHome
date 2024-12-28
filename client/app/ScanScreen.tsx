import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AuthWrapper from "../components/AuthWrapper";
import { AuthContext } from "../context/AuthContext";
import Scan from "../components/Scan";

const ScanScreen = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logout = authContext?.logout;

  return (
    <AuthWrapper>
      <View style={styles.container}>
        <Text style={styles.title}>Scan Your Network</Text>
        <Text>{`Logged in as: ${user?.firstName || "Guest"}`}</Text>
        <Scan />
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AuthWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 20,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
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

export default ScanScreen;
