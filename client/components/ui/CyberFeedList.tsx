import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { fetchArticles } from "@/services/api";
import { colors, spacing } from "@/styles/theme";
import * as WebBrowser from "expo-web-browser";

type Article = {
  _id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source?: string;
};

export default function CyberFeedList({ limit = 10, showHeader = false }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchArticles();
      setArticles(data.slice(0, limit));
      setLoading(false);
    };
    loadArticles();
  }, []);

  const openLink = async (url: string) => {
    if (url) {
      try {
        await WebBrowser.openBrowserAsync(url);
      } catch (error) {
        console.error("❌ Failed to open browser:", error);
      }
    }
  };

  const renderItem = ({ item }: { item: Article }) => (
    <TouchableOpacity key={item._id} style={styles.item} onPress={() => openLink(item.url)}>
      <Image source={{ uri: item.urlToImage }} style={styles.image} />
      <View style={styles.textBox}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.source} numberOfLines={1}>{item.source}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {showHeader && <Text style={styles.header}>📢 Cyber Tech</Text>}

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : limit <= 3 ? (
        articles.map((item) => renderItem({ item }))
      ) : (
        <FlatList
          data={articles}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.header,
    marginBottom: 10,
  },
  item: {
    flexDirection: "row",
    marginBottom: 12,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  textBox: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  source: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
