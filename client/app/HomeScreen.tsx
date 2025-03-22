import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ComponentProps } from "react";

type IconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

// טקסטים מתחלפים עם עיצוב כרטיסיה
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
      <Text style={styles.messageText}>
        {messages[currentMessage].text}
      </Text>
    </View>
  );
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }}>
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

          <View style={styles.cardContainer}>
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

// הגדרת הטיפוסים עבור HomeCard
interface HomeCardProps {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  buttonLabel: string;
  color: string;
  onPress: () => void;
}

const HomeCard = ({
  icon,
  title,
  description,
  buttonLabel,
  color,
  onPress,
}: HomeCardProps) => (
  <View style={styles.card}>
    <MaterialCommunityIcons name={icon} size={60} color={color} />
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardDescription}>{description}</Text>
    <TouchableOpacity
      style={[styles.cardButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{buttonLabel}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
  cardContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    marginVertical: 15,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 15,
    color: "#333",
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  cardButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "70%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

function handleLoginClear() {
  throw new Error("Function not implemented.");
}
