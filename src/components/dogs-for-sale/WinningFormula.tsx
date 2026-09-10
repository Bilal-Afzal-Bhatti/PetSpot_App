/**
 * WinningFormulaScreen.tsx
 * React Native conversion of the WinningFormula component.
 *
 * Notes on conversion:
 *  - `next/image` -> RN `Image`. Source is `/combodog.svg`, an SVG — plain
 *    RN `Image` can't render SVGs, so I used `require("../assets/combodog.png")`
 *    assuming a PNG export. For a true SVG, install `react-native-svg` +
 *    `react-native-svg-transformer` and import it as a component instead.
 *  - `var(--gradient-hero)` -> `react-native-linear-gradient` (placeholder
 *    purple stops — swap in your real gradient colors).
 *  - `bg-(--color-primary)` numbered badges -> flat `PRIMARY` constant.
 *  - The desktop `lg:flex-row` three-column layout (left steps / image /
 *    right steps) is collapsed into a single vertical stack for phones:
 *    left steps, then the image, then right steps. This reads naturally
 *    top-to-bottom on a narrow screen — for tablets, swap to a row layout
 *    behind a `useWindowDimensions` check if needed.
 *
 * Required packages:
 *   react-native-linear-gradient (or expo-linear-gradient on Expo)
 */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

let LinearGradient: React.ComponentType<any>;

try {
  LinearGradient = require("expo-linear-gradient").LinearGradient;
} catch {
  LinearGradient = ({ children, style }: any) => (
    <View style={[styles.fallbackGradient, style]}>{children}</View>
  );
}

const PRIMARY = "#7C3AED";

const stepsLeft = [
  {
    id: 1,
    title: "Confirmation",
    desc: "Our post-sales team confirms your chosen furbaby and forwards it for expert checks.",
  },
  {
    id: 2,
    title: "Expert Health Screening",
    desc: "MMP pet experts perform a 20+ parameter health assessment for initial evaluation.",
  },
  {
    id: 3,
    title: "Vet Check & Vaccination",
    desc: "A certified vet conducts a full-body checkup, vaccinations, and parvo testing.",
  },
];

const stepsRight = [
  {
    id: 4,
    title: "Travel Planning",
    desc: "We plan your pet's journey considering health, festivals, weather, and other factors.",
  },
  {
    id: 5,
    title: "Live Journey Updates",
    desc: "Receive feeding videos and real-time updates as your furbaby travels to you.",
  },
  {
    id: 6,
    title: "Post-Arrival Support",
    desc: "Once your pet arrives, we offer complete guidance to support your parenting journey.",
  },
];

function StepCard({ id, title, desc }: { id: number; title: string; desc: string }) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{id}</Text>
      </View>
      <View style={styles.cardTextWrapper}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDesc}>{desc}</Text>
      </View>
    </View>
  );
}

export default function WinningFormulaScreen() {
  return (
    <LinearGradient
      // Placeholder stops for `var(--gradient-hero)` — replace with your
      // actual theme gradient colors.
      colors={["#AA7DFF", "#7C3AED"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>Our Winning Formula</Text>
          <Text style={styles.subheading}>
            MMP ensures quality, safety, and love in every step of your pet's
            journey.
          </Text>
        </View>

        <View style={styles.stepsColumn}>
          {stepsLeft.map((item) => (
            <StepCard key={item.id} {...item} />
          ))}
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={require("../../../assets/combodog.svg")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.stepsColumn}>
          {stepsRight.map((item) => (
            <StepCard key={item.id} {...item} />
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 48,
  },

  header: { alignItems: "center", marginBottom: 36 },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
  },
  subheading: {
    fontSize: 13,
    color: "#fff",
    marginTop: 8,
    textAlign: "center",
  },

  stepsColumn: {
    gap: 16,
    marginBottom: 24,
  },

  card: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 18,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: PRIMARY,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  cardTextWrapper: { flex: 1 },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 19,
  },

  imageWrapper: {
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 260,
    height: 260,
  },
  fallbackGradient: {
    backgroundColor: "#7C3AED",
  },
});