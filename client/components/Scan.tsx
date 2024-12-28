import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from "react-native";
import { scanNetwork } from "../services/api";

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
};

export default function Scan() {
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState<Device[]>([]);
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

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Scanning... Please wait</Text>
      ) : scanResults.length > 0 ? (
        <FlatList
          data={scanResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text>{item.deviceName || "Unknown Device"}</Text>
          )}
        />
      ) : (
        <Text>No devices found. Start a scan.</Text>
      )}
      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Text style={styles.scanButtonText}>Start Scan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      fontSize: 18,
      color: "#0288d1",
    },
    scanButton: {
      backgroundColor: "blue",
      padding: 15,
      borderRadius: 8,
      marginTop: 20,
    },
    scanButtonText: {
      color: "#fff",
    },
  });
