import { useAuthStore } from "@/../Store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
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

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isCheckingAuth && authUser) {
      router.replace("/(tabs)/home");
    }
  }, [authUser, isCheckingAuth]);

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter your email address",
      });
      return;
    }

    setIsSubmitting(true);
    const success = await forgotPassword(email.trim());
    setIsSubmitting(false);

    if (success) {
      setOtpSent(true);
      Toast.show({
        type: "success",
        text1: "Reset link sent!",
        text2: "Redirecting to reset password page...",
      });

      setTimeout(() => {
        router.push("/(auth)/reset-password");
      }, 2000);
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
                {/* Header & Description */}
                <View style={styles.headerSection}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.replace("/(auth)/login")}
                  >
                    <Ionicons name="arrow-back" size={20} color="#D86B35" />
                    <Text style={styles.backButtonText}>Back to Login</Text>
                  </TouchableOpacity>

                  <Text style={styles.titleText}>Reset Your Password</Text>

                  <Text style={styles.subtitleText}>
                    Enter your email address and we'll send you an OTP to reset your password.
                  </Text>
                </View>

                {/* Form Content */}
                <View style={styles.formSection}>
                  {/* Email Input */}
                  <TextInput
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#A0A0A0"
                    editable={!otpSent}
                    style={styles.textInput}
                  />

                  {/* Submit Button */}
                  <TouchableOpacity
                    onPress={handleForgotPassword}
                    disabled={isSubmitting || otpSent}
                    style={[
                      styles.submitButton,
                      isSubmitting || otpSent
                        ? styles.buttonDisabled
                        : styles.buttonActive,
                    ]}
                  >
                    {isSubmitting ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.submitButtonText}>
                        {otpSent ? "OTP Sent! Check your email" : "Send Reset Link"}
                      </Text>
                    )}
                  </TouchableOpacity>

                  {/* Remember Password Link */}
                  <View style={styles.linkRow}>
                    <Text style={styles.linkLabel}>Remember your password? </Text>
                    <TouchableOpacity onPress={() => router.replace("/(auth)/login")}>
                      <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Success Message Alert */}
                  {otpSent && (
                    <View style={styles.alertBox}>
                      <Text style={styles.alertText}>
                        Password reset OTP sent! Redirecting to reset password page...
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
  textInput: {
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
  submitButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 6,
  },
  buttonActive: {
    backgroundColor: "#ffa500",
  },
  buttonDisabled: {
    backgroundColor: "#CBB3A5",
  },
  submitButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  linkLabel: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  linkText: {
    color: "#D86B35",
    fontWeight: "700",
    fontSize: 14,
  },
  alertBox: {
    marginTop: 6,
    padding: 14,
    backgroundColor: "#E6F4EA",
    borderWidth: 1,
    borderColor: "#A8DADC",
    borderRadius: 16,
  },
  alertText: {
    fontSize: 13,
    color: "#2D6A4F",
    textAlign: "center",
    fontWeight: "600",
  },
});