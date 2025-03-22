import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Animated, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterComponent from "@/components/Footer";


const Dashboard = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const firstName = user?.firstName || "Guest";

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    } else {
      router.replace("/UserForm");
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    Alert.alert("Logged Out", "You have successfully logged out.");
    router.push("/UserForm");
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LinearGradient
        colors={["#ffffff", "#f0f4f8"]}
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.greeting}>Welcome, {firstName}</Text>

          <View style={styles.sectionContainer}>
            <TouchableOpacity onPress={() => router.push("/ScanScreen")}>
              <DashboardSection icon="security" title="Network Scan" color="#6DD5FA" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/AlertsScreen")}>
              <DashboardSection icon="alert-octagon" title="Security Alerts" color="#FF512F" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/DevicesScreen")}>
              <DashboardSection icon="router-network" title="Connected Devices" color="#4CAF50" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/Profile")}>
              <DashboardSection icon="account-cog" title="User Profile" color="#8E2DE2" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
        <FooterComponent />
      </LinearGradient>
    </SafeAreaView>
  );
};

interface DashboardSectionProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  color: string;
}

const DashboardSection: React.FC<DashboardSectionProps> = ({ icon, title, color }) => (
  <View style={[styles.section, { borderColor: color }]}>
    <MaterialCommunityIcons name={icon} size={65} color={color} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  greeting: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40,
  },
  sectionContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    marginVertical: 15,
    borderWidth: 1.5,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#333",
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Dashboard;
