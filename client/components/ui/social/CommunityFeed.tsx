import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { getAllPosts } from "@/services/api";
import PostCard from "./Post_card";
import PostInput from "./Post_input";
import { Post } from "../../../constants/types"

export default function CommunityFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  const loadPosts = async () => {
    const data = await getAllPosts();
    setPosts(data);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>👥 Community Feed</Text>
      <PostInput onPostCreated={loadPosts} />
      <ScrollView>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} onLikeUpdated={loadPosts} onPostUpdated={loadPosts} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
});
