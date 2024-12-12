import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";

export default function UserForm() {
  const router = useRouter();
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
    const { firstName, lastName, email, password, confirmPassword, phone, address } = formData;

    if (isRegister) {
      if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !address) {
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

    const endpoint = isRegister ? "register" : "login";
    try {
      const response = await fetch(`http://localhost:5001/api/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isRegister ? formData : { email, password }),
      });

      if (!response.ok) throw new Error(`Failed to ${isRegister ? "register" : "login"}. Please try again.`);

      const data = await response.json();
      Alert.alert("Success", `${isRegister ? "Registered" : "Logged in"} successfully!`);
      router.push("/Dashboard");
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  };

  return (
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
              placeholder="Address"
              value={formData.address}
              onChangeText={(value) => handleInputChange("address", value)}
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
      <TouchableOpacity style={styles.switchButton} onPress={() => setIsRegister(!isRegister)}>
        <Text style={styles.switchButtonText}>
          {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e6f7ff",
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
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

