import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import { useRouter } from "expo-router";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import LottieView from "lottie-react-native";

const IntroToSecurityScreen = () => {
  const router = useRouter();

  const openVideo = () => {
    Linking.openURL("https://www.youtube.com/watch?v=eY4uYwC4ZLE");  // לאביעד - תבחר לינק ותחליף
  };

  return (
    <ScreenWithBackButton title="למה חשוב לסרוק?">
      <ScrollView contentContainerStyle={styles.container}>
      <LottieView
        source={require('../assets/animations/IntroToScan.json')}
            autoPlay
            loop
            style={{ width: 250, height: 250, marginBottom: 20 }}
        />
        <Text style={styles.header}>אבטחת הבית החכם שלך מתחילה כאן</Text>

        <Text style={styles.paragraph}>
          בעולם של היום, מכשירים חכמים כמו ראוטרים, מצלמות, ואפילו שואבי אבק חכמים עלולים להיפרץ בקלות אם לא נוקטים אמצעי זהירות.
        </Text>

        <Text style={styles.paragraph}>
          אחת הדרכים הנפוצות לפריצה היא שימוש בסיסמאות ברירת מחדל או גרסאות תוכנה לא מעודכנות.
        </Text>

        <Text style={styles.paragraph}>
          בעזרת סריקה פשוטה תוכל לדעת אילו מכשירים מחוברים לרשת שלך, ומהי רמת הסיכון שלהם.
        </Text>

        <TouchableOpacity style={styles.linkButton} onPress={openVideo}>
          <Text style={styles.linkButtonText}>🎬 צפה בסרטון הסברה קצר</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => router.push("/ScanScreen")}
        >
          <Text style={styles.startButtonText}>התחל סריקה ראשונה עכשיו</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWithBackButton>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 220,
    height: 220,
    marginBottom: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  paragraph: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  linkButton: {
    marginVertical: 20,
  },
  linkButtonText: {
    fontSize: 16,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  startButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default IntroToSecurityScreen;
