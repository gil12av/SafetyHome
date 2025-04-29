import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity, Animated, Easing, ActivityIndicator } from "react-native";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "../styles/globalStyles";
import { fetchScanHistory, fetchCVEsForDevice, saveSecurityAlerts } from "../services/api";
import { detectVendor } from "../services/detectVendor";

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

const fallbackVendors = [
  "Apple", "Samsung", "Xiaomi", "Aqara", "Yeelight",
  "TP-Link", "Broadlink", "ESP32", "Philips", "Amazon"
];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("אנא המתן בזמן שרשימת הרכיבים נטענת...");
  const [vendors, setVendors] = useState<string[]>([]);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [generalCVEs, setGeneralCVEs] = useState<CVE[]>([]);
  const [askedForGeneralCVEs, setAskedForGeneralCVEs] = useState(false);

  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadAlerts = async () => {
      console.log("🔍 התחלת טעינת מכשירים וסריקת CVE...");
      try {
        const scannedDevices = await fetchScanHistory();
        console.log("📜 Scan history received:", scannedDevices);
        const alertsToSave: any[] = [];

        const allAlerts = await Promise.all(
          scannedDevices.map(async (device: any) => {
            const { _id: deviceId, deviceName, macAddress, userId } = device;
            const vendor = detectVendor({ macAddress, deviceName });
            console.log("🏷️ זוהה יצרן:", vendor);

            if (!vendor || ["unknown", "not available", "null"].includes(vendor.toLowerCase())) {
              console.log("🚫 Vendor invalid for device:", deviceName);
              return null;
            }

            const cves = await fetchCVEsForDevice(vendor);
            console.log("🛡️ פגיעויות עבור", vendor, ":", cves.length);
            if (cves.length === 0) return null;

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
                vendor,
                cveId: cve.id,
                severity: cve.severity,
                description: cve.description,
                suggestion: getSuggestion(cve.description)
              });
            });

            return { deviceName, vendor, cves: topCVEs };
          })
        );

        if (alertsToSave.length > 0) await saveSecurityAlerts(alertsToSave);
        setAlerts(allAlerts.filter(Boolean));
        setTimeout(() => setLoadingMessage("מתבצעת בדיקה מול מאגרי הפגיעויות ..."), 1000);
      } catch (error) {
        console.error("🔴 שגיאה ב-loadAlerts:", error);
      } finally {
        setTimeout(() => setLoading(false), 2500);
      }
    };
    loadAlerts();
  }, []);

  useEffect(() => {
    if (!loading) {
      if (alerts.length > 0) {
        const vendorSet = new Set<string>();
        alerts.forEach((alert) => { if (alert.vendor) vendorSet.add(alert.vendor); });
        const vendorsArray = Array.from(vendorSet);
        setVendors(vendorsArray);
        console.log("🛠️ Vendors discovered:", vendorsArray);
      } else {
        console.log("📎 Using fallback vendors.");
        setVendors(fallbackVendors);
      }
    }
  }, [alerts, loading]);

  const handleVendorSelect = async (vendor: string) => {
    setSelectedVendor(vendor);
    setShowVendorDropdown(false);
    console.log("📦 Vendor Selected:", vendor);

    try {
      const cves = await fetchCVEsForDevice(vendor);
      const sortedCVEs = cves.sort((a: CVE, b: CVE) => {
        const order: { [key: string]: number } = { critical: 1, high: 2, medium: 3, low: 4 };
        return (order[a.severity.toLowerCase()] || 5) - (order[b.severity.toLowerCase()] || 5);
      }).slice(0, 3);
      setGeneralCVEs(sortedCVEs);
    } catch (error) {
      console.error("❌ שגיאה בעת שליפת CVEs כלליים:", error);
    }
  };

  const toggleDropdown = () => {
    if (showVendorDropdown) {
      Animated.timing(dropdownAnim, { toValue: 0, duration: 300, easing: Easing.ease, useNativeDriver: false }).start(() => setShowVendorDropdown(false));
    } else {
      setShowVendorDropdown(true);
      Animated.timing(dropdownAnim, { toValue: 1, duration: 300, easing: Easing.ease, useNativeDriver: false }).start();
    }
  };

  const animateButton = () => {
    Animated.sequence([
      Animated.timing(buttonScale, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonScale, { toValue: 1, duration: 100, useNativeDriver: true })
    ]).start();
  };

  const getSuggestion = (description: string): string => {
    const desc = description.toLowerCase();
    if (desc.includes("default password")) return "החלף סיסמה מיידית";
    if (desc.includes("remote")) return "שקול לכבות שליטה מרחוק";
    if (desc.includes("firmware") || desc.includes("update")) return "עדכן גרסה חדשה";
    if (desc.includes("unauthorized") || desc.includes("unauthenticated")) return "הפעל אימות דו-שלבי";
    if (desc.includes("denial of service")) return "הגבל גישה לרשת";
    return "בדוק הגדרות אבטחה או פנה לתמיכה";
  };

  const getSeverityColor = (severity: string) =>
    severity.toLowerCase() === "critical" ? "#ff4d4f" :
    severity.toLowerCase() === "high" ? "#fa8c16" :
    severity.toLowerCase() === "medium" ? "#fadb14" : "#40a9ff";

  return (
    <ScreenWithBackButton title="התראות אבטחה" style={globalStyles.screenContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingMessage}>{loadingMessage}</Text>
          </View>
        ) : (
          <>
            {alerts.length === 0 && !askedForGeneralCVEs && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✔️ כל הרכיבים נסרקו ולא נמצאו פגיעויות</Text>
                <Text style={styles.subText}>🔒 הרכיבים שלך מוגנים</Text>
                <Text style={styles.subText}>📚 תרצה לבדוק פגיעויות שכיחות לפי יצרנים?</Text>
                <View style={styles.buttonRow}>
                  <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                    <TouchableOpacity
                      onPress={() => {
                        animateButton();
                        setAskedForGeneralCVEs(true);
                        toggleDropdown();
                      }}
                      style={styles.primaryButton}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.primaryButtonText}>כן, הצג לי</Text>
                    </TouchableOpacity>
                  </Animated.View>
                  <TouchableOpacity onPress={() => console.log("🙅‍♂️ המשתמש ויתר על הצגה כללית")} style={styles.secondaryButton} activeOpacity={0.8}>
                    <Text style={styles.secondaryButtonText}>לא תודה</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {askedForGeneralCVEs && showVendorDropdown && vendors.length > 0 && (
              <Animated.View style={[styles.dropdownBox, {
                height: dropdownAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, vendors.length * 50]
                })
              }]}>
                {vendors.map((vendor, idx) => (
                  <TouchableOpacity key={idx} onPress={() => handleVendorSelect(vendor)} style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{vendor}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}

            {selectedVendor && generalCVEs.length > 0 && (
              <View style={styles.generalCVEsBox}>
                <Text style={styles.generalCVEsTitle}>⚡ פגיעויות עבור {selectedVendor}</Text>
                {generalCVEs.map((cve, idx) => (
                  <View key={idx} style={[styles.cveBox, { borderLeftColor: getSeverityColor(cve.severity) }]}>
                    <Text style={styles.cveTitle}>{cve.id} ({cve.severity})</Text>
                    <Text style={styles.cveDesc}>{cve.description}</Text>
                    <Text style={styles.suggestionText}>💡 {getSuggestion(cve.description)}</Text>
                  </View>
                ))}
              </View>
            )}

            {alerts.length > 0 && alerts.map((alert, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.deviceTitle}>📡 {alert.deviceName}</Text>
                <Text style={styles.vendorLabel}>🔍 יצרן: {alert.vendor}</Text>
                {alert.cves.map((cve, i) => (
                  <View key={i} style={[styles.cveBox, { borderLeftColor: getSeverityColor(cve.severity) }]}>
                    <Text style={styles.cveTitle}>{cve.id} ({cve.severity})</Text>
                    <Text style={styles.cveDesc}>{cve.description}</Text>
                    <Text style={styles.suggestionText}>💡 {getSuggestion(cve.description)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 20 },
  loadingContainer: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  loadingMessage: { marginTop: 15, fontSize: 16, color: "#555", textAlign: "center" },
  successBox: { backgroundColor: "#d4edda", padding: 15, borderRadius: 10, marginBottom: 20, alignItems: "center" },
  successText: { color: "#155724", fontSize: 18, fontWeight: "bold" },
  subText: { fontSize: 14, color: "#155724", marginTop: 5, textAlign: "center" },
  buttonRow: { flexDirection: "row", justifyContent: "center", marginTop: 15, gap: 10 },
  primaryButton: { backgroundColor: "#007bff", padding: 10, borderRadius: 8 },
  primaryButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  secondaryButton: { backgroundColor: "#f0f0f0", padding: 10, borderRadius: 8 },
  secondaryButtonText: { color: "#333", fontWeight: "bold", fontSize: 16 },
  dropdownBox: { backgroundColor: "#f0f4f8", overflow: "hidden", borderRadius: 8, marginTop: 10 },
  dropdownItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  dropdownItemText: { fontSize: 16 },
  generalCVEsBox: { marginTop: 20 },
  generalCVEsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  card: { backgroundColor: "#fff", borderRadius: 10, padding: 15, elevation: 4 },
  deviceTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  vendorLabel: { fontSize: 14, color: "#666", marginBottom: 10 },
  cveBox: { backgroundColor: "#f9f9f9", borderRadius: 8, padding: 10, marginBottom: 10, borderLeftWidth: 5 },
  cveTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 5 },
  cveDesc: { fontSize: 13, marginBottom: 5 },
  suggestionText: { fontSize: 13, color: "#333", fontStyle: "italic", marginBottom: 5 }
});
