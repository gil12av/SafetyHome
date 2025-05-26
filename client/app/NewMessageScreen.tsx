import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getAllUsers, getMessages } from "@/services/api.jsx";
import AppScreen from "@/components/AppScreen";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
};

type Message = {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  createdAt: string;
};

type Conversation = {
  user: User;
  lastMessage: string;
  time: string;
};

type DropDownItem = {
  label: string;
  value: string;
};

export default function NewMessageScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [users, setUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<DropDownItem[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const usersList: User[] = await getAllUsers();
      const dropDownItems: DropDownItem[] = usersList
        .filter((u) => u._id !== user?._id)
        .map((u) => ({
          label: `${u.firstName} ${u.lastName}`,
          value: u._id,
        }));
      setUsers(usersList);
      setItems(dropDownItems);
    };

    const loadConversations = async () => {
      const messages: Message[] = await getMessages();
      const uniqueMap: { [key: string]: Conversation } = {};

      messages.forEach((msg) => {
        const other =
        msg.sender._id === user?._id ? msg.recipient : msg.sender
        if (!uniqueMap[other._id]) {
          uniqueMap[other._id] = {
            user: other,
            lastMessage: msg.content,
            time: msg.createdAt,
          };
        }
      });

      setConversations(Object.values(uniqueMap));
    };

    loadUsers();
    loadConversations();
  }, []);

  const navigateToChat = (userId: string) => {
    router.push({ pathname: "/social/chat/[id]", params: { id: userId } });
  };

  return (
    <AppScreen title="New Message" showBackButton>
      <Text style={styles.header}>📨 Chat : </Text>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.user._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigateToChat(item.user._id)}
          >
            <Text style={styles.name}>
              {item.user.firstName} {item.user.lastName}
            </Text>
            <Text style={styles.preview}>{item.lastMessage}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.header}>💬 Send New Message :</Text>
      <DropDownPicker
        open={open}
        value={selectedUserId}
        items={items}
        setOpen={setOpen}
        setValue={setSelectedUserId}
        setItems={setItems}
        placeholder="Choose user to send"
        onChangeValue={(value) => {
          if (typeof value === "string") {
            navigateToChat(value);
          }
        }}
        style={styles.dropdown}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
  },
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
  },
  preview: {
    color: "#666",
    marginTop: 4,
  },
  dropdown: {
    zIndex: 1000,
  },
});
