import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { askGpt, getGptHistory } from "@/services/api.jsx";
import AppScreen from "@/components/AppScreen";

interface GptMessage {
  _id: string;
  sender: "user" | "bot";
  content: string;
}

export default function TalkWithBot() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<GptMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList<GptMessage> | null>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await getGptHistory();
        setMessages(history);
      } catch (err) {
        console.warn("No history found");
      }
    };
    loadHistory();
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage: GptMessage = {
      _id: Date.now().toString(),
      sender: "user",
      content: input,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await askGpt(input);
      const botMessage: GptMessage = {
        _id: Date.now().toString() + "-bot",
        sender: "bot",
        content: response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const errorMsg: GptMessage = {
        _id: Date.now().toString() + "-error",
        sender: "bot",
        content: "❌ Theres an error, please try again later.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }: { item: GptMessage }) => (
    <View
      style={[
        styles.bubble,
        item.sender === "user" ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text style={styles.text}>{item.content}</Text>
    </View>
  );


  return (
    <AppScreen title="Talk with Bot" showBackButton>
      <Text style={styles.header}>🧠 Ask question about home safety and how to secure devices </Text>
      <Text style={styles.subtext}>Please ask relevant qustion only. Bot will answer immediately </Text>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.chatContainer}
      />

      {loading && (
        <ActivityIndicator size="small" color="gray" style={{ marginBottom: 10 }} />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask anything you want to know.."
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Text style={styles.sendText}>send</Text>
        </TouchableOpacity>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtext: {
    fontSize: 13,
    color: "#666",
    marginBottom: 12,
  },
  chatContainer: {
    paddingBottom: 100,
  },
  bubble: {
    marginVertical: 6,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#cce5ff",
  },
  botBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e2e2e2",
  },
  text: {
    fontSize: 15,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 90, // ⬅️ היה מוסתר – עכשיו יושב בדיוק מעל ה־navbar
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 6,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#007bff",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  sendText: {
    color: "white",
    fontWeight: "bold",
  },
});
