import React from "react";
import { View, Text, ImageBackground, StyleSheet } from "react-native";
import { Link, useLocalSearchParams, type Href } from "expo-router";

const catBreedHeroImage = require("../../../../assets/HeroSectionBG/rottweiler.webp");

export default function CatBreedInfoHeroSection() {
  const { breed } = useLocalSearchParams<{ breed: string }>();

  const breedName =
    typeof breed === "string"
      ? breed.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "";

  return (
    <ImageBackground
      source={catBreedHeroImage}
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
          <Text style={styles.breadcrumbText}> / </Text>
          {/* Clickable Cat Breeds */}
          <Link href={"/cat-breed" as Href} style={styles.homeLink}>
            Cat Breeds
          </Link>
          <Text style={styles.breadcrumbText}> / {breedName}</Text>
        </View>

        <Text style={styles.title}>{breedName || "Cat Breed"} Cat Breed</Text>
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
    textTransform: "capitalize",
    textAlign: "center",
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    flexWrap: "wrap",
    justifyContent: "center",
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