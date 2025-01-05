import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
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

  const buttonScale = useSharedValue(1);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async () => {
    setLoading(true);  // התחלת מצב טעינה
    const { firstName, lastName, email, password, confirmPassword, phone, country } = formData;

    if (isRegister) {
      if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !country) {
        Alert.alert("Error", "Please fill in all fields.");
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
      console.log("🔄 Response from server:", data);

      if (!response.ok) throw new Error(data.error || `Failed to ${isRegister ? "register" : "login"}. Please try again.`);

      Alert.alert("Success", `${isRegister ? "Registered" : "Logged in"} successfully!`);

      // שמירת משתמש בקונטקסט כולל שם פרטי
      if (authContext && authContext.login) {
        authContext.login(data);
        console.log("✅ User saved to AuthContext:", data);
      } else {
        console.error("❌ AuthContext is not available.");
      }
      
      router.replace("/Dashboard");

    } catch (error) {
      console.error("❌ Error during login/register:", error);
      Alert.alert("Error", (error as Error).message);
    } finally {
      setLoading(false);  // סיום מצב טעינה
    }
  };

  return (
    <ScreenWithBackButton title={isRegister ? "Register" : "Login"}>
      <View style={styles.container}>
        <Text style={styles.title}>{isRegister ? "Register" : "Login"}</Text>

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
          </>
        )}

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
        >
          <Animated.View style={[styles.button, animatedButtonStyle]}>
            <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
          </Animated.View>
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
