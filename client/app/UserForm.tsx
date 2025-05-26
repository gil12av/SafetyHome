// 🎨 Fully upgraded UserForm with visual enhancements and interactive features
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { API_URL } from "@/services/api.jsx";
import axios from "axios";
import AppScreen from "@/components/AppScreen";
import { colors } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function UserForm() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        throw new Error((response.data as any)?.error || "Failed to process request.");
      }

      Alert.alert("Success", isRegister ? "Registration successful!" : "Login successful!");

      await authContext?.login(email, password);
      console.log("📌 Logged in user role (from AuthContext):", authContext?.user?.role);
      router.replace("/Dashboard");
    } catch (error) {
      const axiosError = error as any;
      Alert.alert("Error", axiosError.response?.data?.error || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen title={isRegister ? "Register" : "Login"} showBackButton showBottomNav={false}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Image source={require("../assets/images/main_logo.png")} style={styles.logo} />

        <Text style={styles.title}>{isRegister ? "Create Account" : "Welcome Back!"}</Text>

        <View style={styles.switchTab}>
              <TouchableOpacity onPress={() => setIsRegister(false)} style={[styles.tab, !isRegister && styles.activeTab]}>
                <Text style={[styles.tabText, !isRegister && styles.activeText]}>Login</Text>
              </TouchableOpacity>
            
            <TouchableOpacity onPress={() => setIsRegister(true)} style={[styles.tab, isRegister && styles.activeTab]}>
              <Text style={[styles.tabText, isRegister && styles.activeText]}>Register</Text>
            </TouchableOpacity>
          </View>

        
          <Text style={styles.subtitle}>
            {isRegister
              ? "Join SafetyHome and start protecting your smart home today."
              : "Log in to manage your home’s security from anywhere."}
          </Text>


        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <>
            {isRegister && (
              <>
                <View style={styles.benefitsBox}>
                  <Text style={styles.benefitItem}>✔ Scan your smart home in seconds</Text>
                  <Text style={styles.benefitItem}>✔ Get notified about security risks</Text>
                  <Text style={styles.benefitItem}>✔ Receive smart recommendations</Text>
                </View>

                <InputField icon="person" placeholder="First Name" value={formData.firstName} onChangeText={(v: string) => handleInputChange("firstName", v)} />
                <InputField icon="person" placeholder="Last Name" value={formData.lastName} onChangeText={(v: string) => handleInputChange("lastName", v)} />
                <InputField icon="phone" placeholder="Phone" value={formData.phone} onChangeText={(v: string) => handleInputChange("phone", v)} keyboardType="phone-pad" />
                <InputField icon="location-on" placeholder="Country" value={formData.country} onChangeText={(v: string) => handleInputChange("country", v)} />
                
              </>
            )}

            <InputField icon="email" placeholder="Email" value={formData.email} onChangeText={(v: string) => handleInputChange("email", v)} keyboardType="email-address" />

            <View style={styles.inputContainer}>
              <Icon name="lock" size={20} color="#777" />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={formData.password}
                onChangeText={(v: string) => handleInputChange("password", v)}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <MaterialCommunityIcons name={showPassword ? "eye" : "eye-off"} size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>

            {isRegister && (
              <InputField icon="lock" placeholder="Confirm Password" value={formData.confirmPassword} onChangeText={(v: string) => handleInputChange("confirmPassword", v)} secureTextEntry />
            )}

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>{isRegister ? "Register" : "Login"}</Text>
            </TouchableOpacity>


            <Text style={styles.dividerText}>or</Text>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => router.push("./AppleGoogle")}
              >
              <MaterialCommunityIcons name="google" size={20} color="#fff" />
              <Text style={styles.socialButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.socialButton}
              onPress={() => router.push("./AppleGoogle")}
              >
              <MaterialCommunityIcons name="apple" size={20} color="#fff" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </AppScreen>
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
    paddingBottom: 60,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
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
  eyeIcon: {
    marginLeft: 10,
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
  dividerText: {
    marginTop: 20,
    marginBottom: 10,
    color: "#999",
    fontSize: 14,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "grey",
    padding: 12,
    borderRadius: 10,
    width: "90%",
    justifyContent: "center",
    marginBottom: 10,
  },
  socialButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  switchTab: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    width: "90%",
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#4A90E2",
  },

  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },

  activeText: {
    color: "#fff",
  },

  subtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  
  benefitsBox: {
    width: "90%",
    backgroundColor: "#F3F8FC",
    borderRadius: 10,
    padding: 12,
    marginTop: 10,
    marginBottom: 20,
  },
  benefitItem: {
    fontSize: 13,
    color: "#333",
    marginBottom: 6,
  },
  
  
});
