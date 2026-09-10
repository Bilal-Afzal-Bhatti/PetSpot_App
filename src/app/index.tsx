import React, { useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useAuthStore } from "@/../Store/authStore";

// Pre-required assets from assets/app_images
const splashBgImage = require("../../assets/app_images/splash_image.png");
const petLogoImage = require("../../assets/app_images/petLogo.png");

export default function Index() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;

    // Adjusted timer for standard splash transition (2 seconds)
    const timer = setTimeout(() => {
      if (token) {
        router.replace("/(tabs)/home");
      } else {
        router.replace("/(auth)/login");
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [isHydrated, token]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={splashBgImage}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
        <View style={styles.overlay}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.contentContainer}>
              {/* Logo & Branding Section */}
              <View style={styles.brandContainer}>
                <Image
                  source={petLogoImage}
                  style={styles.logo}
                  resizeMode="contain"
                />
                <Text style={styles.title}>myPetshop</Text>
                <Text style={styles.subtitle}>
                  Welcome to your favorite pet care hub
                </Text>
              </View>

              {/* Bottom Loader */}
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10, 15, 12, 0.45)",
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  brandContainer: {
    alignItems: "center",
    marginTop: "20%",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 0.8,
    textShadowColor: "rgba(0, 0, 0, 0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#f3f4f1",
    textAlign: "center",
    maxWidth: "80%",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  loaderContainer: {
    marginBottom: 20,
  },
});