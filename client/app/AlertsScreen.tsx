import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, StyleSheet, Linking, TouchableOpacity, Animated, Easing, ActivityIndicator, Alert } from "react-native";
import AppScreen from "@/components/AppScreen";
import { fetchScanHistory, fetchCVEsForDevice, saveSecurityAlerts } from "../services/api";
import { detectVendor } from "../services/detectVendor";
import * as Clipboard from 'expo-clipboard' ;
import { MaterialCommunityIcons } from '@expo/vector-icons';
import CveChatPrompt from "@/components/CveChatPrompt";


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

const fallbackVendors = ["Apple", "Samsung", "Xiaomi", "Aqara", "Yeelight", "TP-Link", "Broadlink", "ESP32", "Philips", "Amazon"];

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Please wait while the list of components loads...");
  const [vendors, setVendors] = useState<string[]>([]);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [generalCVEs, setGeneralCVEs] = useState<CVE[]>([]);
  const [askedForGeneralCVEs, setAskedForGeneralCVEs] = useState(false);
  const dropdownAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loadAlerts = async () => {
      console.log("🔍 starting to Load CVE..");
      try {
        const scannedDevices = await fetchScanHistory();
        console.log("📜 Scan history received:", scannedDevices);
        const alertsToSave: any[] = [];

        const allAlerts = await Promise.all(
          scannedDevices.map(async (device: any) => {
            const { _id: deviceId, deviceName, macAddress, userId } = device;
            const vendor = detectVendor({ macAddress, deviceName });
            console.log("🏷️ vendor detected: ", vendor);

            if (!vendor || ["unknown", "not available", "null"].includes(vendor.toLowerCase())) {
              console.log("🚫 Vendor invalid for device:", deviceName);
              return null;
            }

            const cves = await fetchCVEsForDevice(vendor);
            console.log("🛡️ CVE for:", vendor, ":", cves.length);
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
        setTimeout(() => setLoadingMessage("Checking vulnerabilities in public databases..."), 1000);
      } catch (error) {
        console.error("Error loading alerts:", error);
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
        alerts.forEach((alert) => {
          if (alert.vendor) vendorSet.add(alert.vendor);
        });
        const vendorsArray = Array.from(vendorSet);
  
        // we want to add fallback VENDOR also!
        const combinedVendors = Array.from(new Set([...vendorsArray, ...fallbackVendors]));
        setVendors(combinedVendors);
  
        console.log("🛠️ Vendors discovered:", combinedVendors);
      } else {
        console.log("📎 Using fallback vendors only.");
        setVendors(fallbackVendors);
      }
    }
  }, [alerts, loading]);

  const handleVendorSelect = async (vendor: string) => {
    setSelectedVendor(vendor);
    setShowVendorDropdown(false);
    console.log("📦 Vendor Selected:", vendor);

    try {
      setLoadingMessage(`🔍 Fetching vulnerabilities for ${vendor}...`);
      setLoading(true);
      const cves = await fetchCVEsForDevice(vendor);
      const sortedCVEs = cves.sort((a: CVE, b: CVE) => {
        const order: { [key: string]: number } = { critical: 1, high: 2, medium: 3, low: 4 };
        return (order[a.severity.toLowerCase()] || 5) - (order[b.severity.toLowerCase()] || 5);
      }).slice(0, 3);
      setGeneralCVEs(sortedCVEs);
      setLoading(false);
        setLoadingMessage("✔️ Results loaded.");
    } catch (error) {
      console.error("Error fetching general CVEs:", error);
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
    if (desc.includes("default password")) return "Change default password";
    if (desc.includes("remote")) return "Disable remote access";
    if (desc.includes("firmware") || desc.includes("update")) return "Update device firmware";
    if (desc.includes("unauthorized") || desc.includes("unauthenticated")) return  "Enable two-factor authentication";
    if (desc.includes("denial of service")) return "Restrict network access";
    return "Check security settings or contact support";
  };

  const getSeverityColor = (severity: string) =>
    severity.toLowerCase() === "critical" ? "#ff4d4f" :
    severity.toLowerCase() === "high" ? "#fa8c16" :
    severity.toLowerCase() === "medium" ? "#fadb14" : "#40a9ff";


  return (
    <AppScreen title="Security Alerts" showBackButton>
      <ScrollView contentContainerStyle={styles.container}>

        {/* פתיח קבוע לכל משתמש */}
        {!loading && (
          <View style={styles.successBox}>
            <Text style={styles.title}>🔐 Network Security Alerts</Text>
            <Text style={styles.description}>Below are your device vulnerabilities and suggested fixes. Review each item carefully.</Text>
            <Text style={styles.subText}>If vulnerabilities are found, we will show a summary and recommended action.</Text>
            <Text style={styles.subText}>If everything is secure, you'll see a confirmation message.🔒</Text>
          </View>
        )}

        {/* שלב טעינה */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.loadingMessage}>{loadingMessage}</Text>
          </View>
        ) : (
          <>
            {/* אם התגלו פגיעויות – נציג כל אחת בצורה נגישה */}
            {alerts.length > 0 && alerts.map((alert, idx) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.deviceTitle}>📡 After scan {alert.deviceName}, We detected the following vulnerabilities:</Text>
                <Text style={styles.vendorLabel}>🔍 vendor: {alert.vendor}</Text>
                {alert.cves.map((cve, i) => (
                  <View key={i} style={[styles.cveBox, { borderLeftColor: getSeverityColor(cve.severity) }]}>
                    <View style={styles.cveHeader}>
                    <View style={styles.cveHeader}>
                    <Text style={styles.cveTitle}>{cve.id}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => {
                        Clipboard.setStringAsync(cve.id);
                        Alert.alert("Copied", `${cve.id} copied to clipboard`);
                        }}
                         >
                      <MaterialCommunityIcons name="content-copy" size={18} color="#007bff" />
                      </TouchableOpacity>
                    <Text style={[styles.severityBadge, { backgroundColor: getSeverityColor(cve.severity) }]}>
                      {cve.severity.toUpperCase()}
                    </Text>
                    </View>
                  </View>
                  </View>
                    <Text style={styles.cveDesc}>{cve.description}</Text>
                    <Text style={styles.suggestionText}>💡 {getSuggestion(cve.description)}</Text>

                  </View>
                ))}
              </View>
            ))}

            {/* אם לא התגלו פגיעויות כלל */}
            {alerts.length === 0 && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>✔️ All components were scanned and no vulnerabilities were found.</Text>
                <Text style={styles.subText}>🔒 Your components are protected</Text>
              </View>
            )}

            {/* הצעה תמידית לבדוק רכיבים נפוצים */}
            <View style={styles.successBox}>
              <Text style={styles.subText}>📚 Would you like to check for common vulnerabilities by popular manufacturers?</Text>
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
                    <Text style={styles.primaryButtonText}>Yes, show me</Text>
                    {loading && <ActivityIndicator size="small" color="#007bff" style={{ marginLeft: 10 }} />}
                  </TouchableOpacity>
                </Animated.View>
                <TouchableOpacity onPress={() => console.log("🙅‍♂️ המשתמש ויתר על הצגה כללית")} style={styles.secondaryButton} activeOpacity={0.8}>
                  <Text style={styles.secondaryButtonText}>No thanks</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* דרופדאון – יופיע רק אם המשתמש לחץ */}
            {askedForGeneralCVEs && showVendorDropdown && vendors.length > 0 && (
              <Animated.View style={[styles.dropdownBox, {
                height: dropdownAnim.interpolate({ inputRange: [0, 1], outputRange: [0, vendors.length * 50] })
              }]}>
                {vendors.map((vendor, idx) => (
                  <TouchableOpacity key={idx} onPress={() => handleVendorSelect(vendor)} style={styles.dropdownItem}>
                    <Text style={styles.dropdownItemText}>{vendor}</Text>
                  </TouchableOpacity>
                ))}
              </Animated.View>
            )}

            {/* תוצאה של פגיעויות כלליות לפי יצרן */}
            {selectedVendor && generalCVEs.length > 0 && (
              <View style={styles.generalCVEsBox}>
                <Text style={styles.generalCVEsTitle}>⚡ CVE's for: {selectedVendor}</Text>
                {generalCVEs.map((cve, idx) => (
                  <View key={idx} style={[styles.cveBox, { borderLeftColor: getSeverityColor(cve.severity) }]}>
                    <View style={styles.cveHeader}>
                    <Text style={styles.cveTitle}>{cve.id} ({cve.severity})</Text>
                      <TouchableOpacity
                        onPress={() => {
                          Clipboard.setStringAsync(cve.id);
                          Alert.alert("Copied", `${cve.id} copied to clipboard`);
                          }}
                          >
                        <MaterialCommunityIcons name="content-copy" size={20} color="#007bff" />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.cveDesc}>{cve.description}</Text>
                    <Text style={styles.suggestionText}>💡 {getSuggestion(cve.description)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* טקסט סיום */}
            <Text style={styles.finalNote}>
              ✅ Scan complete. Follow the suggested actions above to improve your smart home security.
            </Text>
          </>
        )}
      </ScrollView>
      <CveChatPrompt />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 20 },
  loadingContainer: { alignItems: "center", justifyContent: "center", marginTop: 40 },
  loadingMessage: { marginTop: 15, fontSize: 16, color: "#555", textAlign: "center" },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 5
  },
  description: {
    fontSize: 15,
    color: "#555",
    textAlign: "center"
  },
  
  cveHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  severityBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
    overflow: "hidden"
  },
  
  successBox: {
    backgroundColor: "#d4edda",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center"
  },
  successText: {
    color: "#155724",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },
  subText: {
    fontSize: 14,
    color: "#155724",
    marginTop: 5,
    textAlign: "center"
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
    gap: 10
  },
  primaryButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 8
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  secondaryButton: {
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 8
  },
  secondaryButtonText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 16
  },

  dropdownBox: {
    backgroundColor: "#f0f4f8",
    overflow: "hidden",
    borderRadius: 8,
    marginTop: 10
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc"
  },
  dropdownItemText: {
    fontSize: 16
  },

  generalCVEsBox: {
    marginTop: 20
  },
  generalCVEsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 4
  },
  deviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5
  },
  vendorLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10
  },
  cveBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderLeftWidth: 5
  },
  cveTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5
  },
  cveDesc: {
    fontSize: 13,
    marginBottom: 5,
    color: "#444",
    lineHeight: 18,
  },
  
  suggestionText: {
    fontSize: 13,
    color: "#333",
    fontStyle: "italic",
    marginBottom: 10,
  },

  finalNote: {
    fontSize: 14,
    color: "#155724",
    textAlign: "center",
    marginTop: 30,
    paddingHorizontal: 10,
  }
  
});
