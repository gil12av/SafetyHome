import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  TextInput,
  Button,
} from "react-native";
import {
  toggleLike,
  deletePost,
  updatePost,
} from "@/services/api.jsx";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton, GestureHandlerRootView } from "react-native-gesture-handler";
import CommentSection from "./CommentSection";
import { useAuth } from "@/context/AuthContext";
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from "react-native-reanimated";


type Props = {
  post: any;
  onLikeUpdated: () => void;
  onPostUpdated: () => void;
};

export default function PostCard({ post, onLikeUpdated, onPostUpdated }: Props) {
  const { user } = useAuth();
  const isOwner = user?._id === post.userId._id;
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const likeScale = useSharedValue(1);

  const animatedLikeStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
    };
  });

  const handleLike = async () => {
    // אנימציית bounce
    likeScale.value = withSpring(1.3, {}, () => {
      likeScale.value = withSpring(1);
    });
    // פעולה אסינכרונית לשמירה במסד
    await toggleLike(post._id);
    // עדכון לאחר לייק
    onLikeUpdated?.();
  };
  

  const confirmDelete = () => {
    Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deletePost(post._id);
          onPostUpdated?.();
        },
      },
    ]);
  };

  const handleUpdate = async () => {
    await updatePost(post._id, {
      content: editedContent,
      imageUrl: post.imageUrl,
      link: post.link,
    });
    setIsEditing(false);
    onPostUpdated?.();
  };

  const renderRightActions = () =>
    isOwner && (
      <RectButton style={[styles.action, { backgroundColor: "#e74c3c" }]} onPress={confirmDelete}>
        <MaterialIcons name="delete" size={24} color="#fff" />
        <Text style={styles.actionText}>Delete</Text>
      </RectButton>
    );

  const renderLeftActions = () =>
    isOwner && (
      <RectButton style={[styles.action, { backgroundColor: "#2980b9" }]} onPress={() => setIsEditing(true)}>
        <MaterialIcons name="edit" size={24} color="#fff" />
        <Text style={styles.actionText}>Edit</Text>
      </RectButton>
    );

  const timeAgo = new Date(post.createdAt).toLocaleString();

  const hasLiked = post.likes.includes(user?._id);

  return (
    <GestureHandlerRootView>
      <Swipeable
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
      >
        <View style={styles.card}>
          {/* Header: Avatar + Name + Time */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6 }}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {post.userId.firstName.charAt(0)}
                {post.userId.lastName.charAt(0)}
              </Text>
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.name}>
                {post.userId.firstName} {post.userId.lastName}
              </Text>
              <Text style={styles.time}>{timeAgo}</Text>
            </View>
          </View>
  
          {/* Content or Edit mode */}
          {isEditing ? (
            <>
              <TextInput
                style={styles.input}
                value={editedContent}
                onChangeText={setEditedContent}
                multiline
              />
              <Button title="Save Changes" onPress={handleUpdate} />
            </>
          ) : (
            <Text style={styles.content}>{post.content}</Text>
          )}
  
          {/* Image */}
          {post.imageUrl && (
            <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
          )}
  
          {/* Link */}
          {post.link && (
            <TouchableOpacity style={styles.linkButton} onPress={() => Linking.openURL(post.link)}>
              <MaterialCommunityIcons name="link-variant" size={18} color="#007BFF" />
              <Text style={styles.linkText}>Open Link</Text>
            </TouchableOpacity>
          )}

  
          {/* Divider */}
          {!isEditing && <View style={styles.divider} />}
  
          {/* Like + Comments */}
          {!isEditing && (
            <>
              <View style={styles.actionsRow}>
              <TouchableOpacity onPress={handleLike} style={styles.likeBtn}>
                <Animated.View style={animatedLikeStyle}>
                  <MaterialCommunityIcons
                    name={hasLiked ? "thumb-up" : "thumb-up-outline"}
                    size={20}
                    color={hasLiked ? "#007BFF" : "#4A90E2"}
                  />
                </Animated.View>
                <Text style={styles.likeCount}>{post.likes.length}</Text>
              </TouchableOpacity>

              </View>
  
              <CommentSection postId={post._id} comments={post.comments} />
            </>
          )}
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
  
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 18,
    padding: 16,
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: "#eee",
  },

  name: {
    fontWeight: "700",
    fontSize: 17,
    color: "#2c3e50",
  },
  time: {
    fontSize: 12,
    color: "#aaa",
    marginBottom: 6,
  },

  content: {
    fontSize: 15,
    marginBottom: 10,
    lineHeight: 22,
    color: "#34495e",
  },
  link: {
    color: "#2980b9",
    fontWeight: "500",
    fontSize: 14,
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  linkText: {
    color: "#007BFF",
    marginLeft: 6,
    fontWeight: "600",
  },
  
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: 10,
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E6F0FF",
    paddingHorizontal: 50,
    paddingVertical: 9,
    borderRadius: 20,
  },
  likeCount: {
    marginLeft: 6,
    color: "#007BFF",
    fontWeight: "600",
  },
  
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  action: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 10,
  },
  
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  
});
