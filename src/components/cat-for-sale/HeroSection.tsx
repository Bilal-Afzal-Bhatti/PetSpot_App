/**
 * HeroSection.tsx
 * React Native conversion of the Next.js Hero Section.
 *
 * Notes on conversion:
 *  - `next/image` -> RN `Image` component, sourced from local assets or a URI.
 *  - CSS linear-gradient -> `react-native-linear-gradient` (or `expo-linear-gradient`
 *    if you're on Expo — swap the import below accordingly).
 *  - `h-[83vh]` -> calculated from device window height via `Dimensions`.
 *  - Flex row layout with `justify-content: space-between` mirrors the
 *    original `flex items-center justify-between`.
 *
 * Required packages:
 *   react-native-linear-gradient
 *   (Expo users: `expo-linear-gradient` instead — see commented import)
 */

import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function HeroSection() {
  return (
    <LinearGradient
      colors={["#AA7DFF", "#F4EEFF"]}
      start={{ x: 0.5, y: -0.765 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.section}
    >
      {/* Left Content */}
      <View style={styles.textContainer}>
        <Text style={styles.heading}>
          Because every home deserves a loyal companion
        </Text>
        <Text style={styles.paragraph}>
          Finding a furry companion became easy peasy with Pets Corner. Choose
          your dream pup and bring home tons of happiness and goofiness.
        </Text>
      </View>

      {/* Right Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/dog-listing-hero-img.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  section: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.83,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },

  textContainer: {
    flex: 1,
    marginTop: 40,
    marginRight: 12,
  },
  heading: {
    color: "#000",
    fontSize: 28,
    fontWeight: "500",
    lineHeight: 34,
    marginBottom: 16,
  },
  paragraph: {
    color: "#000",
    fontSize: 14,
    lineHeight: 21,
  },

  imageContainer: {
    width: 160,
    height: 160,
    marginTop: 40,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});