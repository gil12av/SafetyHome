import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
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
          <Text style={styles.greeting}>
            Welcome, {firstName}
          </Text>

          <View style={styles.sectionContainer}>
            <AnimatedTouchable onPress={() => router.push("/ScanScreen")}>
              <DashboardSection
                icon="security"
                title="Network Scan"
                color="#6DD5FA"
              />
            </AnimatedTouchable>

            <AnimatedTouchable onPress={() => router.push("/AlertsScreen")}>
              <DashboardSection
                icon="alert-octagon"
                title="Security Alerts"
                color="#FF512F"
              />
            </AnimatedTouchable>

            <AnimatedTouchable onPress={() => router.push("/DevicesScreen")}>
              <DashboardSection
                icon="router-network"
                title="Connected Devices"
                color="#4CAF50"
              />
            </AnimatedTouchable>

            <AnimatedTouchable onPress={() => router.push("/Profile")}>
              <DashboardSection
                icon="account-cog"
                title="User Profile"
                color="#8E2DE2"
              />
            </AnimatedTouchable>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
        <FooterComponent />
      </LinearGradient>
    </SafeAreaView>
  );
}

// אנימציה ללחיצה על כרטיסיה
const AnimatedTouchable = ({ children, onPress }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => onPress());
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut}>
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

// טיפוסים של כרטיסיות
interface DashboardSectionProps {
  icon: IconName;
  title: string;
  color: string;
}

const DashboardSection = ({ icon, title, color }: DashboardSectionProps) => (
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
