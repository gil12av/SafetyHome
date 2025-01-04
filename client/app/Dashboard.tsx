import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { FadeIn } from "react-native-reanimated";
import AuthWrapper from "../components/AuthWrapper";
import { AuthContext } from "../context/AuthContext";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import FooterComponent from "@/components/Footer";

export default function Dashboard() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const firstName = authContext?.user?.firstName;

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have successfully logged out.");
    authContext?.logout();
    router.push("/UserForm");
  };

  return (
    <ScreenWithBackButton>
      <AuthWrapper>
        <Animated.View style={styles.container} entering={FadeIn.duration(800)}>
          <Text style={styles.greeting}>
            {firstName ? `Welcome, ${firstName}` : "Welcome, Guest"}
          </Text>

          <View style={styles.cardContainer}>
            <View style={styles.cardRow}>
              <View style={styles.card}>
                <Icon name="security" size={50} color="#4CAF50" />
                <Text style={styles.cardTitle}>Security Status</Text>
                <Text style={styles.cardDescription}>
                  Check your home's security
                </Text>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => router.push("/ScanScreen")}
                >
                  <Text style={styles.buttonText}>Scan Now</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Icon name="notifications" size={50} color="#FFC107" />
                <Text style={styles.cardTitle}>Alerts</Text>
                <Text style={styles.cardDescription}>
                  View recent alerts
                </Text>
                <TouchableOpacity style={styles.cardButton}>
                  <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.cardRow}>
              <View style={styles.card}>
                <Icon name="devices" size={50} color="#2196F3" />
                <Text style={styles.cardTitle}>Connected Devices</Text>
                <Text style={styles.cardDescription}>
                  Manage your devices
                </Text>
                <TouchableOpacity style={styles.cardButton}>
                  <Text style={styles.buttonText}>Manage</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <Icon name="account-circle" size={50} color="#9C27B0" />
                <Text style={styles.cardTitle}>Profile</Text>
                <Text style={styles.cardDescription}>View your profile</Text>
                <TouchableOpacity
                  style={styles.cardButton}
                  onPress={() => router.push("/Profile")}
                >
                  <Text style={styles.buttonText}>Go to Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <FooterComponent />

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </Animated.View>
      </AuthWrapper>
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
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  cardContainer: {
    width: "100%",
    alignItems: "center",
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    width: "45%",
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
    textAlign: "center",
  },
  cardButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#dc3545",
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
