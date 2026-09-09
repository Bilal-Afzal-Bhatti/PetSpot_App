import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";

export default function BreedInfoPageHeroSection() {
  const { breed } = useLocalSearchParams<{ breed: string }>();

  const breedName =
    typeof breed === "string"
      ? breed.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
      : "";

  return (
    <View style={styles.section}>
      {/* Content */}
      <View style={styles.content}>
        <View style={styles.breadcrumbRow}>
          <Link href="/" style={styles.breadcrumbLink}>
            Home
          </Link>
          <Text style={styles.breadcrumbText}> / </Text>
          <Link href={"/dog-breed" as any} style={styles.breadcrumbLink}>
            Dog Breeds
          </Link>
          <Text style={styles.breadcrumbText}> / </Text>
          <Text style={[styles.breadcrumbText, styles.capitalize]}>
            {breedName}
          </Text>
        </View>

        <Text style={styles.title}>
          {(breedName || "Dog Breed") + " Dog Breed"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    minHeight: 220, // ~30vh equivalent, fixed for mobile
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#0891B2", // 🔁 replace with your --gradient-hero color, or swap to LinearGradient once installed
    paddingTop: 60,
  },
  content: {
    width: "100%",
    maxWidth: 1152, // max-w-6xl equivalent
    paddingHorizontal: 24,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  breadcrumbLink: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  breadcrumbText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});