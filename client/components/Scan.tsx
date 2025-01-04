import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, Dimensions } from "react-native";
import { scanNetwork } from "../services/api";
import Icon from "react-native-vector-icons/MaterialIcons";
import { AuthContext } from "@/context/AuthContext";

const { width } = Dimensions.get("window");

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
};

export default function Scan() {
    const [loading, setLoading] = useState(false);
    const [scanResults, setScanResults] = useState<Device[]>([]);
    const [error, setError] = useState(false);
    const authContext = useContext(AuthContext);  // קבלת userId מהקונטקסט
    const userId = authContext?.user?._id;  // שימוש במזהה המשתמש
  
    const handleScan = async () => {
      if (!userId) {
        Alert.alert("Error", "User ID not found. Please login again.");
        return;
      }
      setLoading(true);
      setError(false);
      try {
        const data = await scanNetwork(userId);  // העברת userId
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
              <Text style={styles.deviceText}>{item.deviceName || "Unknown Device"}</Text>
            )}
          />
        ) : (
          <Text style={styles.noDeviceText}>No devices found. Start a scan.</Text>
        )}
  
        <TouchableOpacity style={styles.scanButton} onPress={handleScan}>
          <Icon name="radar" size={50} color="#fff" />
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  loadingText: {
    fontSize: 20,
    color: "#FF6F61",
    marginBottom: 20,
  },
  deviceText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginVertical: 10,
  },
  noDeviceText: {
    fontSize: 16,
    color: "#999999",
    marginVertical: 20,
  },
  scanButton: {
    position: "absolute",
    bottom: 0,
    width: width * 0.8,
    height: 100,
    backgroundColor: "#FF3B30",
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  scanButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});
