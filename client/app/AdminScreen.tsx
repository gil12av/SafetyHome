import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import {
  fetchAllUsers,
  updateUserRole,
  deleteUser,
  fetchScanHistory,
} from "@/services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterComponent from "@/components/Footer";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "../styles/globalStyles";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";

const { width } = Dimensions.get("window");

interface UserType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "user";
}

interface StatCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  value: number;
  color: string;
}

export default function AdminScreen() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [scanCount, setScanCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    try {
      const userData = await fetchAllUsers();
      const scanData = await fetchScanHistory();
      setUsers(userData);
      setScanCount(scanData.length);
    } catch (err) {
      Alert.alert("Error", "Failed to load stats.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleDelete = async (userId: string) => {
    Alert.alert("Confirm", "Delete user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: async () => {
          try {
            await deleteUser(userId);
            loadStats();
          } catch {
            Alert.alert("Error", "Delete failed.");
          }
        },
        style: "destructive",
      },
    ]);
  };

  const handleToggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateUserRole(userId, newRole);
      loadStats();
    } catch {
      Alert.alert("Error", "Role update failed.");
    }
  };

  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === "admin").length;
  const userCount = totalUsers - adminCount;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenWithBackButton title="Admin Dashboard">
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <ThemedText type="title">Admin Dashboard</ThemedText>

          {loading ? (
            <ActivityIndicator size="large" color="#007BFF" />
          ) : (
            <>
              <ThemedText type="subtitle">📊 App Statistics</ThemedText>
              <ThemedView style={styles.statsContainer}>
                <StatCard
                  icon="account-group"
                  label="Total Users"
                  value={totalUsers}
                  color="#3498db"
                />
                <StatCard
                  icon="account"
                  label="Regular Users"
                  value={userCount}
                  color="#2ecc71"
                />
                <StatCard
                  icon="shield-account"
                  label="Admins"
                  value={adminCount}
                  color="#e67e22"
                />
                <StatCard
                  icon="radar"
                  label="Scans Performed"
                  value={scanCount}
                  color="#9b59b6"
                />
              </ThemedView>

              <ThemedText type="subtitle">👥 User Management</ThemedText>

              <ThemedView style={styles.userList}>
                {users.map((u) => (
                  <ThemedView key={u._id} style={styles.card}>
                    <MaterialCommunityIcons
                      name="account-circle"
                      size={40}
                      color="#4A90E2"
                    />
                    <ThemedView style={styles.infoContainer}>
                      <ThemedText type="default">
                        {u.firstName} {u.lastName}
                      </ThemedText>
                      <ThemedText type="default">{u.email}</ThemedText>
                      <ThemedText
                        type="default"
                        style={{ color: u.role === "admin" ? "#e67e22" : "#555" }}
                      >
                        Role: {u.role}
                      </ThemedText>
                    </ThemedView>
                    <ThemedView style={styles.actions}>
                      <TouchableOpacity
                        onPress={() => handleToggleRole(u._id, u.role)}
                        style={styles.actionButton}
                      >
                        <MaterialCommunityIcons
                          name="account-switch"
                          size={24}
                          color="#007BFF"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDelete(u._id)}
                        style={styles.actionButton}
                      >
                        <MaterialCommunityIcons
                          name="delete"
                          size={24}
                          color="#e74c3c"
                        />
                      </TouchableOpacity>
                    </ThemedView>
                  </ThemedView>
                ))}
              </ThemedView>
            </>
          )}
        </ScrollView>
      </ScreenWithBackButton>
      <FooterComponent />
    </SafeAreaView>
  );
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <ThemedView style={[styles.statCard, { borderColor: color }]}>
    <MaterialCommunityIcons name={icon} size={30} color={color} />
    <ThemedText type="title" style={{ color }}>
      {value}
    </ThemedText>
    <ThemedText type="default">{label}</ThemedText>
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  statCard: {
    width: width * 0.42,
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    backgroundColor: "white",
    marginBottom: 15,
    elevation: 3,
  },
  userList: {
    width: "100%",
    gap: 10,
    marginTop: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    elevation: 4,
    width: "100%",
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
    gap: 3,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
});
