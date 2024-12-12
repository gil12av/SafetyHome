import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import axios from "axios";
import ScreenWithBackButton from "../components/ScreenWithBackButton";

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [error, setError] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setError(false);
  
    console.log("Initiating scan request..."); // דיבאג: תחילת הבקשה
  
    try {
      const response = await axios.post("http://localhost:5001/api/scan-network", {
        userId: "USER_ID", // מזהה המשתמש
      });
  
      console.log("Scan response received:", response.data); // דיבאג: תגובת השרת
      setScanResults(response.data.devices);
    } catch (err) {
      console.error("Error during scan request:", err); // דיבאג: שגיאה במהלך הבקשה
      setError(true);
      Alert.alert("Error", "Failed to perform the scan. Please try again.");
    } finally {
      setLoading(false);
      console.log("Scan request finished."); // דיבאג: סיום הבקשה
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
        <Text style={styles.loadingText}>Scanning... Please wait</Text>
      ) : scanResults.length > 0 ? (
        <FlatList
          data={scanResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.resultsContainer}
        />
      ) : (
        <Text style={styles.noResultsText}>
          {error ? "An error occurred. Please try again." : "No devices found. Start a scan."}
        </Text>
      )}

      <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
        <Text style={styles.scanButtonText}>Start Scan</Text>
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
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
  },
  noResultsText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  resultsContainer: {
    width: "100%",
  },
  deviceItem: {
    padding: 15,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 3,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  deviceDetails: {
    fontSize: 14,
    color: "#666",
  },
  scanButton: {
    backgroundColor: "#FF4C4C",
    width: 120,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    position: "absolute",
    bottom: 20,
  },
  scanButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
