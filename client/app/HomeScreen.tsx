import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComponentProps } from "react";
import globalStyles from "@/styles/globalStyles";

const { width } = Dimensions.get("window");

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const RotatingMessage = () => {
  const [currentMessage, setCurrentMessage] = React.useState(0);
  const messages: { text: string; icon: IconName }[] = [
    { text: "Your smart home, simplified.", icon: "home-outline" },
    { text: "Track and secure your devices.", icon: "lock-outline" },
    { text: "Stay updated with smart alerts.", icon: "bell-outline" },
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.messageCard}>
      <MaterialCommunityIcons
        name={messages[currentMessage].icon}
        size={40}
        color="#4A90E2"
      />
      <Text style={styles.messageText}>{messages[currentMessage].text}</Text>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <LinearGradient
        colors={["#ffffff", "#e6f7ff"]}
        style={styles.gradientContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Image
            source={require("../assets/images/main_logo.png")}
            style={styles.logo}
          />
          <Text style={styles.welcomeText}>Welcome to SafetyHome</Text>
          <RotatingMessage />

          <View style={styles.cardGrid}>
            <HomeCard
              icon="login"
              title="Sign In / Register"
              description="Access your account or create a new one."
              buttonLabel="Get Started"
              color="#4CAF50"
              onPress={() => router.push("./UserForm")}
            />

            <HomeCard
              icon="shield"
              title="Start Scan"
              description="Scan your network and find vulnerabilities."
              buttonLabel="Scan Now"
              color="#FF5722"
              onPress={() => router.push("./ScanScreen")}
            />

            <HomeCard
              icon="help-circle"
              title="FAQ"
              description="Find the answers you need."
              buttonLabel="Learn More"
              color="#3498db"
              onPress={() => router.push("./FAQscreen")}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

interface HomeCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  buttonLabel: string;
  color: string;
  onPress: () => void;
}

const HomeCard = ({ icon, title, description, buttonLabel, color, onPress }: HomeCardProps) => (
  <TouchableOpacity style={[styles.card, { borderColor: color }]} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={40} color={color} />
    <Text style={[styles.cardTitle, { color }]}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <TouchableOpacity
      style={[styles.cardButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{buttonLabel}</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
    marginBottom: 10,
    borderRadius: 65,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  welcomeText: {
    fontSize: 24,
    color: "#4A90E2",
    fontWeight: "bold",
    marginBottom: 20,
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4f8",
    padding: 20,
    borderRadius: 15,
    width: "90%",
    marginBottom: 30,
    elevation: 5,
  },
  messageText: {
    fontSize: 18,
    marginLeft: 15,
    color: "#333",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 2,
    padding: 20,
    marginBottom: 20,
    width: width * 0.42,
    alignItems: "center",
    elevation: 5,
  },
  cardTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  cardButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

function handleLoginClear() {
  throw new Error("Function not implemented.");
}
