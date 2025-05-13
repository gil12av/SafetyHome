import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
const { width } = Dimensions.get("window");
import AppScreen from "@/components/AppScreen";
import { colors } from "@/styles/theme";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

// ------ הודעות מתחלפות במסך הבית ------ //
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
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      key={currentMessage}
      style={styles.animatedCard}
    >
      <MaterialCommunityIcons
        name={messages[currentMessage].icon}
        size={30}
        color="#4A90E2"
      />
      <Text style={styles.animatedText}>{messages[currentMessage].text}</Text>
    </Animated.View>
  );
};
// ------ סיום הודעות מתחלפות במסך הבית ------ //

const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <AppScreen>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Image
          source={require("../assets/images/smart_home_logo_vibrant.png")}
          style={styles.logo}
        />
        <Text style={styles.greeting}>{getTimeGreeting()}</Text>
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
            title="Intro To Scan"
            description="Learn about why is so important to scan devices."
            buttonLabel="Learn More"
            color="#FF5722"
            onPress={() => router.push("./IntroToScan")}
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
    </AppScreen>
  );
}

interface HomeCardProps {
  icon: IconName;
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
    <TouchableOpacity style={[styles.cardButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.buttonText}>{buttonLabel}</Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#4A90E2",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 25,
    textAlign: "center",
  },
  messageCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#eef6fb",
    padding: 15,
    borderRadius: 12,
    marginBottom: 35,
    width: width * 0.9,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
  cardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 22,
    margin: 12,
    width: width * 0.90,
    alignItems: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1.5,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginTop: 12,
  },
  cardDescription: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginVertical: 10,
  },
  cardButton: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  animatedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 35,
    width: width * 0.9,
    borderWidth: 1,
    borderColor: "#4A90E2",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  animatedText: {
    fontSize: 17,
    marginLeft: 15,
    color: "#2C3E50",
    fontWeight: "500",
  },
  
});
