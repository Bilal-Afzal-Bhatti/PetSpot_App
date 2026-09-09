import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

import { useAuthStore } from "@/../Store/authStore";

export default function ProfileSettingsScreen() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Store Integration
  // ---------------------------------------------------------------------------
  const authState = useAuthStore() as any;
  const { authUser, isUpdatingProfile, updateUser, changePassword } = authState;

  // Active tab selection: "PROFILE" or "PASSWORD"
  const [activeTab, setActiveTab] = useState<"PROFILE" | "PASSWORD">("PROFILE");

  // ---------------------------------------------------------------------------
  // Profile Form States
  // ---------------------------------------------------------------------------
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [profileErrors, setProfileErrors] = useState<Record<string, string>>({});

  // ---------------------------------------------------------------------------
  // Password Form States
  // ---------------------------------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  // Helper to format remote relative image paths
  const getImageUrl = (path?: string) => {
    if (!path) return null;
    if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("file:")) {
      return path;
    }
    const baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:5000";
    return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  // Sync Auth User to form fields
  useEffect(() => {
    if (authUser) {
      setProfileForm({
        name: authUser.name || "",
        email: authUser.email || "",
      });
      if (authUser.avatar) {
        setPreviewImage(getImageUrl(authUser.avatar));
      }
    }
  }, [authUser]);

  // ---------------------------------------------------------------------------
  // Image Selection Handler (Expo Image Picker)
  // ---------------------------------------------------------------------------
  const handlePickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Access to photo library is required to upload a profile picture.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedAsset = result.assets[0];
      setSelectedImage(selectedAsset);
      setPreviewImage(selectedAsset.uri);
      setRemoveImage(false);

      if (profileErrors.image) {
        setProfileErrors((prev) => ({ ...prev, image: "" }));
      }
    }
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setSelectedImage(null);
    setRemoveImage(true);
  };

  // ---------------------------------------------------------------------------
  // Profile Submit Logic
  // ---------------------------------------------------------------------------
  const validateProfileForm = () => {
    const errors: Record<string, string> = {};

    if (!profileForm.name.trim()) errors.name = "Full name is required";
    if (!profileForm.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = "Enter a valid email address";
    }

    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProfileSubmit = async () => {
    if (!validateProfileForm()) return;

    const formData = new FormData();
    formData.append("name", profileForm.name.trim());
    formData.append("email", profileForm.email.trim());

    if (selectedImage) {
      const uriParts = selectedImage.uri.split(".");
      const fileType = uriParts[uriParts.length - 1];

      formData.append("avatar", {
        uri: selectedImage.uri,
        name: `avatar.${fileType}`,
        type: `image/${fileType === "jpg" ? "jpeg" : fileType}`,
      } as any);
    }

    if (removeImage) {
      formData.append("removeProfileImage", "true");
    }

    try {
      const success = await updateUser(formData);
      if (success) {
        setSelectedImage(null);
        setRemoveImage(false);
        Alert.alert("Success", "Profile updated successfully!");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to update profile.");
    }
  };

  // ---------------------------------------------------------------------------
  // Password Submit Logic
  // ---------------------------------------------------------------------------
  const validatePasswordForm = () => {
    const errors: Record<string, string> = {};

    if (!passwordForm.oldPassword) errors.oldPassword = "Current password is required";
    if (!passwordForm.newPassword) {
      errors.newPassword = "New password is required";
    } else if (passwordForm.newPassword.length < 6) {
      errors.newPassword = "Password must be at least 6 characters long";
    }

    if (!passwordForm.confirmPassword) {
      errors.confirmPassword = "Please confirm your new password";
    } else if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    if (passwordForm.oldPassword && passwordForm.oldPassword === passwordForm.newPassword) {
      errors.newPassword = "New password must be different from current password";
    }

    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return;

    try {
      const success = await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      });

      if (success) {
        setPasswordForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
        Alert.alert("Success", "Password updated successfully!");
      }
    } catch (err: any) {
      Alert.alert("Error", err?.message || "Failed to change password.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
    

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Navigation Bar */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Account Settings</Text>

        {/* Tab Navigation Controls */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === "PROFILE" && styles.activeTabButton]}
            onPress={() => setActiveTab("PROFILE")}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color={activeTab === "PROFILE" ? "#028d8f" : "#9CA3AF"}
            />
            <Text style={[styles.tabText, activeTab === "PROFILE" && styles.activeTabText]}>
              Edit Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === "PASSWORD" && styles.activeTabButton]}
            onPress={() => setActiveTab("PASSWORD")}
          >
            <Ionicons
              name="lock-closed-outline"
              size={18}
              color={activeTab === "PASSWORD" ? "#028d8f" : "#9CA3AF"}
            />
            <Text style={[styles.tabText, activeTab === "PASSWORD" && styles.activeTabText]}>
              Password
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================================================================= */}
        {/* TAB 1: EDIT PROFILE FORM                                          */}
        {/* ================================================================= */}
        {activeTab === "PROFILE" && (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Profile Picture</Text>

            {/* Avatar Picker Section */}
            <View style={styles.avatarSection}>
              <TouchableOpacity style={styles.avatarContainer} onPress={handlePickImage}>
                {previewImage ? (
                  <Image source={{ uri: previewImage }} style={styles.avatarImage} resizeMode="cover" />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Ionicons name="person" size={44} color="#9CA3AF" />
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera" size={16} color="#ffffff" />
                </View>
              </TouchableOpacity>

              <View style={styles.avatarActions}>
                <TouchableOpacity style={styles.uploadBtn} onPress={handlePickImage}>
                  <Text style={styles.uploadBtnText}>Upload Photo</Text>
                </TouchableOpacity>

                {previewImage && (
                  <TouchableOpacity style={styles.removeBtn} onPress={handleRemoveImage}>
                    <Text style={styles.removeBtnText}>Remove</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {profileErrors.image ? <Text style={styles.errorText}>{profileErrors.image}</Text> : null}

            <View style={styles.divider} />

            <Text style={styles.sectionHeader}>Personal Information</Text>

            {/* Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput
                style={[styles.input, profileErrors.name ? styles.inputError : null]}
                placeholder="Enter full name"
                placeholderTextColor="#9CA3AF"
                value={profileForm.name}
                onChangeText={(text) => {
                  setProfileForm((prev) => ({ ...prev, name: text }));
                  if (profileErrors.name) setProfileErrors((prev) => ({ ...prev, name: "" }));
                }}
              />
              {profileErrors.name ? <Text style={styles.errorText}>{profileErrors.name}</Text> : null}
            </View>

            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <TextInput
                style={[styles.input, profileErrors.email ? styles.inputError : null]}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={profileForm.email}
                onChangeText={(text) => {
                  setProfileForm((prev) => ({ ...prev, email: text }));
                  if (profileErrors.email) setProfileErrors((prev) => ({ ...prev, email: "" }));
                }}
              />
              {profileErrors.email ? <Text style={styles.errorText}>{profileErrors.email}</Text> : null}
            </View>

            {/* Submit Profile */}
            <TouchableOpacity
              style={styles.primaryButton}
              disabled={isUpdatingProfile}
              onPress={handleProfileSubmit}
            >
              {isUpdatingProfile ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Update Profile</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* ================================================================= */}
        {/* TAB 2: CHANGE PASSWORD FORM                                       */}
        {/* ================================================================= */}
        {activeTab === "PASSWORD" && (
          <View style={styles.card}>
            <Text style={styles.sectionHeader}>Change Security Password</Text>

            {/* Current Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CURRENT PASSWORD</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.passwordInput, passwordErrors.oldPassword ? styles.inputError : null]}
                  placeholder="Enter current password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.old}
                  value={passwordForm.oldPassword}
                  onChangeText={(text) => {
                    setPasswordForm((prev) => ({ ...prev, oldPassword: text }));
                    if (passwordErrors.oldPassword)
                      setPasswordErrors((prev) => ({ ...prev, oldPassword: "" }));
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPasswords((prev) => ({ ...prev, old: !prev.old }))}
                >
                  <Ionicons
                    name={showPasswords.old ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {passwordErrors.oldPassword ? (
                <Text style={styles.errorText}>{passwordErrors.oldPassword}</Text>
              ) : null}
            </View>

            {/* New Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NEW PASSWORD</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.passwordInput, passwordErrors.newPassword ? styles.inputError : null]}
                  placeholder="Enter new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.new}
                  value={passwordForm.newPassword}
                  onChangeText={(text) => {
                    setPasswordForm((prev) => ({ ...prev, newPassword: text }));
                    if (passwordErrors.newPassword)
                      setPasswordErrors((prev) => ({ ...prev, newPassword: "" }));
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                >
                  <Ionicons
                    name={showPasswords.new ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {passwordErrors.newPassword ? (
                <Text style={styles.errorText}>{passwordErrors.newPassword}</Text>
              ) : null}
            </View>

            {/* Confirm Password */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.passwordInput, passwordErrors.confirmPassword ? styles.inputError : null]}
                  placeholder="Confirm new password"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPasswords.confirm}
                  value={passwordForm.confirmPassword}
                  onChangeText={(text) => {
                    setPasswordForm((prev) => ({ ...prev, confirmPassword: text }));
                    if (passwordErrors.confirmPassword)
                      setPasswordErrors((prev) => ({ ...prev, confirmPassword: "" }));
                  }}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                >
                  <Ionicons
                    name={showPasswords.confirm ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>
              {passwordErrors.confirmPassword ? (
                <Text style={styles.errorText}>{passwordErrors.confirmPassword}</Text>
              ) : null}
            </View>

            {/* Requirements Guidance Box */}
            <View style={styles.requirementsBox}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <Text style={styles.requirementItem}>• At least 6 characters long</Text>
              <Text style={styles.requirementItem}>• Different from your current password</Text>
              <Text style={styles.requirementItem}>• Mix letters, numbers, and special symbols</Text>
            </View>

            {/* Submit Password */}
            <TouchableOpacity
              style={styles.primaryButton}
              disabled={isUpdatingProfile}
              onPress={handlePasswordSubmit}
            >
              {isUpdatingProfile ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primaryButtonText}>Change Password</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// -----------------------------------------------------------------------------
// Component Stylesheet
// -----------------------------------------------------------------------------
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#191C33",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#232744",
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  activeTabButton: {
    backgroundColor: "#ffffff",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#028d8f",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 16,
  },
  avatarSection: {
    alignItems: "center",
    marginVertical: 8,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 14,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 2,
    right: 2,
    backgroundColor: "#028d8f",
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  avatarActions: {
    flexDirection: "row",
    gap: 12,
  },
  uploadBtn: {
    backgroundColor: "#ffa500",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  uploadBtnText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  removeBtn: {
    backgroundColor: "#FEE2E2",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  removeBtnText: {
    color: "#EF4444",
    fontSize: 13,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FAFAFA",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingRight: 44,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FAFAFA",
  },
  eyeIcon: {
    position: "absolute",
    right: 14,
    top: 14,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
  },
  requirementsBox: {
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 6,
  },
  requirementItem: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
  },
  primaryButton: {
    backgroundColor: "#ffa500",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});