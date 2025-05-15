import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { markMessageAsRead } from "@/services/api";

type Message = {
    _id: string;
    content: string;
    isRead: boolean;
    isSystem: boolean;
    sender: {
      firstName: string;
      lastName: string;
      role: string;
    };
  };
  
  type Props = {
    message: Message;
    onRead: () => void;
  };
  
  export default function MessageCard({ message, onRead }: Props) {
  const handleRead = async () => {
    if (!message.isRead) {
      await markMessageAsRead(message._id);
      onRead?.();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.card, message.isRead ? styles.read : styles.unread]}
      onPress={handleRead}
    >
      <Text style={[styles.sender, message.isSystem && styles.systemSender]}>
        {message.isSystem ? "System Message" : `${message.sender.firstName} ${message.sender.lastName}`}
      </Text>
      <Text style={styles.content}>{message.content}</Text>
      <Text style={styles.status}>
        {message.isRead ? "✔✔ Read" : "✔ Unread"}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  unread: {
    backgroundColor: "#fef4e7",
  },
  read: {
    backgroundColor: "#e7f4ef",
  },
  sender: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  systemSender: {
    color: "#d35400",
  },
  content: {
    fontSize: 14,
    marginBottom: 6,
  },
  status: {
    fontSize: 12,
    textAlign: "right",
    color: "#888",
  },
});
