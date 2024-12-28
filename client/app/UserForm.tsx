import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

export default function UserForm() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const { email, password } = formData;
  
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }
  
    const endpoint = isRegister ? "register" : "login";
    console.log("🔄 Sending request to:", endpoint);
  
    try {
      const response = await fetch(`http://localhost:5001/api/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      console.log("📩 Response status:", response.status);
  
      if (!response.ok) {
        throw new Error("Failed to authenticate. Please try again.");
      }
  
      const data = await response.json();
      console.log("✅ User data received:", data);
  
      authContext?.login(data);  // שליחת כל הנתונים ל-authContext
      router.replace("/Dashboard");  // ניתוב לאחר התחברות
    } catch (error) {
      console.error("❌ Error during login:", error);
      Alert.alert("Error", (error as Error).message);
    }
  };
  
  

  return (
    <ScreenWithBackButton title={isRegister ? "Register" : "Login"}>
      <View style={styles.container}>
        <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>
        <View style={styles.inputContainer}>
          <Icon name="email" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <View style={styles.inputContainer}>
          <Icon name="lock" size={20} color="#777" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={formData.password}
            onChangeText={(value) => handleInputChange("password", value)}
            secureTextEntry
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPressIn={() => (buttonScale.value = withSpring(0.9))}
          onPressOut={() => (buttonScale.value = withSpring(1))}
          onPress={handleSubmit}
        >
          <Animated.View style={[styles.button, animatedButtonStyle]}>
            <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
          </Animated.View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => setIsRegister(!isRegister)}
        >
          <Text style={{ color: "#007BFF" }}>
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
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
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    width: "80%",
  },
  input: {
    flex: 1,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
