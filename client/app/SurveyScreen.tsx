import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import AppScreen from "@/components/AppScreen";
import { colors, spacing } from "@/styles/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


export default function SurveyScreen() {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const router = useRouter();


  const handleSelect = (questionId: string, value: number | string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = () => {
    console.log("Survey submitted:", answers);
    alert("Thank you! We'll use this to improve your experience.");
    router.push("/Dashboard");
  };

  return (
    <AppScreen title="Security Survey" showBackButton>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.introText}>Based on the answer of this survey, I will give you some tips to start.</Text>

        <View style={styles.card}>
          <Text style={styles.question}>1. How secure do you feel your smart home is?</Text>
          <View style={styles.optionsRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => handleSelect("q1", val)}
                style={[styles.option, answers["q1"] === val && styles.selectedOption]}
              >
                <Text style={styles.optionText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>2. How often do you update your devices?</Text>
          <View style={styles.optionsRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => handleSelect("q2", val)}
                style={[styles.option, answers["q2"] === val && styles.selectedOption]}
              >
                <Text style={styles.optionText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>3. How aware are you of device vulnerabilities?</Text>
          <View style={styles.optionsRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                onPress={() => handleSelect("q3", val)}
                style={[styles.option, answers["q3"] === val && styles.selectedOption]}
              >
                <Text style={styles.optionText}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.question}>4. What’s one thing you’d improve?</Text>
          <TextInput
            placeholder="Write up to 100 characters..."
            placeholderTextColor={colors.text}
            maxLength={100}
            multiline
            style={styles.textInput}
            onChangeText={(val) => handleSelect("q4", val)}
          />
        </View>

        <Text style={styles.aiTitle}>מענה של AI</Text>
        <View style={styles.aiBox}>
          <Text style={styles.aiText}>
            Based on your answers, consider checking your router’s firmware, enabling device authentication,
            and performing scans regularly to reduce risk.
          </Text>
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit Survey</Text>
        </TouchableOpacity>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  introText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    elevation: 2,
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.header,
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  option: {
    backgroundColor: "#e5e5ea", // אפור בהיר קבוע
    padding: 12,
    borderRadius: 10,
    width: 48,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.divider,
  },
  selectedOption: {
    backgroundColor: colors.primary,
  },
  optionText: {
    color: colors.textLight,
    fontWeight: "bold",
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.divider,
    borderRadius: 10,
    padding: 10,
    fontSize: 14,
    color: colors.text,
    minHeight: 80,
    textAlignVertical: "top",
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: 8,
  },
  aiBox: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  aiText: {
    fontSize: 14,
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
