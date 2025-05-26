import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Alert } from "react-native";
import AppScreen from "@/components/AppScreen";
import { useLocalSearchParams } from "expo-router";
import { getPostById } from "@/services/api.jsx";
import PostCard from "@/components/ui/social/Post_card";

export default function PostDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      console.log("🟡 fetching post by id:", id);
      const data = await getPostById(id);
      console.log("🟢 got post:", data);
      setPost(data);
    } catch (err) {
      console.error("🔴 Failed to fetch post", err);
      Alert.alert("Error", "Could not load the post");
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) {
    return (
      <AppScreen title="Post" showBackButton>
        <ActivityIndicator size="large" />
      </AppScreen>
    );
  }

  if (!post) {
    return (
      <AppScreen title="Post" showBackButton>
        <View />
      </AppScreen>
    );
  }

  return (
    <AppScreen title="Post" showBackButton>
      <PostCard post={post} onLikeUpdated={loadPost} onPostUpdated={loadPost} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({});
