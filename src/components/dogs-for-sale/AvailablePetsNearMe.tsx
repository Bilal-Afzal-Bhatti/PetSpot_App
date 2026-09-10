import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function AvailablePets() {
  const images = [
    { src: require("../../../assets/pets/image1.jpg"), name: "Buddy" },
    { src: require("../../../assets/pets/image2.webp"), name: "Milo" },
   
    { src: require("../../../assets/pets/image4.webp"), name: "Charlie" },

   
  ];

  return (
    <ScrollView contentContainerStyle={styles.section}>
      <View style={styles.container}>
        {/* Section Heading & Subtitle */}
        <Text style={styles.title}>Available Dogs & Puppies Near You</Text>
        <Text style={styles.subtitle}>
          Discover more about your favourite dog breed and determine if it suits your lifestyle.
        </Text>

        {/* Responsive Grid Layout */}
        <View style={styles.gridContainer}>
          {images.map((img, i) => (
            <View key={i} style={styles.card}>
              <Image source={img.src} style={styles.cardImage} />
              <View style={styles.cardBadge}>
                <Text style={styles.badgeText} numberOfLines={1}>
                  {img.name}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  container: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "#4B5563",
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 500,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
    width: "100%",
  },
  card: {
    width: "47%", // Approximately 2 items per row on mobile viewports
    maxWidth: 160,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 12,
    // Native shadow styling
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: "100%",
    height: 140,
    resizeMode: "cover",
  },
  cardBadge: {
    backgroundColor: "#8957E9",
    paddingVertical: 6,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});