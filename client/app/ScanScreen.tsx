import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import * as Progress from "react-native-progress";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import Scan from "../components/Scan";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

const { width } = Dimensions.get("window");

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
  scanDate?: string;
  operatingSystem?: string;
  openPorts?: { port: number; service: string; product: string; version: string }[];
};

export default function ScanScreen() {
  const [scanResults, setScanResults] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.5, duration: 1200, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  const handleScanComplete = (devices: Device[]) => {
    setScanResults(devices);
    setLoading(false);
    setProgress(0);
  };

  const handleProgressUpdate = (newProgress: number) => {
    setProgress(newProgress);
  };

  const handleLoadingChange = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const { handleScan } = Scan({
    onScanComplete: handleScanComplete,
    onProgressUpdate: handleProgressUpdate,
    onLoadingChange: handleLoadingChange,
  });

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.card}>
      <Text style={styles.cardText}>Name: {item.deviceName}</Text>
      <Text style={styles.cardText}>IP: {item.ipAddress}</Text>
      <Text style={styles.cardText}>MAC: {item.macAddress || "N/A"}</Text>
      {item.operatingSystem && <Text style={styles.cardText}>OS: {item.operatingSystem}</Text>}
      {item.openPorts && item.openPorts.length > 0 && (
        <Text style={styles.cardText}>Open Ports: {item.openPorts.length}</Text>
      )}
    </View>
  );

  const showScanInfo = () => {
    Alert.alert(
      "Information",
      "Quick Scan: Fast but limited to identifying basic device information.\n\n" +
      "Deep Scan: Takes longer but provides detailed information about the devices, including OS and open ports.",
      [{ text: "OK" }]
    );
  };

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <ScreenWithBackButton title="Scan" style={{ flex: 1, backgroundColor: "transparent" }}>
        <Text style={styles.title}>Network Scan</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require("../assets/animations/scan.json")}
              autoPlay
              loop
              style={styles.radar}
            />
            <Progress.Bar progress={progress} width={width * 0.8} color="#FF6F61" />
          </View>
        ) : (
          <>
            <TouchableOpacity onPress={showScanInfo} style={styles.infoButton}>
              <Icon name="information-outline" size={28} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleScan(false)} style={styles.scanButton}>
              <Text style={styles.scanButtonText}>Quick Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleScan(true)} style={styles.scanButtonDeep}>
              <Text style={styles.scanButtonText}>Deep Scan</Text>
            </TouchableOpacity>
          </>
        )}

        <FlatList data={scanResults} keyExtractor={(item, index) => index.toString()} renderItem={renderDevice} />
      </ScreenWithBackButton>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 30, fontWeight: "bold", color: "#fff", textAlign: "center", marginTop: 20 },
  loadingContainer: { marginVertical: 30, alignItems: "center", justifyContent: "center" },
  infoButton: { position: "absolute", top: 20, right: 20 },
  scanButton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 10, margin: 10, alignItems: "center" },
  scanButtonDeep: { backgroundColor: "#FF5722", padding: 15, borderRadius: 10, margin: 10, alignItems: "center" },
  scanButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 10, marginVertical: 5, width: width * 0.9 },
  cardText: { fontSize: 16, color: "#333" },
  radar: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginVertical: 20,
  }
});
