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
    country: "",
  });

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, email, password, confirmPassword, phone, country } = formData;

    if (isRegister) {
      if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !country) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return;
      }
    } else {
      if (!email || !password) {
        Alert.alert("Error", "Please enter your email and password.");
        return;
      }
    }

    try {
      const endpoint = isRegister ? "register" : "login";
      const response = await fetch(`http://192.168.31.107:5001/api/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? formData : { email, password }),
      });

      if (!response.ok) throw new Error(`Failed to ${isRegister ? "register" : "login"}. Please try again.`);

      const data = await response.json();
      Alert.alert("Success", `${isRegister ? "Registered" : "Logged in"} successfully!`);

      // שמירת משתמש בקונטקסט כולל שם פרטי
      authContext?.login(data.user);
      router.replace("/Dashboard");

    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
    <ScreenWithBackButton title={isRegister ? "Register" : "Login"}>
      <View style={styles.container}>
        <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>
        {isRegister && (
          <>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(value) => handleInputChange("firstName", value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="person" size={20} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(value) => handleInputChange("lastName", value)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="phone" size={20} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                value={formData.phone}
                onChangeText={(value) => handleInputChange("phone", value)}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.inputContainer}>
              <Icon name="location-on" size={20} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Country"
                value={formData.country}
                onChangeText={(value) => handleInputChange("country", value)}
              />
            </View>
          </>
        )}
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
        {isRegister && (
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="#777" />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => handleInputChange("confirmPassword", value)}
              secureTextEntry
            />
          </View>
        )}

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

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switchText}>
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  switchText: {
    color: "#007BFF",
    marginTop: 20,
    fontSize: 14,
    textAlign: "center",
    textDecorationLine: "underline",
  },
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
    marginTop: 10,
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
