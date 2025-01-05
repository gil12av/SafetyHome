import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

export default function UserForm() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    country: "",
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { firstName, lastName, email, password, confirmPassword, phone, country } = formData;

    if (isRegister) {
      if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !country) {
        Alert.alert("Error", "All fields are required.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        setLoading(false);
        return;
      }
    } else {
      if (!email || !password) {
        Alert.alert("Error", "Please enter your email and password.");
        setLoading(false);
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

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to process request.");

      Alert.alert("Success", isRegister ? "Registration successful!" : "Login successful!");
      authContext?.login(data.user);
      router.replace("/Dashboard");

    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithBackButton title={isRegister ? "Register" : "Login"}>
      <View style={styles.container}>
        <Text style={styles.title}>{isRegister ? "Create Account" : "Welcome Back!"}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <>
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
          </>
        )}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switchText}>
            {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
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
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    width: "90%",
  },
  input: {
    flex: 1,
    marginLeft: 10,
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    color: "#007BFF",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
