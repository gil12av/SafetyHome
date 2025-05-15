import React, { useEffect, useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { getCommentsForPost, createComment } from "@/services/api";

type CommentSectionProps = {
    postId: string;
  };
  
type Comment = {
    _id: string;
    userId: {
      firstName: string;
      lastName: string;
    };
    text: string;
    createdAt: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");

  const loadComments = async () => {
    const data = await getCommentsForPost(postId);
    setComments(data);
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    await createComment(postId, text);
    setText("");
    loadComments();
  };

  useEffect(() => {
    loadComments();
  }, []);

  return (
    <View style={styles.box}>
      {comments.map((c) => (
        <Text key={c._id} style={styles.comment}>
          <Text style={styles.author}>{c.userId.firstName}: </Text>
          {c.text}
        </Text>
      ))}
      <TextInput
        style={styles.input}
        placeholder="Write a comment..."
        value={text}
        onChangeText={setText}
      />
      <Button title="Comment" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    marginTop: 10,
  },
  comment: {
    marginBottom: 6,
    fontSize: 14,
  },
  author: {
    fontWeight: "600",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    padding: 8,
    marginBottom: 6,
  },
});
