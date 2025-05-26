import React, { useState } from "react";
import { View, Text, TextInput, Button, FlatList, StyleSheet } from "react-native";
import { createComment } from "@/services/api.jsx";

type Comment = {
  _id?: string;
  userId: {
    firstName: string;
    lastName: string;
  };
  text: string;
  createdAt: string;
};

type Props = {
  postId: string;
  comments: Comment[];
};

export default function CommentSection({ postId, comments }: Props) {
  const [text, setText] = useState("");
  const [localComments, setLocalComments] = useState<Comment[]>(comments);

  const handleSubmit = async () => {
    if (!text.trim()) return;

    try {
      const updatedPost = await createComment(postId, text);
      setLocalComments(updatedPost.comments); // נעדכן את התגובות מהשרת
      setText("");
    } catch (err) {
      console.error("❌ Failed to create comment:", err);
    }
  };

  const renderItem = ({ item }: { item: Comment }) => (
    <View style={styles.comment}>
      <Text style={styles.author}>
        {item.userId.firstName} {item.userId.lastName}
      </Text>
      <Text style={styles.text}>{item.text}</Text>
      <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={localComments}
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Be the first to comment!</Text>}
      />

      <TextInput
        placeholder="Write a comment..."
        value={text}
        onChangeText={setText}
        style={styles.input}
      />
      <Button title="Comment" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  comment: {
    backgroundColor: "#f7f7f7",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  author: {
    fontWeight: "600",
  },
  text: {
    marginTop: 4,
  },
  time: {
    fontSize: 11,
    color: "#888",
    marginTop: 4,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 8,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 6,
  },
  empty: {
    fontStyle: "italic",
    color: "#888",
    textAlign: "center",
    marginBottom: 8,
  },
});
