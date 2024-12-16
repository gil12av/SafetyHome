import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { scanNetwork } from "../services/api";
import ScreenWithBackButton from "../components/ScreenWithBackButton";

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [error, setError] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setError(false);

    try {
      const data = await scanNetwork();
      setScanResults(data.devices || []);
    } catch (err) {
      console.error("Error during scan request:", err);
      setError(true);
      Alert.alert("Error", "Failed to perform the scan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  type Device = {
    deviceName: string;
    ipAddress: string;
    macAddress: string;
  };

  const renderItem = ({ item }: { item: Device }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>📱 {item.deviceName || "Unknown Device"}</Text>
      <Text style={styles.deviceDetails}>IP: {item.ipAddress || "N/A"}</Text>
      <Text style={styles.deviceDetails}>MAC: {item.macAddress || "N/A"}</Text>
    </View>
  );

  return (
    <ScreenWithBackButton title="Scan">
      <View style={styles.container}>
        <Text style={styles.title}>Scan Your Network</Text>

        {loading ? (
          <Text style={styles.loadingText}>🔄 Scanning... Please wait</Text>
        ) : scanResults.length > 0 ? (
          <FlatList
            data={scanResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.resultsContainer}
          />
        ) : (
          <Text style={styles.noResultsText}>
            {error ? "❌ An error occurred. Please try again." : "ℹ️ No devices found. Start a scan."}
          </Text>
        )}

        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Text style={styles.scanButtonText}>🚀 Start Scan</Text>
        </TouchableOpacity>
      </View>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#1e88e5",
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 18,
    color: "#0288d1",
  },
  noResultsText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
    marginVertical: 20,
  },
  resultsContainer: {
    width: "100%",
  },
  deviceItem: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#bbdefb",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e88e5",
  },
  deviceDetails: {
    fontSize: 14,
    color: "#757575",
  },
  scanButton: {
    backgroundColor: "red",
    width: 200,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
    marginVertical: 20,
  },
  scanButtonText: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#ffffff",
  },
});
