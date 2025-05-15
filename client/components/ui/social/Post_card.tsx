import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { toggleLike } from "@/services/api";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Post } from "../../../constants/types";
import CommentSection from "./CommentSection";


type Props = {
  post: Post;
  onLikeUpdated: () => void;
};

export default function PostCard({ post, onLikeUpdated }: Props) {
  const handleLike = async () => {
    await toggleLike(post._id);
    onLikeUpdated?.();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{post.userId.firstName} {post.userId.lastName}</Text>
      <Text style={styles.content}>{post.content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleLike} style={styles.likeBtn}>
          <MaterialCommunityIcons name="thumb-up-outline" size={18} color="#4A90E2" />
          <Text style={styles.likeCount}>{post.likes.length}</Text>
          <CommentSection postId={post._id} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  name: {
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeBtn: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    marginLeft: 4,
    color: "#4A90E2",
  },
});
