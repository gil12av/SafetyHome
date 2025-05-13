import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AppScreen from "@/components/AppScreen";
import { colors, spacing } from "@/styles/theme";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function Profile() {
  const router = useRouter();
  const [name, setName] = useState("Yossi Cohen");
  const [email, setEmail] = useState("Yossi@gmail.com");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const handleSave = () => {
    alert("Changes saved!");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => router.replace("/UserForm") },
    ]);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <AppScreen title="Profile" showBackButton>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Your Profile Picture</Text>
        <TouchableOpacity onPress={pickImage} style={styles.avatarWrapper}>
          <Image
            source={avatarUri ? { uri: avatarUri } : require("../assets/images/avatar1.png")}
            style={styles.avatarImage}
          />
          <Text style={styles.changeAvatarText}>Tap to change photo</Text>
        </TouchableOpacity>

        <View style={styles.cardCentered}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor={colors.placeholder}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="Enter email"
            placeholderTextColor={colors.placeholder}
            keyboardType="email-address"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <MaterialCommunityIcons name="logout" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.saveButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.header,
    marginBottom: 12,
  },
  avatarWrapper: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  changeAvatarText: {
    fontSize: 14,
    color: colors.primary,
  },
  cardCentered: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  saveButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
