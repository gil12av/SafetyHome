import { router } from "expo-router";
import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import ScreenWithBackButton from "../components/ScreenWithBackButton";

const FAQScreen = () => {
  const faqs = [
    { question: "מהי מטרת האפליקציה?", answer: "האפליקציה נועדה לסייע באבטחת הבית החכם." },
    { question: "כיצד ניתן לסרוק רכיבים?", answer: "לחץ על 'סרוק רכיבים' בתפריט." },
    { question: "כיצד ניתן להתנתק?", answer: "לחץ על כפתור התנתקות בתפריט הצד." },
  ];

  return (
    <ScreenWithBackButton title= "  Home">
      onPress={() => router.push("/HomeScreen")}
      <View style={styles.container}>
        <FlatList
          data={faqs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.faqItem}>
              <Text style={styles.question}>{item.question}</Text>
              <Text style={styles.answer}>{item.answer}</Text>
            </View>
          )}
        />
      </View>
    </ScreenWithBackButton>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  faqItem: {
    marginBottom: 20,
  },
  question: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  answer: {
    fontSize: 14,
    color: "#555",
  },
});

export default FAQScreen;
