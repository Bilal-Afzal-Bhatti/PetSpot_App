/**
 * ThingsToConsiderScreen.tsx
 * React Native conversion of the ThingsToConsider component.
 *
 * Notes on conversion:
 *  - `next/image` -> RN `Image` (local asset via `require`, update path).
 *    SVGs need `react-native-svg` + `react-native-svg-transformer` to be
 *    imported as a component, OR just export `shape_paw` as a PNG and use
 *    a plain `Image` (simplest option, used below).
 *  - CSS grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) -> a simple
 *    `flexWrap` row layout, since RN has no native CSS grid. Each card is
 *    sized to ~48% width so 2 fit per row (matches the `sm:` breakpoint);
 *    tweak to 31% if you want 3 per row on tablets.
 *  - `var(--gradient-hero)` -> `react-native-linear-gradient` (placeholder
 *    purple stops — swap in your real gradient colors).
 *  - Decorative paw image positioned bottom-right via absolute positioning.
 *
 * Required packages:
 *   react-native-linear-gradient (or expo-linear-gradient on Expo)
 */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
// Expo users, use this instead:
// import { LinearGradient } from "expo-linear-gradient";

const considerations = [
  {
    title: "Home Size & Space",
    desc: "Small breeds like Pugs suit apartments, while larger breeds like Labradors or German Shepherds need more space.",
  },
  {
    title: "Family Compatibility",
    desc: "For homes with kids or elderly, friendly breeds like Beagles or Golden Retrievers are ideal.",
  },
  {
    title: "Activity Level",
    desc: "Active owners can go for energetic breeds like Border Collies; calm personalities may prefer Basset Hounds.",
  },
  {
    title: "Climate Suitability",
    desc: "Choose breeds suited to Indian weather, Dobermans for heat, Huskies for colder regions.",
  },
  {
    title: "Budget & Maintenance",
    desc: "Consider ongoing costs like food, grooming, and vet visits. Pick based on your lifestyle and financial comfort.",
  },
  {
    title: "Purpose & Trainability",
    desc: "First-time owners should consider easy-to-train breeds like Labradors or Poodles. Select based on whether you want a guard dog, companion, or therapy dog.",
  },
];

export default function ThingsToConsiderScreen() {
  return (
    <View style={styles.gradientContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>
            Things To Consider While Selecting a Dog Breed
          </Text>
          <Text style={styles.subheading}>
            Choosing the right dog starts with your lifestyle. Here's what to
            keep in mind:
          </Text>
        </View>

        <View style={styles.grid}>
          {considerations.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>

              <Image
                source={require("../../../assets/shape_paw.svg")}
                style={styles.pawImage}
                resizeMode="contain"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    backgroundColor: "#7C3AED",
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 48,
  },

  header: { marginBottom: 28 },
  heading: {
    fontSize: 22,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 8,
  },
  subheading: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },

  card: {
    width: "48%",
    minHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    overflow: "hidden",
    position: "relative",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 13,
    color: "#000",
    lineHeight: 19,
  },
  pawImage: {
    position: "absolute",
    right: -8,
    bottom: -8,
    width: 70,
    height: 70,
    opacity: 0.9,
  },
});