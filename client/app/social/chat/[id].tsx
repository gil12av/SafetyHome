import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { getConversation, sendMessage } from "@/services/api.jsx";
import AppScreen from "@/components/AppScreen";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { MaterialCommunityIcons } from '@expo/vector-icons';



type Message = {
  _id: string;
  content: string;
  createdAt: string;
  sender: { _id: string; firstName: string; lastName: string };
};

export default function ChatScreen() {
  const { id: otherUserId } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    console.log("🚀 loading conversation with", otherUserId);
    loadMessages();
  }, [otherUserId]);

  const loadMessages = async () => {
    if (!otherUserId) return;
    const res = await getConversation(otherUserId);
    console.log("💬 got conversation:", res);
    setMessages(res);
  };

  const handleSend = async () => {
    if (!text.trim() || !otherUserId) return;
    await sendMessage({ recipientId: otherUserId, content: text });
    setText("");
    loadMessages();
  };

  if (!user) return null;

  const renderItem = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.message,
        item.sender._id === user._id ? styles.sent : styles.received,
      ]}
    >
      <Text style={styles.msgText}>{item.content}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
  <AppScreen title="Chat" showBackButton>
   <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={{ flex: 1 }}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        />
        <View style={styles.inputBox}>
          <TextInput
            value={text}
            onChangeText={setText}
            style={styles.input}
            placeholder="Type a message..."
          />
          <TouchableOpacity onPress={handleSend} style={{ padding: 6 }}>
            <MaterialCommunityIcons name="send" size={24} color="#007bff" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
</AppScreen>

  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  message: { padding: 10, borderRadius: 8, marginBottom: 10, maxWidth: "70%" },
  sent: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  
  received: {
    backgroundColor: "#fff",
    alignSelf: "flex-start",
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#eee",
  },
  
  msgText: {
    fontSize: 15,
    color: "#333",
  },
  
  time: {
    fontSize: 10,
    color: "#888",
    marginTop: 4,
    alignSelf: "flex-end",
  },
  
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    paddingBottom: Platform.OS === "ios" ? 20 : 12,
    marginBottom: 70,
  },
  
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  
  
});
