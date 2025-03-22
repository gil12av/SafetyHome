import React, { useState, useEffect } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import axios from "axios";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import { API_URL } from "../services/api";
import globalStyles from "@/styles/globalStyles";

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
        const response = await axios.get(`${API_URL}/scans`, {
          withCredentials: true,
        });
        setScanHistory(response.data);
      } catch (error) {
        console.error("❌ Failed to fetch scan history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScanHistory();
  }, []);

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={globalStyles.card}>
      <Text style={globalStyles.cardText}>Name: {item.deviceName}</Text>
      <Text style={globalStyles.cardText}>IP: {item.ipAddress}</Text>
      <Text style={globalStyles.cardText}>MAC: {item.macAddress || "N/A"}</Text>
      <Text style={globalStyles.cardText}>
        Scanned At: {item.scanDate ? new Date(item.scanDate).toLocaleString() : "N/A"}
      </Text>
    </View>
  );

  return (
    <ScreenWithBackButton title="Devices" style={globalStyles.screenContainer}>
      <Text style={globalStyles.title}>Connected Devices</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" />
      ) : scanHistory.length > 0 ? (
        <FlatList
          data={scanHistory}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderDevice}
        />
      ) : (
        <Text style={globalStyles.centeredText}>No devices found in history.</Text>
      )}
    </ScreenWithBackButton>
  );
}
