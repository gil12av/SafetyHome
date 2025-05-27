import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { fetchArticles } from "@/services/api.jsx";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const defaultImage = "https://via.placeholder.com/300x150.png?text=Cyber+News";

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
  const [currentIndex, setCurrentIndex] = useState(0);

  const arrowOpacity = useRef(new Animated.Value(0.4)).current;

    useEffect(() => { // כדי לעשות אפקט הבהוב לחיצים עצמם
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(arrowOpacity, {
            toValue: 0.4,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }, []);
    

  useEffect(() => {
    const loadArticles = async () => {
      const data = await fetchArticles();
      setArticles(data.slice(0, limit));
      setLoading(false);
    };
    loadArticles();
  }, []);

  const openLink = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error("❌ Failed to open browser:", error);
    }
  };

  const renderItem = ({ item }: { item: Article }) => {
    const scale = useRef(new Animated.Value(1)).current;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return (
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (item.url?.startsWith("http")) {
              openLink(item.url);
            } else {
              console.warn("Invalid URL:", item.url);
            }
          }}
          style={{ flex: 1 }}
        >

          <Image
            source={{ uri: item.urlToImage || defaultImage }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.overlay}
          >
            <MaterialCommunityIcons
              name="web"
              size={20}
              color="#fff"
              style={styles.iconTopRight}
            />
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.cardSource}>
              {item.source || "Unknown Source"}
            </Text>
            <Text style={styles.cardDate}>
              {new Date(item.publishedAt).toLocaleDateString()}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {showHeader && <Text style={styles.header}>📢 Cyber Tech</Text>}
  
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <>
          <Carousel
            loop
            width={width}
            height={220}
            autoPlay={false}
            data={articles}
            onSnapToItem={(index) => setCurrentIndex(index)}
            scrollAnimationDuration={600}
            renderItem={renderItem}
          />
  
            {/* חץ שמאלי – רק אם לא בעמוד הראשון */}
            {currentIndex > 0 && (
              <Animated.View style={[styles.leftArrow, { opacity: arrowOpacity }]}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={26}
                  color="#333"
                />
              </Animated.View>
            )}

            {/* חץ ימני – רק אם לא בעמוד האחרון */}
            {currentIndex < articles.length - 1 && (
              <Animated.View style={[styles.rightArrow, { opacity: arrowOpacity }]}>
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={26}
                  color="#333"
                />
              </Animated.View>
            )}

        </>
      )}

        <View style={styles.dotsContainer}> 
          {articles.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                currentIndex === i ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

    </View>
  );
}  

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 10,
    marginLeft: 10,
  },
  loading: {
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
  card: {
    height: 220,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    elevation: 5,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    justifyContent: "flex-end",
    height: "60%",
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  cardSource: {
    fontSize: 12,
    color: "#ddd",
    marginTop: 4,
  },
  cardDate: {
    fontSize: 11,
    color: "#ccc",
    marginTop: 2,
  },
  iconTopRight: {
    position: "absolute",
    top: 10,
    right: 10,
  },

  leftArrow: {
    position: "absolute",
    top: 30,
    left: 0,
    zIndex: 10,
    width: 30,
    height: 220, // גובה הקרוסלה
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  rightArrow: {
    position: "absolute",
    top: 30,
    right: 0,
    zIndex: 10,
    width: 30,
    height: 220,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  

  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#4A90E2",
  },
  inactiveDot: {
    backgroundColor: "#ccc",
  },
  
});
