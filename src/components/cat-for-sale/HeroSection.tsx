/**
 * HeroSection.tsx
 * React Native conversion of the Next.js Hero Section with layout optimizations,
 * SafeAreaView, Suspense/lazy image loading, and custom background color.
 */

import React, { useState, Suspense } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HeroSection() {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View style={styles.backgroundContainer}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          
          {/* Top Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.heading}>
              Because every home deserves a loyal companion
            </Text>
            <Text style={styles.paragraph}>
              Finding a furry companion became easy peasy with Pets Corner. Choose
              your dream pup and bring home tons of happiness and goofiness.
            </Text>
          </View>

          {/* Bottom/Centered Image with Suspense & Lazy State Handling */}
          <View style={styles.imageContainer}>
            <Suspense
              fallback={
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              }
            >
              {imageLoading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="small" color="#fff" />
                </View>
              )}
              <Image
                source={require("../../../assets/dog-listing-hero-img.png")}
                style={styles.image}
                resizeMode="contain"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            </Suspense>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundContainer: {
    width: "100%",
    minHeight: SCREEN_HEIGHT * 0.5, // Reduced to ~50% of screen height
    backgroundColor: "#191C33",
  },
  safeArea: {
    flex: 1,
    width: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 10,
  },
  heading: {
    color: "#fff",
    fontSize: 22, // Slightly adjusted for compact height
    fontWeight: "700",
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 6,
  },
  paragraph: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: SCREEN_WIDTH * 0.55,
    height: SCREEN_WIDTH * 0.55,
    maxHeight: 150, // Scaled down for a tighter 50% layout footprint
    maxWidth: 200,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  loaderContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
});