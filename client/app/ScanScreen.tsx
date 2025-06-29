import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Animated,
  Alert,
  Modal,
} from "react-native";
import LottieView from "lottie-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Scan from "../components/Scan";
import AppScreen from "@/components/AppScreen";
import { colors } from "@/styles/theme";
import DateTimePicker from '@react-native-community/datetimepicker';
import { scheduleScan, fetchScheduledScan } from "@/services/api.jsx";
import axios from "axios";
import DecryptText from "@/components/DecryptText";
import RotatingMessage from "@/components/RotatingMessage";



const { width } = Dimensions.get("window");

type Device = {
  deviceName: string;
  ipAddress: string;
  macAddress: string;
  operatingSystem?: string;
  openPorts?: { port: number; service: string; product: string; version: string }[];
};

type ScheduleResult = { scheduledDateTime: string } | null;

export default function ScanScreen() {
  const [scheduledScan, setScheduledScan] = useState<string | null>(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [infoVisible, setInfoVisible] = useState(false);
  const [scanResults, setScanResults] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.2, duration: 800, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [loading]);

  useEffect(() => {
    (async () => {
      try {
        const result = (await fetchScheduledScan()) as ScheduleResult;
        if (result?.scheduledDateTime) {
          const scheduled = new Date(result.scheduledDateTime);
          setDate(scheduled);
          setScheduledScan(scheduled.toLocaleString());
        }
      } catch (err) {
        console.error("Failed to fetch scheduled scan", err);
      }
    })();
  }, []);

  const handleScanComplete = (devices: Device[]) => {
    setScanResults(devices);
    setLoading(false);
    setProgress(0);
  };

  const handleProgressUpdate = (newProgress: number) => setProgress(newProgress);
  const handleLoadingChange = (isLoading: boolean) => setLoading(isLoading);

  const { handleScan } = Scan({
    onScanComplete: handleScanComplete,
    onProgressUpdate: handleProgressUpdate,
    onLoadingChange: handleLoadingChange,
  });

  const showDatePicker = () => setDatePickerVisible(true);
  const onDateChange = async (_event: any, selectedDate?: Date) => {
    setDatePickerVisible(false);
    if (selectedDate) {
      setDate(selectedDate);
      const formatted = selectedDate.toLocaleString();
      setScheduledScan(formatted);
      try {
        await scheduleScan(selectedDate.toISOString());
      } catch {
        Alert.alert("Error", "Failed to schedule scan.");
      }
    }
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <View style={styles.resultCard}>
      <Text style={styles.resultText}>Name: {item.deviceName}</Text>
      <Text style={styles.resultText}>IP: {item.ipAddress}</Text>
      <Text style={styles.resultText}>MAC: {item.macAddress || "N/A"}</Text>
      {item.operatingSystem && (
        <Text style={styles.resultText}>OS: {item.operatingSystem}</Text>
      )}
      {item.openPorts?.length ? (
        <Text style={styles.resultText}>Open Ports: {item.openPorts.length}</Text>
      ) : null}
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Title and Info */}
      <View style={styles.header}>
        <Text style={styles.title}>Network Scan</Text>
        <TouchableOpacity onPress={() => setInfoVisible(true)}>
          <Icon name="information-outline" size={24} color="#555" />
        </TouchableOpacity>
      </View>
      <DecryptText
        text="_Scanning your home network."
      />
      <DecryptText
        text="_Security starts here. "
      />

      {/* Info Modal */}
      <Modal
        visible={infoVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setInfoVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Scan Types</Text>
            <Text style={styles.modalText}>
              • Quick Scan: Fast 1-2 min, discovers active devices only.
            </Text>
            <Text style={styles.modalText}>
              • Deep Scan: Detailed 5-10 min, includes OS detection, ports & services.
            </Text>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setInfoVisible(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      {/* Scan Options Cards */}
      {!loading && (
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={[styles.scanCard, styles.quickBorder]}
            onPress={() => handleScan(false)}
          >
            <Icon name="flash" size={40} color="#50E3C2" />
            <Text style={[styles.cardTitle, { color: "#50E3C2" }]}>Quick Scan</Text>
            <Text style={styles.cardDesc}>
              Run a quick 1-2 minute scan to find currently active devices.
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.scanCard, styles.deepBorder]}
            onPress={() => handleScan(true)}
          >
            <Icon name="network" size={40} color="#FF6F61" />
            <Text style={[styles.cardTitle, { color: "#FF6F61" }]}>Deep Scan</Text>
            <Text style={styles.cardDesc}>
              Perform a comprehensive 5-10 minute scan including OS, ports
              & services.
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Animation */}
      {loading && (
        <View style={styles.loadingArea}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LottieView
              source={require("../assets/animations/scan.json")}
              autoPlay
              loop
              style={styles.loader}
            />
          </Animated.View>
          <Text style={styles.progressText}>{Math.round(progress * 100)}%</Text>
        </View>
      )}
    
      {/* Schedule Button */}
      <Text style={styles.scheduleInfo}>
        You can also schedule your next scan at a convenient time.
      </Text>
      <View style={styles.scheduleRow}>
        <TouchableOpacity style={styles.scheduleBtn} onPress={showDatePicker}>
          <Icon name="calendar-clock" size={20} color="#fff" />
          <Text style={styles.scheduleText}>
            {scheduledScan || "Schedule Next Scan"}
          </Text>
        </TouchableOpacity>
        {datePickerVisible && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

        {!loading && scanResults.length === 0 && (
          <Text style={styles.resultMessage}>
           No new devices were discovered in this scan.
          </Text>
        )}

      {!loading && scanResults.length > 0 && (
        <>
          <Text style={styles.resultHeader}>
            Devices Detected:
          </Text>
          <Text style={styles.resultMessage}>
            These devices were discovered in your recent scan and will be analyzed for potential vulnerabilities.
          </Text>
        </>
      )}
    </View>
  );

  return (
    <AppScreen title="Scan" showBackButton>
      <FlatList
        data={scanResults}
        renderItem={renderDevice}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={styles.list}
        ListHeaderComponent={ListHeader}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.header,
  },

  scheduleRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 12,
  },

  scheduleBtn: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  scheduleText: {
  color: "#fff",
  marginLeft: 10,
  fontWeight: "600",
  fontSize: 16,
},

  cardContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  scanCard: {
    borderRadius: 24,
    padding: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    overflow: "hidden", // כדי שהגרדיאנט ייחתך יפה
  },
  
  quickBorder: {
    borderColor: "#50E3C2",
  },
  deepBorder: {
    borderColor: "#FF6F61",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 12,
  },
  cardDesc: {
  fontSize: 14,
  color: colors.text,
  textAlign: "center",
  marginTop: 8,
  lineHeight: 20,
},

  loadingArea: {
    alignItems: "center",
    marginVertical: 20,
  },
  loader: {
    width: 150,
    height: 150,
  },
  progressText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    elevation: 2,
  },
  
  resultText: {
    color: "#333",
    fontSize: 15,
    marginBottom: 4,
  },
  list: {
    paddingBottom: 100,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  modalText: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
    lineHeight: 20,
  },
  modalClose: {
    marginTop: 16,
    alignSelf: "flex-end",
  },
  modalCloseText: {
    color: "#4A90E2",
    fontWeight: "600",
  },
  introText: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 16,
    lineHeight: 22,
  },
  reultSummary: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  resultHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 6,
    marginLeft: 16,
    color: "#333",
  },
  resultMessage: {
    fontSize: 15,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 10,
    lineHeight: 20,
  },
  scheduleInfo: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 6,
    lineHeight: 20,
  },
  
  
});
