import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { FadeInRight } from "react-native-reanimated";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

const sections = [
  {
    title: "שמירה על פרטיות",
    text: "אנו מתחייבים לאיסוף ושמירה של הנתונים שלך באופן מאובטח. המידע לא יועבר לגורמים שלישיים ללא אישורך.",
    icon: "lock-outline",
  },
  {
    title: "שימוש הוגן",
    text: "אין להשתמש באפליקציה למטרות מזיקות או בלתי חוקיות. כל שימוש לרעה יוביל לחסימה.",
    icon: "scale-balance",
  },
  {
    title: "אחריות מוגבלת",
    text: "המפתחים אינם אחראים לכל נזק ישיר או עקיף כתוצאה משימוש באפליקציה או מהמידע שמופק דרכה.",
    icon: "alert-circle-outline",
  },
  {
    title: "עדכונים עתידיים",
    text: "ייתכנו שינויים בתנאים אלו. כל שינוי יפורסם וייכנס לתוקף מיידית.",
    icon: "update",
  },
];

export default function TermsScreen() {
  return (
    <ScreenWithBackButton title="תנאי שימוש">
      <LinearGradient colors={["#e0f7fa", "#ffffff"]} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.headerBox}>
            <Icon name="file-document-multiple-outline" size={44} color="#007BFF" />
            <Text style={styles.headerText}>תנאי שימוש באפליקציה</Text>
            <Text style={styles.subText}>עודכן לאחרונה: מרץ 2025</Text>
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
