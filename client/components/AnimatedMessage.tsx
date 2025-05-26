import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

const { width } = Dimensions.get("window");

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const messages: { text: string; icon: IconName; color: string }[] = [
  { text: " Your smart home, simplified ", icon: "home", color: "#6E7E85" },
  { text: " Track and secure your devices ", icon: "lock-outline", color: "#90A4AE" },
  { text: " Stay updated with smart alerts ", icon: "bell-outline", color: "#78909C" },
];

export default function AnimatedMessage() {
  const [index, setIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

    useEffect(() => {
        const fullText = messages[index].text.trim(); // נסיר רווחים עודפים
        let charIndex = 0;
      
        setTypedText(fullText[0]); // שים את האות הראשונה מיד
      
        const typingInterval = setInterval(() => {
          charIndex++;
          if (charIndex < fullText.length) {
            setTypedText((prev) => prev + fullText[charIndex]);
          } else {
            clearInterval(typingInterval);
          }
        }, 60);
      
        const switchTimeout = setTimeout(() => {
          setIndex((prev) => (prev + 1) % messages.length);
        }, 4000);
      
        return () => {
          clearInterval(typingInterval);
          clearTimeout(switchTimeout);
        };
      }, [index]);

  const currentMessage = messages[index];

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      key={index}
      style={[styles.container, { backgroundColor: currentMessage.color + "22" }]} // שקיפות
    >
      <MaterialCommunityIcons
        name={currentMessage.icon}
        size={36}
        color={currentMessage.color}
      />
      <Text style={[styles.text, { color: currentMessage.color }]}>{typedText}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    width: width * 0.9,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  text: {
    fontSize: 20,
    marginLeft: 15,
    fontWeight: "500",
  },
});
