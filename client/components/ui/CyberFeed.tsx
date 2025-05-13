import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const resources = [
  {
    id: "1",
    title: "How to Secure Your Smart Home",
    subtitle: "Essential steps to lock down your devices.",
    url: "https://www.cisa.gov/news-events/news/how-secure-your-smart-home",
    image:
      "https://www.cisa.gov/sites/default/files/styles/medium/public/2021-03/SmartHomeSecurity.jpg",
  },
  {
    id: "2",
    title: "Default Passwords – A Major Risk",
    subtitle: "Learn why changing them matters.",
    url: "https://www.bleepingcomputer.com/news/security/default-passwords-used-in-iot-devices-are-a-huge-risk/",
    image:
      "https://miro.medium.com/v2/resize:fit:1200/1*bEDnqCFJJZQ0xkJ41NOl9Q.png",
  },
  {
    id: "3",
    title: "Change Your Router Password Today",
    subtitle: "A beginner’s guide to better security.",
    url: "https://www.wikihow.com/Change-Your-WiFi-Password",
    image:
      "https://www.wikihow.com/images/thumb/f/f5/Change-Your-WiFi-Password-Step-1-Version-5.jpg/v4-460px-Change-Your-WiFi-Password-Step-1-Version-5.jpg",
  },
];

const CyberFeed = () => {
  const openLink = (url: string) => Linking.openURL(url);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>🛡️ Cybersecurity Feed</Text>
      {resources.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => openLink(item.url)}
          activeOpacity={0.9}
        >
          <LinearGradient colors={["#e6f2ff", "#ffffff"]} style={styles.gradientBg}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <MaterialCommunityIcons
                name="shield-lock-outline"
                size={26}
                color="#4A90E2"
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <View style={styles.footerBar}>
              <Text style={styles.linkText}>Read more</Text>
              <MaterialCommunityIcons name="arrow-right" size={20} color="#4A90E2" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    color: "#2C3E50",
  },
  card: {
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  gradientBg: {
    borderRadius: 16,
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 15,
    paddingVertical: 14,
    backgroundColor: "#f7fafd",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#7f8c8d",
  },
  footerBar: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 12,
    paddingTop: 6,
  },
  linkText: {
    color: "#4A90E2",
    fontWeight: "500",
    marginRight: 6,
    fontSize: 14,
  },
});

export default CyberFeed;
