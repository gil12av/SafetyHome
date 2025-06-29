import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Animated, View } from "react-native";

const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function DecryptText({ text }: { text: string }) {
  const [chars, setChars] = useState<string[]>([]);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    setChars(text.split(""));
    let currentIndex = 0;
    const interval = setInterval(() => {
      setRevealedIndices((prev) => {
        const newSet = new Set(prev);
        newSet.add(currentIndex);
        return newSet;
      });
      currentIndex++;
      if (currentIndex >= text.length) {
        clearInterval(interval);
      }
    }, 60);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <View style={styles.container}>
      {chars.map((char, i) => (
        <Animated.Text
          key={i}
          style={[
            styles.char,
            {
              opacity: revealedIndices.has(i) ? 1 : 0.3,
            },
          ]}
        >
          {revealedIndices.has(i)
            ? char
            : CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]}
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  char: {
    fontSize: 16,
    color: "dk-grey",
    fontFamily: "Courier",
  },
});
