import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { getConversation, sendMessage } from "@/services/api";
import AppScreen from "@/components/AppScreen";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/context/AuthContext";

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
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <View style={styles.inputBox}>
        <TextInput
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
  message: { padding: 10, borderRadius: 8, marginBottom: 10, maxWidth: "70%" },
  sent: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  received: { backgroundColor: "#f1f0f0", alignSelf: "flex-start" },
  msgText: { fontSize: 15 },
  time: { fontSize: 10, marginTop: 4, color: "#666" },
  inputBox: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd" },
  input: { flex: 1, borderColor: "#ccc", borderWidth: 1, borderRadius: 6, paddingHorizontal: 8, marginRight: 8 },
});
