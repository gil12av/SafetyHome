import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { getMessages } from "@/services/api";
import AppScreen from "@/components/AppScreen";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Message = {
  _id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  recipient: {
    _id: string;
    firstName: string;
    lastName: string;
  };
};

type ConversationPreview = {
  user: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  unreadCount: number;
  lastMessage: Message;
};

export default function InboxScreen() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversationPreviews, setConversationPreviews] = useState<ConversationPreview[]>([]);
  const router = useRouter();

  const loadMessages = async () => {
    const data: Message[] = await getMessages();
    setMessages(data);

    const map = new Map<string, ConversationPreview>();

    data.forEach((msg: Message) => {
      if (!user) return;
      const otherUser = msg.sender._id === user._id ? msg.recipient : msg.sender;

      if (!map.has(otherUser._id)) {
        map.set(otherUser._id, {
          user: otherUser,
          unreadCount: !msg.isRead && msg.recipient._id === user._id ? 1 : 0,
          lastMessage: msg,
        });
      } else {
        const entry = map.get(otherUser._id)!;
        if (!msg.isRead && msg.recipient._id === user._id) {
          entry.unreadCount += 1;
        }
        if (new Date(msg.createdAt) > new Date(entry.lastMessage.createdAt)) {
          entry.lastMessage = msg;
        }
      }
    });

    setConversationPreviews(Array.from(map.values()));
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const goToChat = (otherUserId: string) => {
    router.push(`/chat/${otherUserId}` as any);

  };

  return (
    <AppScreen
      title="Inbox"
      showBackButton
      rightIcon={
        <TouchableOpacity onPress={() => router.push("/InboxScreen")}>

          <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
        </TouchableOpacity>
      }
    >
      <FlatList
        data={conversationPreviews}
        keyExtractor={(item) => item.user._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => goToChat(item.user._id)}
            style={styles.conversationRow}
          >
            <View style={styles.profileCircle}>
              <Text style={styles.initials}>
                {item.user.firstName[0]}
                {item.user.lastName[0]}
              </Text>
            </View>
            <View style={styles.textArea}>
              <Text style={styles.name}>
                {item.user.firstName} {item.user.lastName}
              </Text>
              <Text numberOfLines={1} style={styles.previewText}>
                {item.lastMessage.content}
              </Text>
            </View>
            {item.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>אין שיחות</Text>}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  conversationRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  profileCircle: {
    backgroundColor: "#4A90E2",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    color: "#fff",
    fontWeight: "bold",
  },
  textArea: {
    flex: 1,
    marginLeft: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
  },
  previewText: {
    color: "#666",
    fontSize: 13,
  },
  badge: {
    backgroundColor: "red",
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  empty: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
  },
});
