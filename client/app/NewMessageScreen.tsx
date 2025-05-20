import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import AppScreen from "@/components/AppScreen";
import { getAllUsers, sendMessage } from "@/services/api";
import DropDownPicker from "react-native-dropdown-picker";
import { useRouter } from "expo-router";

type DropdownItem = {
    label: string;
    value: string;
  };

  
export default function NewMessageScreen() {
  const [users, setUsers] = useState<DropdownItem[]>([]);
  const [recipientId, setRecipientId] = useState(null);
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadUsers = async () => {
    const res = await getAllUsers();
    const options = res.map((u: any) => ({
      label: `${u.firstName} ${u.lastName}`,
      value: u._id,
    }));
    setUsers(options);
  };

  const handleSend = async () => {
    if (!recipientId || !message.trim()) return;
    setLoading(true);
    try {
      await sendMessage({ recipientId, content: message });
      Alert.alert("Success", "Message sent");
      setMessage("");
      setRecipientId(null);
      router.push({ pathname: "/social/chat/[id]", params: { id: recipientId } });
    } catch (err) {
      console.error("Failed to send message", err);
      Alert.alert("Error", "Could not send message");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <AppScreen title="Send Message" showBackButton>
      <View style={styles.container}>
        <Text style={styles.label}>Select Recipient:</Text>
        <DropDownPicker
          open={open}
          value={recipientId}
          items={users}
          setOpen={setOpen}
          setValue={setRecipientId}
          setItems={setUsers}
          placeholder="Choose user..."
          style={styles.dropdown}
        />

        <TextInput
          placeholder="Type your message..."
          style={styles.input}
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Button title="Send" onPress={handleSend} />
        )}
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    fontWeight: "600",
    marginBottom: 8,
  },
  dropdown: {
    marginBottom: 16,
    zIndex: 1000,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    minHeight: 60,
    textAlignVertical: "top",
    marginBottom: 12,
  },
});
