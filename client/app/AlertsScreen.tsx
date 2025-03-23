import React, { useEffect } from "react";
import { View, Text } from "react-native";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "../styles/globalStyles";
import { fetchCVEsForDevice } from "../services/api";

export default function AlertsScreen() {
  useEffect(() => {
    const testCVE = async () => {
      const results = await fetchCVEsForDevice("tplink");
      console.log("🚨 CVE Results:", results);
    };
    testCVE();
  }, []);

  return (
    <ScreenWithBackButton title="Alert" style={globalStyles.screenContainer}>
      <View style={globalStyles.screenContainer}>
        <Text style={globalStyles.title}>Alerts</Text>
        <Text style={globalStyles.cardText}>
          This is the Alerts screen. Content will be added soon.
        </Text>
      </View>
    </ScreenWithBackButton>
  );
}


// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
// import ScreenWithBackButton from "@/components/ScreenWithBackButton";
// import { fetchScanHistory, fetchCVEsForDevice } from "../services/api";
// import globalStyles from "../styles/globalStyles";

// export default function AlertsScreen() {
//   const [alerts, setAlerts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadAlerts = async () => {
//       try {
//         const scannedDevices = await fetchScanHistory();

//         const alertsList = [];

//         for (const device of scannedDevices) {
//           const cves = await fetchCVEsForDevice(device.deviceName || "");
//           if (cves.length > 0) {
//             alertsList.push({
//               deviceName: device.deviceName,
//               ip: device.ipAddress,
//               cves,
//             });
//           }
//         }

//         setAlerts(alertsList);
//       } catch (error) {
//         console.error("🔴 Failed to load alerts:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAlerts();
//   }, []);

//   return (
//     <ScreenWithBackButton title="Security Alerts" style={globalStyles.screenContainer}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Text style={styles.title}>פגיעויות שהתגלו</Text>

//         {loading ? (
//           <ActivityIndicator size="large" color="#007BFF" />
//         ) : alerts.length === 0 ? (
//           <Text style={styles.noAlerts}>לא נמצאו פגיעויות במכשירים שנסרקו 👌</Text>
//         ) : (
//           alerts.map((alert, index) => (
//             <View key={index} style={styles.card}>
//               <Text style={styles.deviceName}>🔌 {alert.deviceName}</Text>
//               <Text style={styles.deviceIp}>IP: {alert.ip}</Text>
//               {alert.cves.map((cve, i) => (
//                 <View key={i} style={styles.cveBox}>
//                   <Text style={styles.cveId}>🛑 {cve.id}</Text>
//                   <Text style={styles.cveDesc}>{cve.description}</Text>
//                   <Text style={styles.cveSeverity}>רמת סיכון: {cve.severity}</Text>
//                 </View>
//               ))}
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </ScreenWithBackButton>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//     color: "#333",
//   },
//   noAlerts: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     elevation: 4,
//   },
//   deviceName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   deviceIp: {
//     fontSize: 14,
//     color: "#777",
//     marginBottom: 10,
//   },
//   cveBox: {
//     backgroundColor: "#f9f9f9",
//     padding: 10,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   cveId: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#d32f2f",
//   },
//   cveDesc: {
//     fontSize: 14,
//     color: "#333",
//   },
//   cveSeverity: {
//     fontSize: 14,
//     color: "#ff9800",
//     fontWeight: "bold",
//     marginTop: 5,
//   },
// });
