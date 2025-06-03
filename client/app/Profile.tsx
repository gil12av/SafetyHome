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
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AppScreen from "@/components/AppScreen";
import { colors, spacing } from "@/styles/theme";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const avatarOptions = [
  require("../assets/images/avatar1.png"),
  require("../assets/images/avatar2.png"),
  require("../assets/images/avatar3.png"),
];

export default function Profile() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [selectedEncryption, setSelectedEncryption] = useState("aes");
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const handleSave = () => {
    Alert.alert("✅ Changes saved", "Your preferences have been updated. You may reconnect to view the changes.");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => router.replace("/HomeScreen") },
    ]);
  };

  const openCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
      setShowAvatarModal(false);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setAvatarUri(result.assets[0].uri);
      setShowAvatarModal(false);
    }
  };

  const handleLanguageChange = (lang: string) => {
    setSelectedLanguage(lang);
    if (lang === "en") {
      Alert.alert("✅ Language updated", "English selected successfully.");
    } else {
      Alert.alert("🌍 Coming soon", "We're working on supporting this language.");
    }
  };

  return (
    <AppScreen title="Profile" showBackButton>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Your Profile Picture</Text>
        <TouchableOpacity onPress={() => setShowAvatarModal(true)} style={styles.avatarWrapper}>
          <View>
            <Image
              source={avatarUri ? { uri: avatarUri } : require("../assets/images/avatar1.png")}
              style={styles.avatarImage}
            />
            <MaterialCommunityIcons
              name="camera"
              size={24}
              color="#fff"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 4,
              }}
            />
          </View>
          <Text style={styles.changeAvatarText}>Tap to update profile photo</Text>
        </TouchableOpacity>

        <Modal visible={showAvatarModal} transparent animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.label}>Choose avatar or upload:</Text>
              <View style={{ flexDirection: "row", justifyContent: "space-around", marginVertical: 10 }}>
                {avatarOptions.map((src, idx) => (
                  <TouchableOpacity key={idx} onPress={() => { setAvatarUri(Image.resolveAssetSource(src).uri); setShowAvatarModal(false); }}>
                    <Image source={src} style={styles.avatarImage} />
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity onPress={openCamera} style={styles.saveButton}>
                <MaterialCommunityIcons name="camera" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveButtonText}>Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openGallery} style={styles.saveButton}>
                <MaterialCommunityIcons name="image" size={20} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.saveButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)} style={[styles.logoutButton, { marginTop: 10 }]}> 
                <Text style={styles.saveButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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

          <Text style={styles.label}>Password</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            placeholder="Enter new password"
            placeholderTextColor={colors.placeholder}
            secureTextEntry
          />

          <Text style={styles.label}>Encryption Level</Text>
          <View style={styles.optionRow}>
            <TouchableOpacity onPress={() => setSelectedEncryption("aes")}> 
              <Text style={styles.optionText}>{selectedEncryption === "aes" ? "🔘" : "⚪️"} 256-bit AES</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedEncryption("rsa")}> 
              <Text style={styles.optionText}>{selectedEncryption === "rsa" ? "🔘" : "⚪️"} RSA 2048</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.note}>Choose your preferred encryption method for storing personal data securely.</Text>

          <Text style={styles.label}>Language</Text>
          <View style={styles.optionRow}>
            {["English", "Hebrew", "France", "Arabic", "Italic", "Spanish"].map((lang) => (
              <TouchableOpacity key={lang} onPress={() => handleLanguageChange(lang)}>
                <Text style={styles.optionText}>{selectedLanguage === lang ? "🔘" : "⚪️"} {lang.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={[styles.saveButton, { marginTop: 20 }]} onPress={handleSave}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" style={{ marginRight: 6 }} />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.logoutButton, { marginTop: 20 }]} onPress={handleLogout}>
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
    paddingBottom: 120,
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
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 6,
  },
  note: {
    fontSize: 12,
    color: "#888",
    marginBottom: 16,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
  },
});
