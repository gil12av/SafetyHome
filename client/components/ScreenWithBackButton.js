import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const ScreenWithBackButton = ({ title, children }) => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* כפתור חזרה */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      {/* כותרת */}
      <Text style={styles.title}>{title}</Text>

      {/* תכנים */}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 50,
  },
  title: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 20,
  },
});

export default ScreenWithBackButton;
