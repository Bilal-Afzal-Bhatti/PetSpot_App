import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuthStore } from "@/../Store/authStore";

const splashBgImage = require("@/../assets/app_images/splash_image.png");

const { width, height } = Dimensions.get("window");

export default function ResetPasswordScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordReset, setPasswordReset] = useState(false);

  const resetPassword = useAuthStore((state) => state.resetPassword);
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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      newErrors.otp = "Please enter a valid 6-digit OTP";
    }

    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters long";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setPasswordReset(true);
    try {
      const success = await resetPassword({
        otp: otp.trim(),
        newPassword,
      });

      if (success) {
        Toast.show({
          type: "success",
          text1: "Password reset successful!",
          text2: "Redirecting to login page...",
        });

        setTimeout(() => {
          router.replace("/(auth)/login");
        }, 3000);
      }
    } finally {
      setPasswordReset(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }

    switch (field) {
      case "otp":
        setOtp(value);
        break;
      case "newPassword":
        setNewPassword(value);
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        break;
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
          <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.contentContainer}>
              
              {/* Main Card Container */}
              <View style={styles.card}>
                
                {/* Top Form Header */}
                <View style={styles.headerSection}>
                  <TouchableOpacity 
                    style={styles.backButton}
                    onPress={() => router.replace("/(auth)/login")}
                  >
                    <Ionicons name="arrow-back" size={20} color="#D86B35" />
                    <Text style={styles.backButtonText}>Back to Login</Text>
                  </TouchableOpacity>

                  <Text style={styles.titleText}>Create New Password</Text>

                  <Text style={styles.subtitleText}>
                    Check your email for the 6-digit OTP and enter it below along with your new password.
                  </Text>
                </View>

                {/* Form Content */}
                <View style={styles.formSection}>
                  
                  {/* OTP Input */}
                  <View>
                    <TextInput
                      placeholder="Enter 6-digit OTP"
                      value={otp}
                      onChangeText={(val) => handleInputChange("otp", val)}
                      keyboardType="number-pad"
                      maxLength={6}
                      placeholderTextColor="#A0A0A0"
                      style={[
                        styles.input,
                        styles.otpInput,
                        errors.otp ? styles.inputError : null,
                      ]}
                    />
                    {errors.otp && (
                      <Text style={styles.errorText}>{errors.otp}</Text>
                    )}
                  </View>

                  {/* New Password Input */}
                  <View>
                    <View style={styles.passwordWrapper}>
                      <TextInput
                        placeholder="New Password"
                        value={newPassword}
                        onChangeText={(val) => handleInputChange("newPassword", val)}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#A0A0A0"
                        style={[
                          styles.input,
                          styles.passwordInput,
                          errors.newPassword ? styles.inputError : null,
                        ]}
                      />
                      <TouchableOpacity
                        onPress={() => setShowPassword((v) => !v)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#8E8E93"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.newPassword && (
                      <Text style={styles.errorText}>{errors.newPassword}</Text>
                    )}
                  </View>

                  {/* Confirm Password Input */}
                  <View>
                    <View style={styles.passwordWrapper}>
                      <TextInput
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={(val) => handleInputChange("confirmPassword", val)}
                        secureTextEntry={!showConfirmPassword}
                        placeholderTextColor="#A0A0A0"
                        style={[
                          styles.input,
                          styles.passwordInput,
                          errors.confirmPassword ? styles.inputError : null,
                        ]}
                      />
                      <TouchableOpacity
                        onPress={() => setShowConfirmPassword((v) => !v)}
                        style={styles.eyeIcon}
                      >
                        <Ionicons
                          name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                          size={20}
                          color="#8E8E93"
                        />
                      </TouchableOpacity>
                    </View>
                    {errors.confirmPassword && (
                      <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                    )}
                  </View>

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleResetPassword}
                    disabled={passwordReset}
                    style={[
                      styles.submitButton,
                      passwordReset ? styles.buttonDisabled : styles.buttonActive,
                    ]}
                  >
                    {passwordReset ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitButtonText}>Reset Password</Text>
                    )}
                  </TouchableOpacity>

                  {/* Remember Password Link */}
                  <View style={styles.loginRow}>
                    <Text style={styles.loginPrompt}>Remember your password? </Text>
                    <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                      <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Password Requirements Box */}
                  <View style={styles.requirementsBox}>
                    <Text style={styles.requirementsTitle}>
                      Password Requirements:
                    </Text>
                    <Text style={styles.requirementsItem}>• At least 6 characters long</Text>
                    <Text style={styles.requirementsItem}>
                      • Use a combination of letters, numbers, and symbols
                    </Text>
                  </View>

                  {/* Success Notification Alert */}
                  {passwordReset && (
                    <View style={styles.successBox}>
                      <Text style={styles.successText}>
                        Password reset successful! Redirecting to login page...
                      </Text>
                    </View>
                  )}

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
    backgroundColor: "#FDFBF7",
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
    marginTop: 8,
    paddingHorizontal: 12,
    lineHeight: 20,
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
  otpInput: {
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 6,
    fontWeight: "600",
  },
  inputError: {
    borderColor: "#EF4444",
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
    fontSize: 12,
    color: "#DC2626",
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
  submitButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },
  buttonActive: {
    backgroundColor: "#D86B35",
  },
  buttonDisabled: {
    backgroundColor: "#CBB3A5",
  },
  submitButtonText: {
    color: "#ffffff",
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
  requirementsBox: {
    marginTop: 10,
    padding: 14,
    backgroundColor: "#F2EBD9",
    borderRadius: 16,
  },
  requirementsTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4A4A4A",
    marginBottom: 4,
  },
  requirementsItem: {
    fontSize: 12,
    color: "#6B6B6B",
    marginTop: 2,
  },
  successBox: {
    marginTop: 6,
    padding: 14,
    backgroundColor: "#E6F4EA",
    borderWidth: 1,
    borderColor: "#A8DADC",
    borderRadius: 16,
  },
  successText: {
    fontSize: 13,
    color: "#2D6A4F",
    textAlign: "center",
    fontWeight: "600",
  },
});