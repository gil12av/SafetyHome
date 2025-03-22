import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

interface ScreenWithBackButtonProps {
  title: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>; // שורת הקסם – הופכת את style ללא חובה
}

const ScreenWithBackButton: React.FC<ScreenWithBackButtonProps> = ({ title, children, style }) => {
  const router = useRouter();

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 15,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 50,
    zIndex: 10,
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
  },
});

export default ScreenWithBackButton;
