import React, { useContext } from "react";
import { Alert } from "react-native";
import { triggerScan } from "../services/api";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth();
  const userId = user?._id;

  const handleScan = async () => {
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please login again.");
      return;
    }
    onLoadingChange(true);
    onProgressUpdate(0);

    let progress = 0; // נוסיף משתנה לניהול progress

    let progressInterval = setInterval(() => {
      if (progress < 0.9) {
        progress += 0.1;
        onProgressUpdate(progress); // עדכון ערך ישיר
      } else {
        clearInterval(progressInterval);
      }
    }, 1000);

    try {
      const data = await triggerScan(userId);
      clearInterval(progressInterval);
      onProgressUpdate(1);
      onScanComplete(data.devices || []);
    } catch (err) {
      console.error("Error during scan request:", err);
      Alert.alert("Error", "Failed to perform the scan.");
    } finally {
      onLoadingChange(false);
      clearInterval(progressInterval);
    }
  };

  return { handleScan };
}