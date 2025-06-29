import React from "react";
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LottieView from 'lottie-react-native';
import { Animated } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import AnimatedMessage from "@/components/AnimatedMessage";
import AppScreen from "@/components/AppScreen";
import { colors } from "@/styles/theme";
import RotatingMessage from "@/components/RotatingMessage";


const { width } = Dimensions.get("window");
type IconName = keyof typeof MaterialCommunityIcons.glyphMap;


// ------ CircleCard components -----
const CircleCard = ({
  icon,
  label,
  color,
  onPress,
}: {
  icon: IconName;
  label: string;
  color: string;
  onPress: () => void;
}) => {
  const scale = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start(() => onPress());
  };

  return (
    <Animated.View style={[styles.circleCard, { transform: [{ scale }] }]}>
      <TouchableOpacity onPressIn={handlePressIn} onPressOut={handlePressOut} style={styles.circleTouchable}>
        <MaterialCommunityIcons name={icon} size={42} color={color} />
        <Text style={[styles.circleLabel, { color }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};
// --------- END of circleCard -------- //


const getTimeGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning ☀️";
  if (hour < 18) return "Good Afternoon 🌤️";
  return "Good Evening 🌙";
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    
    <AppScreen showBottomNav={false}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Image
          source={require("../assets/images/smart_home_logo_vibrant.png")}
          style={styles.logo}
        />
        <Text style={styles.greeting}>{getTimeGreeting()}</Text>
        <Text style={styles.welcomeText}>Welcome to SafetyHome</Text>
        <RotatingMessage />
        <LottieView
           source={require('../assets/animations/homeScreen.json')} // עדכן לשם הקובץ שלך
           autoPlay
           loop
           style={{ width: 220, height: 220, marginBottom: 10 }}
         />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.circleScroll}>
          <CircleCard
            icon="login"
            label="Sign In"
            color="#4CAF50"
            onPress={() => router.push("./UserForm")}
            />
          <CircleCard
            icon="shield"
            label="Intro"
            color="#FF5722"
            onPress={() => router.push("./IntroToScan")}
          />
          <CircleCard
            icon="help-circle"
            label="FAQ"
            color="#3498db"
            onPress={() => router.push("./FAQscreen")}
          />
        </ScrollView>

        <View style={styles.dividerWithText}>
          <View style={styles.line} />
          <Text style={styles.dividerText}>Or sign up with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.authIconsRow}>
          <TouchableOpacity onPress={() => router.push("/AppleGoogle")}>
            <MaterialCommunityIcons name="google" size={36} color="#DB4437" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/AppleGoogle")}>
            <MaterialCommunityIcons name="apple" size={36} color="#000" />
          </TouchableOpacity>
        </View> 

      </ScrollView>
    </AppScreen>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 50,
    paddingHorizontal: 20,
    justifyContent: "flex-start",
  },
  
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
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
    color: "dark-grey",
    marginBottom: 5,
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "dark-grey",
    marginBottom: 25,
    textAlign: "center",
  },
 
  circleScroll: {
  paddingHorizontal: 10,
  gap: 15,
},

  circleCard: {
    alignItems: "center",
    marginHorizontal: 10,
  },

  circleTouchable: {
    width: 90,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },

  circleLabel: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: "600",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  dividerWithText: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  authIconsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 25,
    marginBottom: 30,
  },
  
});
