import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";

const questions = [
  {
    id: 1,
    question: "האם שינית אי פעם את סיסמת הראוטר שלך?",
    type: "yesno",
  },
  {
    id: 2,
    question: "האם אתה יודע אילו מכשירים מחוברים לרשת הביתית שלך?",
    type: "yesno",
  },
  {
    id: 3,
    question: "עד כמה אתה מרגיש בטוח מבחינת אבטחת הרשת?",
    type: "scale",
    scaleMin: 1,
    scaleMax: 5,
    labels: ["לא בטוח בכלל", "מאוד בטוח"],
  },
];

const SurveyScreen = () => {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, string | number>>({});

  const handleAnswer = (questionId: number, answer: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = () => {
    console.log("📋 תשובות שהוזנו:", answers);
    router.push("/IntroToScan");
  };

  return (
    <ScreenWithBackButton title="שאלון אבטחה">
      <ScrollView contentContainerStyle={styles.container}>
        {questions.map((q) => (
          <View key={q.id} style={styles.questionCard}>
            <Text style={styles.questionText}>{q.question}</Text>
            {q.type === "yesno" ? (
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    answers[q.id] === "כן" && styles.selectedButton,
                  ]}
                  onPress={() => handleAnswer(q.id, "כן")}
                >
                  <Text style={styles.optionText}>כן</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    answers[q.id] === "לא" && styles.selectedButton,
                  ]}
                  onPress={() => handleAnswer(q.id, "לא")}
                >
                  <Text style={styles.optionText}>לא</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.optionsRow}>
                {Array.from({ length: q.scaleMax ?? 5 }, (_, i) => i + 1).map((val) => (
                  <TouchableOpacity
                    key={String(val)}
                    style={[
                      styles.optionButton,
                      answers[q.id] === val && styles.selectedButton,
                    ]}
                    onPress={() => handleAnswer(q.id, val)}
                  >
                    <Text style={styles.optionText}>{String(val)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={Object.keys(answers).length !== questions.length}
        >
          <Text style={styles.submitButtonText}>סיים והמשך</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWithBackButton>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  submitButton: {
    backgroundColor: "#007BFF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SurveyScreen;
