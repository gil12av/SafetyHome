import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, LayoutAnimation, UIManager, Platform, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import ScreenWithBackButton from "../components/ScreenWithBackButton";
import globalStyles from "@/styles/globalStyles";

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQScreen = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    { question: "מהי מטרת האפליקציה?", answer: "האפליקציה נועדה לסייע באבטחת הבית החכם." },
    { question: "כיצד ניתן לסרוק רכיבים?", answer: "לחץ על 'סרוק רכיבים' בתפריט." },
    { question: "כיצד ניתן להתנתק?", answer: "לחץ על כפתור התנתקות בתפריט הצד." },
  ];

  const toggleExpand = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const renderItem = ({ item, index }: { item: typeof faqs[0], index: number }) => (
    <Animated.View entering={LightSpeedInRight} style={styles.faqItem}>
      <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.faqHeader}>
        <Icon name={expandedIndex === index ? "expand-less" : "expand-more"} size={24} color="#007BFF" />
        <Text style={styles.question}>{item.question}</Text>
      </TouchableOpacity>
      {expandedIndex === index && (
        <View style={styles.answerContainer}>
          <Text style={styles.answer}>{item.answer}</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <ScreenWithBackButton title="שאלות נפוצות" style={globalStyles.screenContainer}>
      <View style={globalStyles.screenContainer}>
        <FlatList
          data={faqs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </ScreenWithBackButton>
  );
};

const styles = StyleSheet.create({
  faqItem: {
    marginBottom: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 10,
  },
  answerContainer: {
    marginTop: 10,
  },
  answer: {
    fontSize: 14,
    color: "#555",
  },
});

export default FAQScreen;
