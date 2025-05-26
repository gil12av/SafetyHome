import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createPost } from "@/services/api.jsx";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function PostInput({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.length) {
      setImage(result.assets[0].uri);
    }
  };

  const handlePost = async () => {
    if (!content.trim() && !image && !link.trim()) return;

    await createPost({ content, imageUrl: image, link });
    setContent("");
    setImage(null);
    setLink("");
    onPostCreated?.();
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="What's on your mind? 😊"
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline
      />

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} resizeMode="cover" />
      )}

      {showLinkInput && (
        <TextInput
          placeholder="Paste article link here..."
          style={styles.linkInput}
          value={link}
          onChangeText={setLink}
        />
      )}

      <View style={styles.actions}>
        <TouchableOpacity onPress={pickImage}>
          <MaterialCommunityIcons name="image-outline" size={24} color="#555" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowLinkInput((prev) => !prev)}>
          <MaterialCommunityIcons name="link-variant" size={24} color="#555" />
        </TouchableOpacity>
      </View>

      <Button title="Post" onPress={handlePost} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    minHeight: 60,
    textAlignVertical: "top",
  },
  linkInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 10,
  },
  imagePreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 10,
  },
});
