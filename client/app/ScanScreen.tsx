import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import LottieView from "lottie-react-native";
import ScreenWithBackButton from "../components/ScreenWithBackButton";

export default function ScanScreen() {
  const [loading, setLoading] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [error, setError] = useState(false);

  const handleScan = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch("http://localhost:5001/api/scan-network", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "USER_ID" }),
      });

      if (!response.ok) throw new Error("Error in API call");

      const data = await response.json();

      if (data.scanResults && data.scanResults.length > 0) {
        setScanResults(data.scanResults);
      } else {
        setScanResults([]);
        Alert.alert("No Devices Found", "The scan did not detect any devices.");
      }
    } catch (err) {
      setError(true);
      Alert.alert("Error", "There was an issue initiating the scan. This issue is under review.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.deviceItem}>
      <Text style={styles.deviceName}>📱 {item.deviceName || "Unknown Device"}</Text>
      <Text style={styles.deviceDetails}>IP: {item.ipAddress || "N/A"}</Text>
      <Text style={styles.deviceDetails}>MAC: {item.macAddress || "N/A"}</Text>
    </View>
  );

  return (
    <ScreenWithBackButton title="Scan Network">
      <View style={styles.container}>
        {/* כותרת */}
        <Text style={styles.title}>Scan Your Network</Text>

        {/* חיווי טעינה */}
        {loading && (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require("../assets/animations/scanning.json")}
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.loadingText}>Scanning... Please wait</Text>
          </View>
        )}

        {/* תוצאות סריקה */}
        {!loading && scanResults.length > 0 && (
          <FlatList
            data={scanResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.resultsContainer}
          />
        )}

        {/* הודעת fallback */}
        {!loading && scanResults.length === 0 && (
          <View style={styles.fallbackContainer}>
            {error ? (
              <Text style={styles.fallbackText}>
                There was an error initiating the scan. This issue is under review.
              </Text>
            ) : (
              <Text style={styles.fallbackText}>No devices found. Try scanning again.</Text>
            )}
          </View>
        )}

        {/* כפתור סריקה */}
        {!loading && (
          <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
            <Text style={styles.scanButtonText}>Start Scan</Text>
          </TouchableOpacity>
        )}
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
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  animation: {
    width: 150,
    height: 150,
  },
  loadingText: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
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
  fallbackContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  fallbackText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
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
