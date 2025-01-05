import React, { useContext, useState } from "react";
import { Alert } from "react-native";
import * as Progress from 'react-native-progress';
import { triggerScan } from "../services/api";
import { AuthContext } from "@/context/AuthContext";

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
};

export default function Scan({ onScanComplete }: { onScanComplete: (devices: Device[]) => void }) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [scanResults, setScanResults] = useState<Device[]>([]);
  const authContext = useContext(AuthContext);
  const userId = authContext?.user?._id;

  const handleScan = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please login again.");
      return;
    }
    setLoading(true);
    setProgress(0);
    try {
      let progressInterval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress < 0.9) return oldProgress + 0.1;
          clearInterval(progressInterval);
          return oldProgress;
        });
      }, 1000);

      const data = await triggerScan(userId);
      clearInterval(progressInterval);
      setProgress(1);
      setScanResults(data.devices || []);
      onScanComplete(data.devices || []);
    } catch (err) {
      console.error("Error during scan request:", err);
      Alert.alert("Error", "Failed to perform the scan.");
    } finally {
      setLoading(false);
    }
  };

  return { handleScan, loading, progress, scanResults };
}
