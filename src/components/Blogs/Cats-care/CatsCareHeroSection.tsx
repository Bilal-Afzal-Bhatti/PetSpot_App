import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Link } from "expo-router";

const catsHeroImage = require("../../../../assets/Blog/blog.webp");

export default function CatsCareHeroSection() {
  return (
    <ImageBackground
      source={catsHeroImage}
      resizeMode="cover"
      style={styles.section}
    >
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.breadcrumbRow}>
          {/* Clickable Home */}
          <Link href="/" style={styles.homeLink}>
            Home
          </Link>
          <Text style={styles.breadcrumbText}> / Blog / cat care</Text>
        </View>

        <Text style={styles.title}>Cat Care</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  section: {
    height: "40%",
    width: "100%",
    justifyContent: "flex-end",
    paddingBottom: 24,
  },
  content: {
    width: "100%",
    paddingHorizontal: 24,
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
  title: {
    fontSize: 36,
    fontWeight: "600",
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
});