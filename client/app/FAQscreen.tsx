import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Animated, { FadeInRight } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import ScreenWithBackButton from "../components/ScreenWithBackButton";
import { useRouter } from "expo-router"; // ✅ חדש

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const router = useRouter(); // ✅ חדש

  const faqs = [
    {
      question: "מהי מטרת האפליקציה?",
      answer: "האפליקציה מספקת סריקה מתקדמת לרשת הביתית שלך ומזהה מכשירים לא מאובטחים.",
      icon: "shield-lock-outline",
    },
    {
      question: "איך אני סורק את הרשת שלי?",
      answer: "לחץ על כפתור 'סריקה' בדף הבית – ותקבל דו״ח אבטחה מידי.",
      icon: "radar",
    },
    {
      question: "האם הפרטים האישיים שלי נשמרים?",
      answer: "הנתונים שלך נשמרים בצורה מוצפנת ואינם מועברים לצד שלישי.",
      icon: "lock-check-outline",
    },
    {
      question: "מה קורה אם מתגלה בעיה באבטחה?",
      answer: "תקבל התראה עם הסבר על הבעיה והצעות לפתרון מיידי.",
      icon: "alert-decagram-outline",
    },
    {
      question: "איך אפשר ליצור קשר?",
      answer: "בעתיד תתווסף אופציה לפנייה ישירה מתוך האפליקציה.",
      icon: "email-outline",
    },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderItem = ({ item, index }: { item: typeof faqs[0]; index: number }) => (
    <Animated.View entering={FadeInRight} style={styles.faqItem}>
      <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.faqHeader}>
        <Icon name={item.icon} size={28} color="#4A90E2" style={{ marginRight: 10 }} />
        <Text style={styles.question}>{item.question}</Text>
        <Icon
          name={expandedIndex === index ? "chevron-up" : "chevron-down"}
          size={24}
          color="#4A90E2"
          style={{ marginLeft: "auto" }}
        />
      </TouchableOpacity>
      {expandedIndex === index && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
    </Animated.View>
  );

  const openPrivacyPolicy = () => {
    router.push("/TermsScreen"); // ✅ שינוי לניווט פנימי
  };

  return (
    <ScreenWithBackButton title="שאלות נפוצות">
      <LinearGradient colors={["#e0f7fa", "#ffffff"]} style={styles.container}>
        <View style={styles.headerBox}>
          <Icon name="comment-question-outline" size={36} color="#007BFF" />
          <Text style={styles.headerTitle}>מידע חשוב על האפליקציה</Text>
        </View>

        <FlatList
          data={faqs}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        />

        <View style={styles.termsBox}>
          <Icon name="file-document-outline" size={30} color="#007BFF" />
          <Text style={styles.termsTitle}>תנאי שימוש</Text>
          <Text style={styles.termsText}>
            השימוש באפליקציה מהווה הסכמה לתנאים שלנו. אנו מתחייבים לשמירה על פרטיותך ואבטחת המידע שלך.
          </Text>
          <TouchableOpacity onPress={openPrivacyPolicy}>
            <Text style={styles.termsLink}>למד עוד</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </ScreenWithBackButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerBox: {
    alignItems: "center",
    marginBottom: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007BFF",
    marginTop: 10,
  },
  faqItem: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  answerContainer: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  answer: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  termsBox: {
    marginTop: 30,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  termsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: "#007BFF",
  },
  termsText: {
    fontSize: 14,
    color: "#333",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 20,
  },
  termsLink: {
    marginTop: 12,
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});

export default FAQScreen;
