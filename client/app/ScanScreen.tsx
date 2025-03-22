import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
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
};

const getDeviceIcon = (deviceName: string) => {
  const name = deviceName.toLowerCase();
  if (name.includes("router")) return "router-network";
  if (name.includes("light")) return "lightbulb-on-outline";
  if (name.includes("hub")) return "home-automation";
  if (name.includes("sensor")) return "motion-sensor";
  if (name.includes("camera")) return "cctv";
  return "devices";
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
          Animated.timing(pulseAnim, {
            toValue: 1.5,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
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
      <Icon name={getDeviceIcon(item.deviceName)} size={50} color="#4A90E2" />
      <Text style={styles.cardText}>Name: {item.deviceName}</Text>
      <Text style={styles.cardText}>IP: {item.ipAddress}</Text>
      <Text style={styles.cardText}>MAC: {item.macAddress || "N/A"}</Text>
    </View>
  );

  return (
    <LinearGradient colors={["#0f2027", "#203a43", "#2c5364"]} style={styles.container}>
      <ScreenWithBackButton title="Scan" style={{ flex: 1, backgroundColor: "transparent" }}>
        <Text style={styles.title}>Network Scan</Text>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
            <LottieView
              source={require("../assets/animations/scan.json")}
              autoPlay
              loop
              style={styles.radar}
            />
            <Text style={styles.loadingText}>Scanning the network...</Text>
            <Progress.Bar
              progress={progress}
              width={width * 0.8}
              color="#FF6F61"
              borderWidth={0}
              height={12}
              unfilledColor="#ffffff33"
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

        {!loading && (
          <TouchableOpacity onPress={handleScan} style={styles.scanButton}>
            <LinearGradient
              colors={["#00c6ff", "#0072ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.scanButtonGradient}
            >
              <Icon name="radar" size={28} color="#fff" />
              <Text style={styles.scanButtonText}>Start Scan</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScreenWithBackButton>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
  },
  loadingContainer: {
    marginVertical: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseCircle: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    position: "absolute",
  },
  radar: {
    width: 220,
    height: 220,
  },
  loadingText: {
    fontSize: 16,
    color: "#ffffffcc",
    marginTop: 240,
  },
  progressBar: {
    marginTop: 20,
    alignSelf: "center",
  },
  noDeviceText: {
    fontSize: 16,
    color: "#ffffffcc",
    marginVertical: 20,
    textAlign: "center",
  },
  scanButton: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButtonGradient: {
    width: "70%",
    paddingVertical: 14,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    elevation: 6,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
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
