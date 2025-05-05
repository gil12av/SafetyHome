import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { FadeInRight } from "react-native-reanimated";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";


const sections = [
  {
    title: "Privacy Policy",
    text: "We commit to collecting and storing your data securely. Your information will not be shared with third parties without your consent.",
    icon: "lock-outline",
  },
  {
    title: "Fair Use",
    text: "The app must not be used for harmful or illegal purposes. Misuse will result in a ban.",
    icon: "scale-balance",
  },
  {
    title: "Limited Liability",
    text: "The developers are not responsible for any direct or indirect damages resulting from using the app or information derived from it.",
    icon: "alert-circle-outline",
  },
  {
    title: "Future Updates",
    text: "These terms may change. Any update will be published and take effect immediately.",
    icon: "update",
  },
];

export default function TermsScreen() {
  return (
    <ScreenWithBackButton title="Terms of Use">
      <LinearGradient colors={["#e0f7fa", "#ffffff"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.headerBox}>
            <Icon name="file-document-multiple-outline" size={44} color="#007BFF" />
            <Text style={styles.headerText}>Application Terms of Use</Text>
            <Text style={styles.subText}>Last updated: March 2025</Text>
          </View>

          {sections.map((section, index) => (
            <Animated.View key={index} entering={FadeInRight} style={styles.card}>
              <View style={styles.cardHeader}>
                <Icon name={section.icon} size={26} color="#007BFF" />
                <Text style={styles.cardTitle}>{section.title}</Text>
              </View>
              <Text style={styles.cardText}>{section.text}</Text>
            </Animated.View>
          ))}
        </ScrollView>
      </LinearGradient>
    </ScreenWithBackButton>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 20,
  },
  headerBox: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 10,
  },
  subText: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
});
