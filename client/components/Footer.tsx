import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";

const FooterComponent = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState(authContext?.user);
  const isAuthenticated = authContext?.isAuthenticated;

  useEffect(() => {
    // רענון משתמש כאשר הוא משתנה ב-AuthContext
    setUser(authContext?.user);
  }, [authContext?.user]);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/UserForm");
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        {user ? `Connected as: ${user.firstName}` : "Not connected"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    padding: 10,
    backgroundColor: "#333",
    alignItems: "center",
  },
  footerText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default FooterComponent;
