import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import { API_URL } from "../services/api";

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
  scanDate?: string;
};

export default function DevicesScreen() {
  const [scanHistory, setScanHistory] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScanHistory = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        const token = user ? JSON.parse(user).token : null;

        if (!token) {
          console.error("No token found in storage.");
          return;
        }

        const response = await axios.get(`${API_URL}/scans`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setScanHistory(response.data);
      } catch (error) {
        console.error("Failed to fetch scan history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanHistory();
  }, []);

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Name: {item.deviceName}</Text>
      <Text style={styles.cardText}>IP: {item.ipAddress}</Text>
      <Text style={styles.cardText}>MAC: {item.macAddress || "N/A"}</Text>
      <Text style={styles.cardText}>Scanned At: {item.scanDate ? new Date(item.scanDate).toLocaleString() : "N/A"}</Text>
    </View>
  );

  return (
    <ScreenWithBackButton title="Devices">
      <View style={styles.container}>
        <Text style={styles.title}>Connected Devices</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : scanHistory.length > 0 ? (
          <FlatList
            data={scanHistory}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderDevice}
          />
        ) : (
          <Text>No devices found in history.</Text>
        )}
      </View>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f0f4f7",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 20,
    marginVertical: 10,
    width: "90%",
    alignItems: "center",
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
});