import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from "react-native";
import * as Progress from 'react-native-progress';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Scan from "../components/Scan";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

const { width } = Dimensions.get("window");

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
  scanDate?: string;
};

const getDeviceIcon = (deviceName: string) => {
  if (deviceName.toLowerCase().includes("router")) return "router-network";
  if (deviceName.toLowerCase().includes("light")) return "lightbulb-on-outline";
  if (deviceName.toLowerCase().includes("hub")) return "home-automation";
  if (deviceName.toLowerCase().includes("sensor")) return "motion-sensor";
  if (deviceName.toLowerCase().includes("camera")) return "cctv";
  return "devices";
};

export default function ScanScreen() {
  const [scanResults, setScanResults] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleScanComplete = (devices: Device[]) => {
    setScanResults(devices);
  };

  const { handleScan } = Scan({ onScanComplete: handleScanComplete });

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.card}>
      <Icon name={getDeviceIcon(item.deviceName)} size={50} color="#4A90E2" />
      <Text style={styles.cardText}>Name: {item.deviceName}</Text>
      <Text style={styles.cardText}>IP: {item.ipAddress}</Text>
      <Text style={styles.cardText}>MAC: {item.macAddress || "N/A"}</Text>
    </View>
  );

  return (
    <ScreenWithBackButton title="Scan">
      <View style={styles.container}>
        <Text style={styles.title}>Network Scan</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingText}>Scanning... Please wait</Text>
            <Progress.Bar
              progress={progress}
              width={width * 0.8}
              color="#4A90E2"
              borderWidth={0}
              height={12}
              style={styles.progressBar}
            />
          </View>
        ) : scanResults.length > 0 ? (
          <FlatList
            data={scanResults}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderDevice}
          />
        ) : (
          <Text style={styles.noDeviceText}>No devices found. Start a scan.</Text>
        )}

        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Icon name="radar" size={50} color="#fff" />
          <Text style={styles.scanButtonText}>
            {loading ? "Scanning..." : "Start Scan"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 20,
  },
  loadingContainer: {
    marginVertical: 30,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#4A90E2",
    marginTop: 10,
  },
  progressBar: {
    marginTop: 20,
    alignSelf: "center",
  },
  noDeviceText: {
    fontSize: 16,
    color: "#777777",
    marginVertical: 20,
    textAlign: "center",
  },
  scanButton: {
    marginTop: 30,
    width: width * 0.8,
    height: 90,
    backgroundColor: "#4A90E2",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    width: width * 0.9,
    alignItems: "center",
    elevation: 5,
  },
  cardText: {
    fontSize: 16,
    color: "#333333",
  },
});
