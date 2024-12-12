import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Alert } from "react-native";

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState([]);

  const handleScan = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5001/api/scan-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "USER_ID" }),
      });
      if (!response.ok) throw new Error("Failed to fetch scan results");
      const data = await response.json();
      setScanResults(data.scanResults);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <Text>📱 {item.deviceName || "Unknown Device"}</Text>
      <Text>IP: {item.ipAddress}</Text>
      <Text>MAC: {item.macAddress}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Your Network</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" />
      ) : scanResults.length > 0 ? (
        <FlatList
          data={scanResults}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Button title="Start Scan" onPress={handleScan} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  deviceItem: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
});