import React, { useState, useContext } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import { API_URL } from "@/services/api";
import axios from "axios";
import globalStyles from "../styles/globalStyles";

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
      const response = await axios.post(
        `${API_URL}/users/${endpoint}`,
        isRegister ? formData : { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.data || response.status >= 400) {
        throw new Error(response.data?.error || "Failed to process request.");
      }

      Alert.alert("Success", isRegister ? "Registration successful!" : "Login successful!");

      await authContext?.login(email, password);
      router.replace("/Dashboard");
    } catch (error) {
      const axiosError = error as any;
      Alert.alert("Error", axiosError.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithBackButton title={isRegister ? "Register" : "Login"} style={globalStyles.screenContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>{isRegister ? "Create Account" : "Welcome Back!"}</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <>
            {isRegister && (
              <>
                <InputField icon="person" placeholder="First Name" value={formData.firstName} onChangeText={(v: string) => handleInputChange("firstName", v)} />
                <InputField icon="person" placeholder="Last Name" value={formData.lastName} onChangeText={(v: string) => handleInputChange("lastName", v)} />
                <InputField icon="phone" placeholder="Phone" value={formData.phone} onChangeText={(v: string) => handleInputChange("phone", v)} keyboardType="phone-pad" />
                <InputField icon="location-on" placeholder="Country" value={formData.country} onChangeText={(v: string) => handleInputChange("country", v)} />
              </>
            )}

            <InputField icon="email" placeholder="Email" value={formData.email} onChangeText={(v: string) => handleInputChange("email", v)} keyboardType="email-address" />
            <InputField icon="lock" placeholder="Password" value={formData.password} onChangeText={(v: string) => handleInputChange("password", v)} secureTextEntry />

            {isRegister && (
              <InputField icon="lock" placeholder="Confirm Password" value={formData.confirmPassword} onChangeText={(v: string) => handleInputChange("confirmPassword", v)} secureTextEntry />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.switchText}>
                {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScreenWithBackButton>
  );
}

const InputField = ({ icon, ...props }: { icon: string } & any) => (
  <View style={styles.inputContainer}>
    <Icon name={icon} size={20} color="#777" />
    <TextInput style={styles.input} placeholderTextColor="#999" {...props} />
  </View>
);

const styles = StyleSheet.create({
  innerContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    width: "90%",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  switchText: {
    color: "#007BFF",
    marginTop: 20,
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
