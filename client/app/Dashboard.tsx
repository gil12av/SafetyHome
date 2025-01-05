import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import FooterComponent from "@/components/Footer";

// טיפוס לאייקון מתוך MaterialCommunityIcons
import { ComponentProps } from "react";
type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export default function Dashboard() {
  const router = useRouter();
  const authContext = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const firstName = authContext?.user?.firstName || "Guest";

  useEffect(() => {
    if (authContext?.user) {
      setIsLoading(false);
    } else {
      router.replace("/UserForm");
    }
  }, [authContext?.user]);

  const handleLogout = () => {
    Alert.alert("Logged Out", "You have successfully logged out.");
    authContext?.logout();
    router.push("/UserForm");
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScreenWithBackButton title="Dashboard">
      <LinearGradient
        colors={["#4facfe", "#00f2fe"]}
        style={styles.gradientContainer}
      >
        <View style={styles.container}>
          <Text style={styles.greeting}>
            {firstName ? `Welcome, ${firstName}` : "Welcome, Guest"}
          </Text>

          <View style={styles.sectionContainer}>
            <DashboardSection
              icon="shield-check"
              title="Security Status"
              color="#007BFF"
              onPress={() => router.push("/ScanScreen")}
            />
            <DashboardSection
              icon="bell-alert"
              title="Alerts"
              color="#f39c12"
              onPress={() => router.push("/AlertsScreen")}
            />
            <DashboardSection
              icon="devices"
              title="Connected Devices"
              color="#27ae60"
              onPress={() => router.push("/DevicesScreen")}
            />
            <DashboardSection
              icon="account-circle"
              title="Profile"
              color="#9b59b6"
              onPress={() => router.push("/Profile")}
            />
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
        <FooterComponent />
      </LinearGradient>
    </ScreenWithBackButton>
  );
}

// טיפוס מוגדר לפרופס בקומפוננטה
interface DashboardSectionProps {
  icon: IconName;
  title: string;
  color: string;
  onPress: () => void;
}

const DashboardSection = ({ icon, title, color, onPress }: DashboardSectionProps) => (
  <TouchableOpacity style={styles.section} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={70} color={color} />
    <Text style={styles.sectionTitle}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
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
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#fff",
    textAlign: "center",
  },
  sectionContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 20,
    color: "#333",
  },
  logoutButton: {
    marginTop: 40,
    padding: 15,
    backgroundColor: "#e74c3c",
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});
