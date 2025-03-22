import React from "react";
import { Alert } from "react-native";
import { triggerScan } from "../services/api";

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
};

type ScanProps = {
  onScanComplete: (devices: Device[]) => void;
  onProgressUpdate: (progress: number) => void;
  onLoadingChange: (loading: boolean) => void;
};

export default function Scan({ onScanComplete, onProgressUpdate, onLoadingChange }: ScanProps) {
  const handleScan = async () => {
    onLoadingChange(true);
    onProgressUpdate(0);

    let progress = 0;

    const progressInterval = setInterval(() => {
      if (progress < 0.9) {
        progress += 0.1;
        onProgressUpdate(progress);
      } else {
        clearInterval(progressInterval);
      }
    }, 1000);

    try {
      const data = await triggerScan(); // 🆕 ללא userId
      clearInterval(progressInterval);
      onProgressUpdate(1);
      onScanComplete(data.devices || []);
    } catch (err) {
      console.error("❌ Error during scan request:", err);
      Alert.alert("Error", "Failed to perform the scan.");
    } finally {
      onLoadingChange(false);
      clearInterval(progressInterval);
    }
  };

  return { handleScan };
}
