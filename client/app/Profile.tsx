import React, { useContext, useState } from "react";
import { View, Text, StyleSheet, Switch, TouchableOpacity, Image, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FooterComponent from "@/components/Footer";
import { useAuth } from "../context/AuthContext";
import LottieView from "lottie-react-native";
import ScreenWithBackButton from "@/components/ScreenWithBackButton";
import globalStyles from "../styles/globalStyles";
import { FontAwesome5 } from "@expo/vector-icons";

const avatarOptions = [
  { id: 1, icon: "smile-beam" },
  { id: 2, icon: "grin" },
  { id: 3, icon: "meh" },
  { id: 4, icon: "user-astronaut" },
  { id: 5, icon: "user-ninja" },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/120");

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <>
      <ScreenWithBackButton title="User Profile" style={globalStyles.screenContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Avatar Selection */}
          <View style={styles.cardCentered}>
            <Text style={styles.label}>Choose Avatar</Text>
            <View style={styles.avatarOptionsContainer}>
              {avatarOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.avatarOption,
                    selectedAvatar === option.id && styles.avatarOptionSelected,
                  ]}
                  onPress={() => setSelectedAvatar(option.id)}
                >
                  <FontAwesome5 name={option.icon} size={32} color={selectedAvatar === option.id ? "#fff" : "#333"} />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Avatar</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Picture Upload */}
          <View style={styles.cardCentered}>
            <Text style={styles.label}>Profile Picture</Text>
            <Image
              source={{ uri: profileImage }}
              style={styles.avatarLarge}
            />
            <TouchableOpacity style={styles.saveButton} onPress={pickImage}>
              <Text style={styles.saveButtonText}>Upload from Gallery or Camera</Text>
            </TouchableOpacity>
          </View>

          {/* Full Name */}
          <View style={styles.cardCentered}>
            <Text style={styles.label}>Full Name</Text>
            <Text style={styles.value}>{user?.firstName} {user?.lastName}</Text>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Edit Name</Text>
            </TouchableOpacity>
          </View>

          {/* Email */}
          <View style={styles.cardCentered}>
            <Text style={styles.label}>Email</Text>
            <Text style={styles.value}>{user?.email}</Text>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Edit Email</Text>
            </TouchableOpacity>
          </View>

          {/* Security */}
          <View style={styles.cardCentered}>
            <Text style={styles.label}>Security</Text>
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Change Password</Text>
            </TouchableOpacity>
          </View>

          {/* Dark Mode Toggle */}
          <View style={styles.cardRow}>
            <Text style={styles.label}>Dark Mode</Text>
            <Switch value={false} onValueChange={() => {}} />
          </View>

          {/* Logout */}
          <View style={styles.cardCentered}>
            <TouchableOpacity style={styles.saveButton} onPress={logout}>
              <Text style={styles.saveButtonText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenWithBackButton>
      <FooterComponent />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 100,
  },
  cardCentered: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    elevation: 3,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardRow: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarLarge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  avatarOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
    marginBottom: 10,
  },
  avatarOption: {
    backgroundColor: "#eee",
    borderRadius: 50,
    padding: 12,
    marginHorizontal: 5,
  },
  avatarOptionSelected: {
    backgroundColor: "#4A90E2",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});