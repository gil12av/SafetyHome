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
} from "@/services/api";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { RectButton, GestureHandlerRootView } from "react-native-gesture-handler";
import CommentSection from "./CommentSection";
import { useAuth } from "@/context/AuthContext";

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

  const handleLike = async () => {
    await toggleLike(post._id);
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
      <Swipeable renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}>
        <View style={styles.card}>
          <Text style={styles.name}>
            {post.userId.firstName} {post.userId.lastName}
          </Text>
          <Text style={styles.time}>{timeAgo}</Text>

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

          {post.imageUrl && (
            <Image source={{ uri: post.imageUrl }} style={styles.image} resizeMode="cover" />
          )}

          {post.link && (
            <TouchableOpacity onPress={() => Linking.openURL(post.link)}>
              <Text style={styles.link}>{post.link}</Text>
            </TouchableOpacity>
          )}

          {!isEditing && (
            <>
              <View style={styles.actionsRow}>
                <TouchableOpacity onPress={handleLike} style={styles.likeBtn}>
                  <MaterialCommunityIcons
                    name={hasLiked ? "thumb-up" : "thumb-up-outline"}
                    size={20}
                    color={hasLiked ? "#007BFF" : "#4A90E2"}
                  />
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
    marginBottom: 16,
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 3,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginBottom: 8,
  },
  content: {
    fontSize: 15,
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 8,
    marginBottom: 10,
  },
  link: {
    color: "#2e86de",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    marginLeft: 4,
    color: "#4A90E2",
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
});
