import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity } from "react-native";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "../styles/globalStyles";
import { fetchScanHistory, fetchCVEsForDevice, saveSecurityAlerts } from "../services/api";
import { detectVendorFromDeviceName } from "../services/detectVendorFromDeviceName";
import { normalizeVendorName } from "../services/normalizeVendorName";

interface CVE {
  id: string;
  description: string;
  severity: string;
}

interface AlertItem {
  deviceName: string;
  vendor: string;
  cves: CVE[];
}

interface AlertToSave {
  userId: string;
  deviceId: string;
  deviceName: string;
  vendor: string | null;
  cveId: string;
  severity: string;
  description: string;
  suggestion: string;
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      console.log("🔍 Fetching scan history...");
      try {
        const scannedDevices = await fetchScanHistory();
        console.log("📜 Scan history received:", scannedDevices);

        const alertsToSave: AlertToSave[] = [];

        const allAlerts = await Promise.all(
          scannedDevices.map(async (device: any) => {
            const { _id: deviceId, deviceName, macAddress, userId } = device;
            console.log("📱 Device Name:", deviceName);
            console.log("💻 MAC Address:", macAddress);

            let vendor = null;

            if (!macAddress || macAddress === "Unknown" || macAddress === "" || macAddress === "Not Available") {
              vendor = detectVendorFromDeviceName(deviceName);
              console.log("🔎 Vendor detected from name:", vendor);
            }

            if (!vendor) {
              console.log("⛔ No vendor detected, skipping device:", deviceName);
              return null;
            }

            const normalizedVendor = normalizeVendorName(vendor);
            console.log("🧼 Normalized vendor:", normalizedVendor);

            const cves = await fetchCVEsForDevice(normalizedVendor);
            console.log(`🛡️ CVEs fetched for ${normalizedVendor}:`, cves.length);

            if (cves.length === 0) {
              console.log(`⚠️ No CVEs found for ${normalizedVendor}`);
              return null;
            }

            const relevantCVEs = cves.filter((cve: CVE) => {
              const desc = cve.description.toLowerCase();
              return (
                desc.includes("default password") ||
                desc.includes("remote access") ||
                desc.includes("firmware") ||
                desc.includes("unauthorized") ||
                desc.includes("unauthenticated") ||
                desc.includes("denial of service")
              );
            });

            const topCVEs = relevantCVEs.slice(0, 3);

            topCVEs.forEach((cve: CVE) => {
              alertsToSave.push({
                userId,
                deviceId,
                deviceName,
                vendor: normalizedVendor,
                cveId: cve.id,
                severity: cve.severity,
                description: cve.description,
                suggestion: getSuggestion(cve.description),
              });
            });

            return {
              deviceName,
              vendor: normalizedVendor,
              cves: topCVEs,
            };
          })
        );

        if (alertsToSave.length > 0) {
          await saveSecurityAlerts(alertsToSave);
          console.log("✅ Alerts saved to DB:", alertsToSave.length);
        }

        setAlerts(allAlerts.filter(Boolean));
      } catch (error) {
        console.error("🔴 Failed to load alerts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const getSeverityIcon = (severity: string) => {
    const sev = severity.toLowerCase();
    if (sev === "critical") return "🔥";
    if (sev === "high") return "⚠️";
    if (sev === "medium") return "❗";
    if (sev === "low") return "ℹ️";
    return "🛡️";
  };

  const getSeverityColor = (severity: string) => {
    const sev = severity.toLowerCase();
    if (sev === "critical") return "#ff4d4f";
    if (sev === "high") return "#fa8c16";
    if (sev === "medium") return "#fadb14";
    if (sev === "low") return "#40a9ff";
    return "#d9d9d9";
  };

  const getSuggestion = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes("default password")) return "החלף סיסמה מיידית והשתמש בסיסמה חזקה";
    if (desc.includes("remote")) return "שקול לכבות שליטה מרחוק אם אינך זקוק לה";
    if (desc.includes("firmware") || desc.includes("update")) return "בדוק האם קיימת גרסה עדכנית יותר ועדכן בהתאם";
    if (desc.includes("unauthorized") || desc.includes("unauthenticated")) return "הפעל אימות דו-שלבי אם אפשרי";
    if (desc.includes("denial of service")) return "הפעלה מחודשת של המכשיר מומלצת והגבל גישה אליו מהרשת";
    return "בדוק את הגדרות האבטחה של המכשיר או פנה לתמיכה הטכנית";
  };

  const openGoogleSearch = (cveId: string) => {
    const url = `https://www.google.com/search?q=${cveId}`;
    Linking.openURL(url);
  };

  return (
    <ScreenWithBackButton title="התראות אבטחה" style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <Text style={styles.loadingText}>טוען פגיעויות...</Text>
        ) : alerts.length === 0 ? (
          <Text style={styles.noAlertsText}>לא נמצאו פגיעויות מוכרות</Text>
        ) : (
          alerts.map((alert, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.deviceTitle}>📡 {alert.deviceName} – חשוף לפגיעויות אבטחה</Text>
              <Text style={styles.vendorLabel}>🔍 יצרן מזוהה: {alert.vendor}</Text>
              {alert.cves.map((cve, i) => (
                <View key={i} style={[styles.cveBox, { borderLeftColor: getSeverityColor(cve.severity) }]}>
                  <Text style={styles.cveTitle}>{getSeverityIcon(cve.severity)} {cve.id} ({cve.severity})</Text>
                  <Text style={styles.cveDesc}>{cve.description}</Text>
                  <Text style={styles.cveSuggestion}>✅ המלצה: {getSuggestion(cve.description)}</Text>
                  <TouchableOpacity onPress={() => openGoogleSearch(cve.id)}>
                    <Text style={styles.learnMore}>🔗 לחץ כאן למידע נוסף</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
  },
  noAlertsText: {
    fontSize: 18,
    textAlign: "center",
    color: "green",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 4,
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  vendorLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  cveBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "gray",
  },
  cveTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  cveDesc: {
    fontSize: 13,
    marginBottom: 5,
  },
  cveSuggestion: {
    fontSize: 13,
    color: "#007BFF",
    fontWeight: "600",
    marginBottom: 5,
  },
  learnMore: {
    fontSize: 13,
    color: "#1890ff",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
