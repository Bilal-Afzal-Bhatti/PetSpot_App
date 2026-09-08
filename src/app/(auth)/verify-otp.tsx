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

export default function VerifyOtpScreen() {
  const router = useRouter();
  const [otp, setOtp] = useState("");

  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const isVerifyingOtp = useAuthStore((state) => state.isVerifyingOtp);
  const pendingEmail = useAuthStore((state) => state.pendingEmail);
  const authUser = useAuthStore((state) => state.authUser);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check authentication status on mount
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

  const handleSubmit = async () => {
    if (!otp || otp.length < 6) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid 6-digit OTP code",
      });
      return;
    }

    const success = await verifyOtp(otp);
    if (success) {
      router.replace("/(tabs)/home");
    }
  };

  const handleResendCode = () => {
    Toast.show({
      type: "success",
      text1: "OTP resent successfully!",
    });
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
                    onPress={() => router.back()}
                  >
                    <Ionicons name="arrow-back" size={20} color="#D86B35" />
                    <Text style={styles.backButtonText}>Back to Sign Up</Text>
                  </TouchableOpacity>

                  <Text style={styles.titleText}>Verify Email</Text>

                  <Text style={styles.subtitleText}>
                    Enter the 6-digit verification code sent to{" "}
                    <Text style={styles.emailHighlight}>
                      {pendingEmail || "your email"}
                    </Text>
                  </Text>
                </View>

                {/* Form Section */}
                <View style={styles.formSection}>
                  {/* OTP Input */}
                  <TextInput
                    value={otp}
                    onChangeText={(text) => setOtp(text.replace(/\D/g, ""))}
                    maxLength={6}
                    keyboardType="number-pad"
                    placeholder="Enter 6-Digit OTP"
                    placeholderTextColor="#A0A0A0"
                    style={styles.otpInput}
                  />

                  {/* Verify Button */}
                  <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={isVerifyingOtp}
                    style={[
                      styles.verifyButton,
                      isVerifyingOtp ? styles.buttonDisabled : styles.buttonActive,
                    ]}
                  >
                    {isVerifyingOtp ? (
                      <ActivityIndicator color="#ffffff" />
                    ) : (
                      <Text style={styles.verifyButtonText}>Verify Code</Text>
                    )}
                  </TouchableOpacity>

                  {/* Resend Code Section */}
                  <View style={styles.resendRow}>
                    <Text style={styles.resendPrompt}>Didn't receive code? </Text>
                    <TouchableOpacity onPress={handleResendCode}>
                      <Text style={styles.resendLink}>Resend Code</Text>
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
    marginTop: 8,
    paddingHorizontal: 12,
    lineHeight: 20,
  },
  emailHighlight: {
    fontWeight: "700",
    color: "#D86B35",
  },
  formSection: {
    marginTop: 16,
    gap: 14,
  },
  otpInput: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 8,
    color: "#2C2C2C",
    borderWidth: 1,
    borderColor: "#E2DEC9",
  },
  verifyButton: {
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
  verifyButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  resendRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 6,
  },
  resendPrompt: {
    fontSize: 14,
    color: "#6B6B6B",
  },
  resendLink: {
    color: "#D86B35",
    fontWeight: "700",
    fontSize: 14,
  },
});