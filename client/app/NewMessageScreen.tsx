import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { getAllUsers, getMessages } from "@/services/api.jsx";
import AppScreen from "@/components/AppScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";



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
    <View style={{ flex: 1, backgroundColor: "#f9f9f9", paddingHorizontal: 16, paddingTop: 10 }}>
      
      <Text style={styles.header}>💬 Start a New Conversation</Text>
      <View style={{ zIndex: 2000 }}>
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
              Alert.alert("✅ Starting chat", "Redirecting to conversation...");
              navigateToChat(value);
            }
          }}
          dropDownDirection="AUTO"
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
        />
      </View>
  
      <Text style={styles.header}>📨 Existing Chats</Text>
      <View style={{ height: 1, backgroundColor: "#ccc", marginBottom: 10 }} />
  
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.user._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigateToChat(item.user._id)}
          >
            <View>
              <Text style={styles.name}>
                {item.user.firstName} {item.user.lastName}
              </Text>
              <Text style={styles.preview}>{item.lastMessage}</Text>
            </View>
            <MaterialCommunityIcons name="chat-outline" size={22} color="#007bff" />
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 140 }}
      />
  
    </View>
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
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },
  preview: {
    color: "#555",
    fontStyle: "italic",
    marginTop: 6,
  },

  dropdown: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  
  dropdownContainer: {
    borderColor: "#ccc",
    borderRadius: 10,
    zIndex: 1000,
  },
  
});
