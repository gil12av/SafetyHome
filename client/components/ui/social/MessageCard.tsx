import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "@/context/AuthContext";

type Message = {
  _id: string;
  content: string;
  isRead: boolean;
  isSystem: boolean;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  createdAt: string;
};

type Props = {
  message: Message;
  onRead: () => void;
};

export default function MessageCard({ message, onRead }: Props) {
  const { user } = useAuth();
  if (!user) return null;

  const isSentByMe = message.sender._id === user._id;
  const isSystem = message.isSystem;

  return (
    <View style={[styles.container, isSentByMe ? styles.alignRight : styles.alignLeft]}>
      <View
        style={[
          styles.bubble,
          isSystem
            ? styles.systemBubble
            : isSentByMe
            ? styles.sentBubble
            : styles.receivedBubble,
        ]}
      >
        {!isSentByMe && !isSystem && (
          <Text style={styles.sender}>
            {message.sender.firstName} {message.sender.lastName}
            {message.sender.role === "admin" ? " (Admin)" : ""}
          </Text>
        )}

        <Text style={styles.content}>{message.content}</Text>

        {isSentByMe && (
          <Text style={styles.status}>
            {message.isRead ? "✔✔ Read" : "✔ Sent"}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  alignRight: {
    alignItems: "flex-end",
  },
  alignLeft: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 10,
  },
  sentBubble: {
    backgroundColor: "#DCF8C6",
  },
  receivedBubble: {
    backgroundColor: "#f1f0f0",
  },
  systemBubble: {
    backgroundColor: "#ffe4b5",
    borderLeftWidth: 4,
    borderLeftColor: "#e67e22",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 4,
    color: "#555",
  },
  content: {
    fontSize: 14,
  },
  status: {
    fontSize: 10,
    color: "#999",
    marginTop: 6,
    textAlign: "right",
  },
});
