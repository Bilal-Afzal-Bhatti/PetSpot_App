import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Link } from "expo-router";

const blogHeroImage = require("../../../assets/Blog/blog.webp");

export default function HeroSection() {
  return (
    <ImageBackground
      source={blogHeroImage}
      resizeMode="cover"
      style={styles.section}
    >
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>BLOGS</Text>

        <View style={styles.breadcrumbRow}>
          {/* Clickable Home */}
          <Link href="/" style={styles.homeLink}>
            Home
          </Link>
          <Text style={styles.breadcrumbText}> / </Text>
          <Text style={styles.breadcrumbText}>Blogs</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    height: "40%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  content: {
    marginTop: 32,
    width: "100%",
    maxWidth: 1100,
    alignItems: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    textAlign: "center",
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    gap: 4,
  },
  homeLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
  breadcrumbText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
});