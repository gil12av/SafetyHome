import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { fetchAllUsers, updateUserRole, deleteUser, fetchScanHistory } from "@/services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import FooterComponent from "@/components/Footer";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "../styles/globalStyles";


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
  const adminCount = users.filter(u => u.role === "admin").length;
  const userCount = totalUsers - adminCount;

  return (
    
    <SafeAreaView style={{ flex: 1 }}>
        <ScreenWithBackButton title="Admin Dashboard" >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Admin Dashboard</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          <>
            <Text style={styles.sectionHeader}>📊 App Statistics</Text>
            <View style={styles.statsContainer}>
              <StatCard icon="account-group" label="Total Users" value={totalUsers} color="#3498db" />
              <StatCard icon="account" label="Regular Users" value={userCount} color="#2ecc71" />
              <StatCard icon="shield-account" label="Admins" value={adminCount} color="#e67e22" />
              <StatCard icon="radar" label="Scans Performed" value={scanCount} color="#9b59b6" />
            </View>

            <Text style={styles.sectionHeader}>👥 User Management</Text>

            {users.map((u) => (
              <View key={u._id} style={styles.card}>
                <MaterialCommunityIcons name="account-circle" size={40} color="#4A90E2" />
                <View style={styles.infoContainer}>
                  <Text style={styles.name}>{u.firstName} {u.lastName}</Text>
                  <Text style={styles.email}>{u.email}</Text>
                  <Text style={[styles.role, { color: u.role === 'admin' ? '#e67e22' : '#555' }]}>Role: {u.role}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => handleToggleRole(u._id, u.role)} style={styles.actionButton}>
                    <MaterialCommunityIcons name="account-switch" size={24} color="#007BFF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(u._id)} style={styles.actionButton}>
                    <MaterialCommunityIcons name="delete" size={24} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
      </ScreenWithBackButton>
      <FooterComponent />
    </SafeAreaView>
  );
}

const StatCard = ({ icon, label, value, color }: StatCardProps) => (
  <View style={[styles.statCard, { borderColor: color }]}>
    <MaterialCommunityIcons name={icon} size={30} color={color} />
    <Text style={[styles.statValue, { color }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#333" },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginVertical: 10,
    borderBottomWidth: 2,
    borderColor: "#ddd",
    paddingBottom: 5,
  },
  statsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 10 },
  statCard: {
    width: width * 0.42,
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    backgroundColor: "#fff",
    marginBottom: 15,
    elevation: 3,
  },
  statLabel: { fontSize: 14, color: "#555", marginTop: 5 },
  statValue: { fontSize: 22, fontWeight: "bold" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    marginBottom: 15,
    width: width * 0.95,
    elevation: 4,
  },
  infoContainer: { flex: 1, marginLeft: 10 },
  name: { fontSize: 18, fontWeight: "bold" },
  email: { fontSize: 14, color: "#666" },
  role: { fontSize: 14, marginTop: 5 },
  actions: { flexDirection: "row" },
  actionButton: { marginLeft: 10 },
});
