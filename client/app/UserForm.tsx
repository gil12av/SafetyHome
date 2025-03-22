import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import { API_URL } from "@/services/api"; // ודא שה-API_URL מוגדר נכון
import axios from "axios";

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

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword, phone, country } = formData;

    if (isRegister) {
      if (!firstName || !lastName || !email || !password || !confirmPassword || !phone || !country) {
        Alert.alert("Error", "All fields are required.");
        return false;
      }
      if (password !== confirmPassword) {
        Alert.alert("Error", "Passwords do not match.");
        return false;
      }
      if (!/^[a-zA-Z]+$/.test(firstName)) {
        Alert.alert("Error", "First name can only contain letters.");
        return false;
      }
      if (!/^[a-zA-Z]+$/.test(lastName)) {
        Alert.alert("Error", "Last name can only contain letters.");
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(email)) {
        Alert.alert("Error", "Invalid email address.");
        return false;
      }
    } else {
      if (!email || !password) {
        Alert.alert("Error", "Please enter your email and password.");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    const { email, password } = formData;
    const endpoint = isRegister ? "register" : "login";
  
    try {
      console.log(`📤 Sending Request to: ${API_URL}/users/${endpoint}`);
      console.log("📦 Payload:", JSON.stringify(isRegister ? formData : { email, password }));
  
      const response = await axios.post(`${API_URL}/users/${endpoint}`, isRegister ? formData : { email, password }, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
  
      console.log("📥 Raw Response:", response.data);
  
      if (!response.data || response.status >= 400) {
        throw new Error(response.data?.error || "Failed to process request.");
      }
  
      Alert.alert("Success", isRegister ? "Registration successful!" : "Login successful!");
  
      // 🔍 בדיקה אם ה-Session נשמר
      console.log(`🔍 Checking session at: ${API_URL}/users/me`);
      const sessionResponse = await axios.get(`${API_URL}/users/me`, {
        withCredentials: true,
      });
  
      console.log("📥 Session Response Headers:", sessionResponse.headers);
      console.log("✅ User Data from Session:", sessionResponse.data);
  
      // 📌 שמירת המשתמש באובייקט `authContext`

      await authContext?.login(email, password); 
      
  
      // 🔍 הדפסת המשתמש לפני הניווט
      console.log("📌 authContext User Before Navigation:", authContext?.user);
      
      router.replace("/Dashboard"); // ✅ ניווט קדימה
    } catch (error) {
      const axiosError = error as any;
      console.error("❌ Login/Register Error:", axiosError.response?.data || axiosError.message);
      Alert.alert("Error", axiosError.response?.data?.error || "An unexpected error occurred.");
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

