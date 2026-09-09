import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, Dimensions } from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

type CatBreedRouteParams = {
  CatBreedInfo: { breed: string };
};

export default function CatBreedInfoHeroSection() {
  const navigation = useRouter();
  const route = useLocalSearchParams<CatBreedRouteParams["CatBreedInfo"]>();

  const breed = route.breed;
  const breedName =
    typeof breed === "string"
      ? breed
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "";

  return (
    <ImageBackground
     source={require("../../../../../assets/HeroSectionBG/rottweiler.webp")}
      style={styles.hero}
      resizeMode="cover"
    >
      <View style={styles.overlayContent}>
        <View style={styles.breadcrumbRow}>
          <TouchableOpacity onPress={() => navigation.navigate("Home" as never)}>
            <Text style={styles.breadcrumbText}>Home</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbText}> / </Text>
          <TouchableOpacity onPress={() => navigation.navigate("CatBreedListing" as never)}>
            <Text style={styles.breadcrumbText}>Cat Breeds</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbText}> / </Text>
          <Text style={[styles.breadcrumbText, styles.capitalize]}>{breedName}</Text>
        </View>

        <Text style={styles.title}>
          {(breedName || "Cat Breed") + " Cat Breed"}
        </Text>
      </View>
    </ImageBackground>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  hero: {
    height: height * 0.4, // ~40vh
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  overlayContent: {
    width: "100%",
    maxWidth: 1152, // max-w-6xl equivalent
    paddingHorizontal: 24,
    marginTop: height * 0.22, // approximates `top-55` offset
    alignSelf: "center",
  },
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  breadcrumbText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  capitalize: {
    textTransform: "capitalize",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "600",
    marginTop: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});