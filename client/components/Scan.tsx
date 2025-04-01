import React from "react";
import { Alert } from "react-native";
import { triggerScan, triggerDeepScan } from "../services/api";

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
  operatingSystem?: string;   // 🆕 For deep Scan
  openPorts?: {               // 🆕 For deep Scan
    port: number;
    service: string;
    product: string;
    version: string;
  }[];
};

type ScanProps = {
  onScanComplete: (devices: Device[]) => void;
  onProgressUpdate: (progress: number) => void;
  onLoadingChange: (loading: boolean) => void;
};

export default function Scan({ onScanComplete, onProgressUpdate, onLoadingChange }: ScanProps) {
  const handleScan = async (isDeepScan = false) => {  // בחירת שני סוגי הסריקה
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
      const data = isDeepScan ? await triggerDeepScan() : await triggerScan();  // בחירת שני סוגי הסריקה
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