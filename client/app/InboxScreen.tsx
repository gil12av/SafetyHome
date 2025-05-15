import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TextInput, Button, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { getMessages, sendMessage, getAllUsers } from "@/services/api";
import AppScreen from "@/components/AppScreen";
import MessageCard from "@/components/ui/social/MessageCard";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InboxScreen() {
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

  type User = {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };


    const [messages, setMessages] = useState<any[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [content, setContent] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [dropdownItems, setDropdownItems] = useState<any[]>([]);
  
    const loadMessages = async () => {
      const data = await getMessages();
      setMessages(data);
    };
  
    const loadUsers = async () => {
      const data = await getAllUsers();
      setUsers(data);
      setDropdownItems(
        data.map((u: any) => ({
          label: `${u.firstName} ${u.lastName}`,
          value: u._id,
        }))
      );
    };
  
    const handleSend = async () => {
      if (!selectedUserId || !content.trim()) return;
      await sendMessage({ recipientId: selectedUserId, content });
      setContent("");
      setSelectedUserId(null);
      setModalVisible(false);
      loadMessages();
    };
  
    useEffect(() => {
      loadMessages();
      loadUsers();
    }, []);
  
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <AppScreen
          title="Inbox"
          showBackButton
          rightIcon={
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
            </TouchableOpacity>
          }
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12 }}
            renderItem={({ item }) => (
              <MessageCard message={item} onRead={loadMessages} />
            )}
          />
  
          <Modal visible={modalVisible} animationType="slide">
            <SafeAreaView style={styles.modal}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                <MaterialIcons name="close" size={24} />
              </TouchableOpacity>
  
              <Text style={styles.modalTitle}>שליחת הודעה</Text>
  
              <DropDownPicker
                open={dropdownOpen}
                setOpen={setDropdownOpen}
                value={selectedUserId}
                setValue={setSelectedUserId}
                items={dropdownItems}
                setItems={setDropdownItems}
                placeholder="בחר משתמש..."
                searchable
                style={styles.dropdown}
                dropDownContainerStyle={{ marginBottom: 12 }}
              />
  
              <TextInput
                style={styles.input}
                placeholder="תוכן ההודעה"
                value={content}
                multiline
                numberOfLines={4}
                onChangeText={setContent}
              />
  
              <Button title="שלח" onPress={handleSend} />
            </SafeAreaView>
          </Modal>
        </AppScreen>
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    modal: {
      flex: 1,
      padding: 16,
      backgroundColor: "#fff",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 16,
    },
    closeBtn: {
      alignSelf: "flex-end",
    },
    dropdown: {
      marginBottom: 16,
      zIndex: 10,
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 8,
      padding: 10,
      marginBottom: 16,
      textAlignVertical: "top",
    },
  });
  