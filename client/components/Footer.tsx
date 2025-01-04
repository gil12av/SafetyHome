import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

const FooterComponent = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {user ? `Connected as: ${user.firstName}` : "Not connected"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FooterComponent;
