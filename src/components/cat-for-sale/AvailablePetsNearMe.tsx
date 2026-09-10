import React from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { availableCatsNearMe } from "@/../Data/catsData";

const { width } = Dimensions.get("window");
// Assuming roughly a 2-column layout for mobile grid items with gap padding
const itemWidth = (width - 48 - 12) / 2;

export default function AvailablePets() {
  return (
    <View style={styles.section}>
      <View style={styles.container}>
        {/* Section Heading & Subtitle */}
        <Text style={styles.heading}>Available Cats & Kittens Near You</Text>
        <Text style={styles.subtitle}>
          Discover more about your favourite cat breed and determine if it suits your lifestyle.
        </Text>

        {/* Responsive Grid */}
        <View style={styles.grid}>
          {availableCatsNearMe.map((img, i) => (
            <View key={i} style={styles.card}>
              <Image source={{ uri: img.src }} style={styles.image} resizeMode="cover" />
              <View style={styles.titleContainer}>
                <Text style={styles.titleText} numberOfLines={1}>
                  {img.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#ffffff",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  container: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#000000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 24,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
  },
  card: {
    width: itemWidth,
    maxWidth: 160,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 140,
  },
  titleContainer: {
    backgroundColor: "#8957E9",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  titleText: {
    textAlign: "center",
    fontSize: 12,
    fontWeight: "600",
    color: "#ffffff",
  },
});