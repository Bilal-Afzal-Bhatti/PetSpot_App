import { useAuthStore } from "@/../Store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

const splashBgImage = require("@/../assets/app_images/splash_image.png");

const { width, height } = Dimensions.get("window");

export default function SignUpScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    city: "",
    isPetParent: "",
  });

  const signup = useAuthStore((state) => state.signup);
  const isSigningUp = useAuthStore((state) => state.isSigningUp);
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isCheckingAuth) return;
    if (authUser) {
      router.replace("/(tabs)/home");
    }
  }, [authUser, isCheckingAuth]);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Toast.show({ type: "error", text1: "Please fill in all required fields" });
      return;
    }

    try {
      await signup(formData);
      router.push("/(auth)/verify-otp");
    } catch {
      Toast.show({ type: "error", text1: "Signup failed!" });
    }
  };

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D86B35" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (authUser) {
    return null;
  }

  return (
    <ImageBackground
      source={splashBgImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              {/* Card Container */}
              <View style={styles.card}>
                {/* Header Section */}
                <View style={styles.headerSection}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace("/(auth)/login")}
                  >
                    <Ionicons name="arrow-back" size={20} color="#D86B35" />
                    <Text style={styles.backButtonText}>Back to Login</Text>
                  </TouchableOpacity>

                  <Text style={styles.titleText}>Create Account</Text>
                  <Text style={styles.subtitleText}>
                    Join us and start connecting with pet lovers!
                  </Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                  {/* Full Name */}
                  <TextInput
                    placeholder="Full Name"
                    value={formData.name}
                    onChangeText={(val) => handleChange("name", val)}
                    placeholderTextColor="#A0A0A0"
                    style={styles.input}
                  />

                  {/* Email */}
                  <TextInput
                    placeholder="Email Address"
                    value={formData.email}
                    onChangeText={(val) => handleChange("email", val)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#A0A0A0"
                    style={styles.input}
                  />

                  {/* Password */}
                  <View style={styles.passwordWrapper}>
                    <TextInput
                      placeholder="Create Password"
                      value={formData.password}
                      onChangeText={(val) => handleChange("password", val)}
                      secureTextEntry={!showPassword}
                      placeholderTextColor="#A0A0A0"
                      style={[styles.input, styles.passwordInput]}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword((prev) => !prev)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={20}
                        color="#6B6B6B"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Pet Parent Selector */}
                  <View style={styles.radioContainer}>
                    <Text style={styles.radioLabel}>Are you a Pet Parent?</Text>
                    <View style={styles.radioGroup}>
                      <TouchableOpacity
                        onPress={() => handleChange("isPetParent", "Yes")}
                        style={styles.radioButtonOption}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            formData.isPetParent === "Yes" && styles.radioCircleSelected,
                          ]}
                        >
                          {formData.isPetParent === "Yes" && (
                            <View style={styles.radioInnerDot} />
                          )}
                        </View>
                        <Text style={styles.radioOptionText}>Yes</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleChange("isPetParent", "No")}
                        style={styles.radioButtonOption}
                      >
                        <View
                          style={[
                            styles.radioCircle,
                            formData.isPetParent === "No" && styles.radioCircleSelected,
                          ]}
                        >
                          {formData.isPetParent === "No" && (
                            <View style={styles.radioInnerDot} />
                          )}
                        </View>
                        <Text style={styles.radioOptionText}>No</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isSigningUp}
                    style={[
                      styles.submitButton,
                      isSigningUp ? styles.buttonDisabled : styles.buttonActive,
                    ]}
                  >
                    {isSigningUp ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Create Account</Text>
                    )}
                  </TouchableOpacity>

                  {/* Login Link */}
                  <View style={styles.loginRow}>
                    <Text style={styles.loginPrompt}>Already a member? </Text>
                    <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                      <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    width: width,
    height: height,
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 15, 12, 0.35)",
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FAF6E9",
  },
  loadingText: {
    color: "#2C2C2C",
    fontSize: 16,
    marginTop: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: "#FAF6E9",
    borderRadius: 32,
    paddingVertical: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  headerSection: {
    alignItems: "center",
    marginBottom: 8,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backButtonText: {
    color: "#D86B35",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 6,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "800",
    textAlign: "center",
    color: "#2C2C2C",
  },
  subtitleText: {
    fontSize: 14,
    textAlign: "center",
    color: "#6B6B6B",
    marginTop: 6,
    paddingHorizontal: 12,
  },
  formSection: {
    marginTop: 16,
    gap: 14,
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    fontSize: 15,
    color: "#2C2C2C",
    borderWidth: 1,
    borderColor: "#E2DEC9",
  },
  passwordWrapper: {
    position: "relative",
    justifyContent: "center",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
  },
  radioContainer: {
    marginTop: 4,
  },
  radioLabel: {
    color: "#2C2C2C",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  radioGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  radioButtonOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#D86B35",
    alignItems: "center",
    justifyContent: "center",
  },
  radioCircleSelected: {
    backgroundColor: "#D86B35",
  },
  radioInnerDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  radioOptionText: {
    fontSize: 14,
    color: "#2C2C2C",
    fontWeight: "500",
  },
  submitButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonActive: {
    backgroundColor: "##ffa500",
  },
  buttonDisabled: {
    backgroundColor: "#CBB3A5",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  loginPrompt: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  loginLink: {
    color: "#D86B35",
    fontWeight: "700",
    fontSize: 14,
  },
});