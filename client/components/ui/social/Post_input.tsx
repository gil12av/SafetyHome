import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createPost } from "@/services/api.jsx";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Alert, ActionSheetIOS, Platform } from "react-native";
import Toast from "react-native-toast-message";

export default function PostInput({ onPostCreated }: { onPostCreated: () => void }) {
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [link, setLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);


  const handleImageOption = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["ביטול", "צלם תמונה", "בחר מהגלריה"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            openCamera();
          } else if (buttonIndex === 2) {
            pickImage();
          }
        }
      );
    } else {
      // לאנדרואיד – Alert פשוטה או Modal מותאם
      Alert.alert("העלאת תמונה", "בחר מקור", [
        { text: "מצלמה", onPress: openCamera },
        { text: "גלריה", onPress: pickImage },
        { text: "ביטול", style: "cancel" },
      ]);
    }
  };

  
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
  
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  
  const openCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
  
    if (!result.canceled) {
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

    Toast.show({
      type: 'success',
      text1: 'Great!',
      text2: 'Your post was published 🎉',
      position: 'bottom',
      visibilityTime: 3000,  
    });
    
  };

  return (
    <View style={styles.cardContainer}>
      <TextInput
        placeholder="What's on your mind? 😊"
        placeholderTextColor="#888"
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

      <View style={styles.iconGroup}>
      <TouchableOpacity onPress={handleImageOption}>
        <MaterialCommunityIcons name="image" size={24} color="#4A90E2" />
        <Text style={styles.iconLabel}>Image</Text>
      </TouchableOpacity>


        <TouchableOpacity onPress={() => setShowLinkInput((prev) => !prev)}>
          <MaterialCommunityIcons name="link" size={24} color="#00BCD4" />
          <Text style={styles.iconLabel}>Link</Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity style={styles.postButton} onPress={handlePost}>
        <Text style={styles.postButtonText}>Post</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "",
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  
  input: {
    backgroundColor: "#f5f8fc",
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
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

  iconGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  iconLabel: {
    fontSize: 12,
    color: "#555",
    textAlign: "center",
    marginTop: 2,
  },
  
  postButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  
});
