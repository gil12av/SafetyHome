import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterComponent from "@/components/Footer";
import globalStyles from "@/styles/globalStyles";

const { width } = Dimensions.get("window");

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
      <SafeAreaView style={globalStyles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={globalStyles.fullScreen}>
      <LinearGradient
        colors={["#ffffff", "#f0f4f8"]}
        style={globalStyles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.greeting}>Welcome, {firstName}</Text>

          <View style={styles.cardGrid}>
            <DashboardCard
              icon="security"
              title="Network Scan"
              color="#6DD5FA"
              onPress={() => router.push("/ScanScreen")}
            />
            <DashboardCard
              icon="alert-octagon"
              title="Security Alerts"
              color="#FF512F"
              onPress={() => router.push("/AlertsScreen")}
            />
            <DashboardCard
              icon="router-network"
              title="Connected Devices"
              color="#4CAF50"
              onPress={() => router.push("/DevicesScreen")}
            />
            <DashboardCard
              icon="account-cog"
              title="User Profile"
              color="#8E2DE2"
              onPress={() => router.push("/Profile")}
            />
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

interface DashboardCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  color: string;
  onPress: () => void;
}

const DashboardCard = ({ icon, title, color, onPress }: DashboardCardProps) => (
  <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={40} color={color} />
    <Text style={[styles.cardTitle, { color }]}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 2,
    padding: 25,
    marginBottom: 20,
    width: width * 0.42,
    alignItems: "center",
    elevation: 5,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#e74c3c",
    padding: 15,
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Dashboard;
