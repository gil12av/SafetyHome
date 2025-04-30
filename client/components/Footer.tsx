import React, { useContext, useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../context/AuthContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const FooterComponent = () => {
  const authContext = useContext(AuthContext);
  const router = useRouter();
  const [user, setUser] = useState(authContext?.user);
  const isAuthenticated = authContext?.isAuthenticated;

  useEffect(() => {
    setUser(authContext?.user);
  }, [authContext?.user]);

  useEffect(() => {
    if (isAuthenticated === false) {
      router.replace("/UserForm");
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.footer}>
      {user ? (
        <View style={styles.userInfoContainer}>
          <Icon
            name={user.role === "admin" ? "shield-account" : "account-circle"}
            size={22}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.footerText}>
            {`${user.firstName} • ${user.role === "admin" ? "Admin" : "User"}`}
          </Text>
        </View>
      ) : (
        <Text style={styles.footerText}>Not connected</Text>
      )}
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
    fontSize: 15,
    fontWeight: "500",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
});

export default FooterComponent;
