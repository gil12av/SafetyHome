import React, { useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export default function FooterComponent() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <View style={[styles.footerContainer, isDarkMode && styles.footerDark]}>
      <View style={styles.rowTop}>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.darkModeToggle}>
          <FontAwesome5
            name={isDarkMode ? "moon" : "sun"}
            size={18}
            color={isDarkMode ? "#FFD700" : "#333"}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.toggleText}>{isDarkMode ? "Dark Mode" : "Light Mode"}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.rowBottom}>
        <Text style={styles.footerText}>© 2025 SafetyHome - All rights reserved</Text>
        <Text style={styles.footerText}>🛠️ Beta version - Bugs may occur</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#f0f0f0",
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  footerDark: {
    backgroundColor: "#222",
  },
  rowTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  darkModeToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e6e6e6",
    padding: 8,
    borderRadius: 10,
  },
  toggleText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "bold",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    width: "100%",
    marginVertical: 8,
  },
  rowBottom: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#666",
  },
});
