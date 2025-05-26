import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native";
import { getNotifications, markNotificationAsRead } from "@/services/api.jsx";
import { useRouter } from "expo-router";
import AppScreen from "@/components/AppScreen";

type Notification = {
    _id: string;
    type: "like" | "comment" | "message";
    isRead: boolean;
    createdAt: string;
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
    };
    post?: {
      _id: string;
    } | string;
  };
  

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<Notification[]>([]);  // טיפוס רשום כאן!
  const router = useRouter();

  const load = async () => {
    try {
      console.log("🔔 fetching notifications…");
      const data = await getNotifications();
      console.log("📬 got:", data);
      setNotifications(data);
    } catch (err) {
      console.error("Error loading notifications:", err);
    }
  };

  const handlePress = async (notif: Notification) => {
    console.log("▶️ pressed notification:", notif);
    await markNotificationAsRead(notif._id);
  
    if (notif.type === "message") {
      router.push({ pathname: "/social/chat/[id]", params: { id: notif.sender._id } });
    } else if ((notif.type === "like" || notif.type === "comment") && notif.post) {
      // עדכון כאן - לוודא שה־post הוא אובייקט או מזהה תקני
      const postId = typeof notif.post === "object" ? notif.post._id : notif.post;
      console.log("➡️ navigating to post:", postId);
      router.push({ pathname: "/social/post/[id]", params: { id: postId } });
    } else {
      Alert.alert("Oops", "אין יעד מתאים להתראה זו");
    }
  };
  

  useEffect(() => {
    load();
  }, []);

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.card, !item.isRead && styles.unread]}
      onPress={() => handlePress(item)}
    >
      <Text style={styles.text}>
        {item.type === "like" && `${item.sender.firstName} liked your post`}
        {item.type === "comment" && `${item.sender.firstName} commented on your post`}
        {item.type === "message" && `${item.sender.firstName} sent you a message`}
      </Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <AppScreen title="Notifications" showBackButton>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>אין התראות כרגע</Text>}
        contentContainerStyle={{ padding: 16 }}
      />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: "#f2f2f2", borderRadius: 10, padding: 14, marginBottom: 10 },
  unread: { backgroundColor: "#e6f7ff" },
  text: { fontSize: 16, fontWeight: "500", marginBottom: 6 },
  time: { fontSize: 12, color: "#666" },
  empty: { marginTop: 40, fontSize: 16, textAlign: "center", color: "#888" },
});
