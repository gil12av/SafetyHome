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
  const handleScan = async (isDeepScan = false) => {
    console.log("🚀 handleScan called, isDeepScan =", isDeepScan);                // ← נקודת קריאה
    onLoadingChange(true);
    onProgressUpdate(0);

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress = Math.min(progress + 0.1, 0.9);
      onProgressUpdate(progress);
    }, 1000);

    try {
      if (isDeepScan) console.log("🔍 about to call triggerDeepScan()");           // ← בדיקת סוג הסריקה
      else            console.log("⚡️ about to call triggerScan()");

      const data = isDeepScan
        ? await triggerDeepScan()
        : await triggerScan();

      console.log("✅ scan response data:", data);                               // ← התוצאה שהתקבלה
      clearInterval(progressInterval);
      onProgressUpdate(1);
      onScanComplete(data.devices || []);
    } catch (err) {
      console.error("❌ Error during scan request:", err);                        // ← שגיאה מדויקת
      Alert.alert("Error", "Failed to perform the scan.");
    } finally {
      onLoadingChange(false);
      clearInterval(progressInterval);
    }
  };

  return { handleScan };
}
