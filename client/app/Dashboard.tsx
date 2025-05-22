import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors, spacing } from "@/styles/theme";
import AppScreen from "@/components/AppScreen";
import CyberFeedWidget from "@/components/ui/CyberFeedWidget";
import { useAuth } from "@/context/AuthContext";
import CommunityFeed from "../components/ui/social/CommunityFeed";
import NotificationBell from "@/components/ui/social/NotificationBell";



const { width } = Dimensions.get("window");

export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const firstName = user?.firstName || "User";
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    const timer = setTimeout(() => setShowSurvey(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMenu = () => {
    Animated.timing(slideAnim, {
      toValue: menuOpen ? -width * 0.7 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setMenuOpen(!menuOpen);
  };

  const navigate = (route: any) => {
    toggleMenu();
    router.push(route);
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/UserForm");
  };

  return (
    <AppScreen
    title="Dashboard"
    leftIcon={
      <TouchableOpacity onPress={toggleMenu}>
        <MaterialCommunityIcons name="menu" size={24} color={colors.textLight} />
      </TouchableOpacity>
    }
    rightIcon={<NotificationBell />}
    >
      {/* Drawer menu */}
      <Animated.View style={[styles.drawer, { left: slideAnim }]}>
  <View>
    <Text style={styles.drawerTitle}>Menu</Text>
    {[
      { icon: "radar", label: "Scan Devices", route: "/ScanScreen" },
      { icon: "alert", label: "Alerts", route: "/AlertsScreen" },
      { icon: "devices", label: "Devices", route: "/DevicesScreen" },
      { icon: "bell", label: "Notifications", route: "/NotificationsScreen" },
      { icon: "chat", label: "chat", route: "/NewMessageScreen" },
      { icon: "wechat", label: "Bot", route: "/TalkWithBot" },
      { icon: "account", label: "Profile", route: "/Profile" },
      ...(isAdmin ? [{ icon: "shield-account", label: "Admin", route: "/AdminScreen" }] : []),
    ].map((item, index) => (
      <TouchableOpacity
        key={item.label}
        onPress={() => navigate(item.route)}
        style={[
          styles.drawerItem,
          {
            backgroundColor: index % 2 === 0 ? "#1f2a40" : "#23304e",
            borderColor: index % 2 === 0 ? "#4A90E2" : "#00bcd4",
          },
        ]}
      >
        <MaterialCommunityIcons
          name={item.icon as any}
          size={22}
          color={colors.primary}
          style={{ marginRight: 12 }}
        />
        <Text style={styles.drawerItemText}>{item.label}</Text>
      </TouchableOpacity>
    ))}
  </View>

  <View style={styles.logoutSection}>
    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
      <MaterialCommunityIcons name="logout" size={22} color="#e74c3c" style={{ marginRight: 10 }} />
      <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  </View>
</Animated.View>
  
<FlatList
  data={[]}
  renderItem={null}
  keyExtractor={() => "static"}
  contentContainerStyle={styles.content}
  ListHeaderComponent={
    <>
      <View style={styles.greetingBox}>
        <Text style={styles.greeting}>Welcome, {firstName}!</Text>
      </View>

      {showSurvey && (
        <View style={styles.surveyBanner}>
          <Text style={styles.surveyText}>Want better security tips?</Text>
          <View style={styles.surveyButtons}>
            <TouchableOpacity style={styles.surveyYes} onPress={() => router.push("/SurveyScreen")}>
              <Text style={styles.surveyBtnText}>Take Survey</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.surveyNo} onPress={() => setShowSurvey(false)}>
              <Text style={styles.surveyBtnText}>Not now</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <CyberFeedWidget />
      <CommunityFeed />
    </>
  }
/>
    </AppScreen>
  );  
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 100,
  },

  greetingBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  greeting: {
    fontSize: 26,
    fontWeight: "600",
    color: colors.header,
  },

  menuIcon: {
    position: "absolute",
    top: 16,
    left: 16,
    zIndex: 10,
  },

  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: width * 0.7,
    backgroundColor: colors.menuBackground,
    paddingTop: 80,
    paddingHorizontal: 20,
    zIndex: 15,
    justifyContent: "space-between", // מיקומים עליונים + תחתונים
  },

  drawerContent: {
    // אזור כפתורים רגילים
  },

  drawerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textLight,
    marginBottom: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 2,
  },

  drawerItemText: {
    color: colors.textLight,
    fontSize: 17,
    fontWeight: "500",
  },

  logoutSection: {
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderColor: "#444", 
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#fff0f0",
  },
  logoutText: {
    color: "#e74c3c",
    fontWeight: "700",
    fontSize: 16,
  },
  
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 5,
  },

  surveyBanner: {
    backgroundColor: "#e7f7ec",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  surveyText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    color: colors.text,
  },

  surveyButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  surveyYes: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
  },

  surveyNo: {
    backgroundColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },

  surveyBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});
