import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { createPost } from "@/services/api";


type Props = {
  onPostCreated: () => void;
};

export default function PostInput({ onPostCreated }: Props) {
  const [content, setContent] = useState("");

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      await createPost({ content });
      setContent("");
      onPostCreated?.();
    } catch (e) {}
  };

  return (
    <View style={styles.box}>
      <TextInput
        placeholder="What's on your mind?"
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Post" onPress={handlePost} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    minHeight: 60,
  },
});
