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
import { useRouter } from "expo-router";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const router = useRouter();

  const faqs = [
    {
      question: "What is the purpose of the app?",
      answer: "The app provides an advanced scan of your home network and detects unsecured devices.",
      icon: "shield-lock-outline",
    },
    {
      question: "How do I scan my network?",
      answer: "Press the 'Scan' button on the home page – and get an immediate security report.",
      icon: "radar",
    },
    {
      question: "Are my personal details stored?",
      answer: "Your data is stored securely and is not shared with third parties.",
      icon: "lock-check-outline",
    },
    {
      question: "What happens if a security issue is found?",
      answer: "You will receive an alert with an explanation and suggestions for immediate action.",
      icon: "alert-decagram-outline",
    },
    {
      question: "How can I contact support?",
      answer: "A contact feature will be added to the app in the near future.",
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
    router.push("/TermsScreen");
  };

  return (
    <ScreenWithBackButton title="Frequently Asked Questions">
      <LinearGradient colors={["#e0f7fa", "#ffffff"]} style={styles.container}>
        <View style={styles.headerBox}>
          <Icon name="comment-question-outline" size={36} color="#007BFF" />
          <Text style={styles.headerTitle}>Important Information About the App</Text>
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
          <Text style={styles.termsTitle}>Terms of Use</Text>
          <Text style={styles.termsText}>
            Using the app constitutes acceptance of our terms. We are committed to protecting your privacy and data.
          </Text>
          <TouchableOpacity onPress={openPrivacyPolicy}>
            <Text style={styles.termsLink}>Learn more</Text>
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
