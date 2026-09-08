import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Link } from "expo-router";
const dogsHeroImage = require("../../../../assets/Blog/blog.webp");

export default function DogsCareHeroSection() {
  return (
    <ImageBackground
      source={dogsHeroImage}
      resizeMode="cover"
      style={styles.section}
    >
      {/* Dark overlay for text readability */}
      <View style={styles.overlay} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Dog Care</Text>

        <View style={styles.breadcrumbRow}>
          {/* Clickable Home */}
          <Link href="/" style={styles.homeLink}>
            Home
          </Link>
          <Text style={styles.breadcrumbText}> / Blog / Dog Care</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    height: 260,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  content: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0,0,0,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  homeLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#ffffff",
    textDecorationLine: "underline",
  },
  breadcrumbText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#ffffff",
    opacity: 0.9,
  },
});