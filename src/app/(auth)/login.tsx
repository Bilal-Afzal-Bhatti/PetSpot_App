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
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/../Store/authStore";

const { width } = Dimensions.get("window");
const login_image = require("@/../assets/app_images/login_image.png");
export default function LoginScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");

  const login = useAuthStore((state) => state.login);
  const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      router.replace("/(tabs)/home");
    }
  }, [authUser, isCheckingAuth]);

  const handleLogin = async () => {
    let formData;
    if (activeTab === "password") {
      if (!email || !password) {
        Toast.show({
          type: "error",
          text1: "Please enter your email and password",
        });
        return;
      }
      formData = { email, password };
    } else {
      if (!mobileOtp) {
        Toast.show({
          type: "error",
          text1: "Please enter your mobile number",
        });
        return;
      }
      formData = { mobile: mobileOtp };
    }

    const success = await login(formData);
    if (success) {
      router.replace("/(tabs)/home");
    } else {
      Toast.show({
        type: "error",
        text1: "Login failed. Check your credentials.",
      });
    }
  };

  if (isCheckingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2d5a43" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (authUser) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Card Container */}
          <View style={styles.card}>
            {/* Top Banner Image with Floating Back Button */}
            <View style={styles.imageContainer}>
              <Image
                source={login_image}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.replace("/(tabs)/home")}
              >
                <Ionicons name="arrow-back" size={18} color="#2d5a43" />
                <Text style={styles.backButtonText}>Back to Home</Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.contentSection}>
              <Text style={styles.titleText}>Login to Continue</Text>

              <View style={styles.registerRow}>
                <Text style={styles.registerPrompt}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => router.replace("/(auth)/signup")}>
                  <Text style={styles.registerLink}>Click here to Register</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                {activeTab === "password" ? (
                  <>
                    {/* Email Input */}
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="mail-outline"
                        size={20}
                        color="#7c8b82"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Enter Your Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#a0aaa5"
                        style={styles.input}
                      />
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputWrapper}>
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color="#7c8b82"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#a0aaa5"
                        style={[styles.input, styles.passwordInput]}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((prev) => !prev)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#7c8b82"
                        />
                      </TouchableOpacity>
                    </View>

                    {/* Forgot Password Link */}
                    <TouchableOpacity
                      style={styles.forgotPasswordContainer}
                      onPress={() => router.push("/(auth)/forgot-password")}
                    >
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  /* OTP/Mobile Input */
                  <View style={styles.inputWrapper}>
                    <Ionicons
                      name="call-outline"
                      size={20}
                      color="#7c8b82"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      placeholder="Mobile No."
                      value={mobileOtp}
                      onChangeText={setMobileOtp}
                      keyboardType="phone-pad"
                      placeholderTextColor="#a0aaa5"
                      style={styles.input}
                    />
                  </View>
                )}

                {/* Login Button */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoggingIn}
                  style={[
                    styles.loginButton,
                    isLoggingIn ? styles.buttonDisabled : styles.buttonActive,
                  ]}
                >
                  {isLoggingIn ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <Text style={styles.loginButtonText}>Log in</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer Banner */}
            <View style={styles.bannerFooter}>
              <Text style={styles.bannerTitle}>We Welcome You,</Text>
              <Text style={styles.bannerSubtitle}>
                with our open Heart and Paws!
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#e8eae6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f3ee",
  },
  loadingText: {
    color: "#2d5a43",
    fontSize: 16,
    marginTop: 12,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: width > 600 ? "15%" : 16,
    paddingVertical: 20,
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#f8f7f2",
    borderRadius: 28,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 220,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  backButton: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 4,
  },
  backButtonText: {
    color: "#2d5a43",
    fontWeight: "600",
    fontSize: 13,
  },
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleText: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#22352b",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  registerPrompt: {
    fontSize: 13,
    color: "#68736d",
  },
  registerLink: {
    color: "#ca8a4b",
    fontWeight: "600",
    fontSize: 13,
  },
  formSection: {
    gap: 14,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#e2e5df",
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#22352b",
    height: "100%",
  },
  passwordInput: {
    paddingRight: 36,
  },
  eyeIcon: {
    position: "absolute",
    right: 16,
  },
  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginTop: -2,
  },
  forgotPasswordText: {
    fontSize: 13,
    color: "#ca8a4b",
    fontWeight: "500",
  },
  loginButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonActive: {
    backgroundColor: "#D86B35",
  },
  buttonDisabled: {
    backgroundColor: "#9ab0a3",
  },
  loginButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  bannerFooter: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D86B35",
    marginTop: 12,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: 13,
    color: "#d0d8d3",
    textAlign: "center",
    marginTop: 2,
  },
});