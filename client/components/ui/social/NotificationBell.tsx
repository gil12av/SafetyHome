import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { getNotifications } from "@/services/api"; // לוודא שיש


export default function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const notifs = await getNotifications();
        const relevant = notifs.filter((n: any) =>
          ["like", "comment", "message"].includes(n.type)
        );
        const unread = relevant.filter((n: any) => !n.isRead);
        setUnreadCount(unread.length);
      } catch (err) {
        console.error("Failed to load notifications:", err);
      }
    };
  
    fetchNotifications();
  }, []);
  

  return (
    <TouchableOpacity onPress={() => router.push("/NotificationsScreen")}>
      <View style={styles.bell}>
        <MaterialCommunityIcons name="bell-outline" size={26} color="#fff" />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bell: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    zIndex: 10,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
});
