/**
 * PopularDogSearchesScreen.tsx
 * React Native conversion of the PopularDogSearches component.
 *
 * Notes on conversion:
 *  - `next/image` -> RN `Image` (local assets via `require`, update paths).
 *  - Layered background/foreground images (`fill` + absolute positioning)
 *    recreated with a stack of `View`s using `position: "absolute"`.
 *  - `FaPaw` / `FiArrowRight` -> `react-native-vector-icons/FontAwesome`
 *    and `Feather` respectively (arrow icon wasn't actually used in the
 *    JSX, so it's omitted here — add it back if you need it).
 *  - Responsive `lg:flex-row` layout -> a single column stack, since phones
 *    are narrow; swap to a row layout yourself if you also target tablets.
 */

import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ORANGE = "#FBB885";

const searches = [
  "Where to buy a healthy puppy in India",
  "Best place to buy dogs in India",
  "Dogs for sale online with price",
  "Buy dog with KCI papers India",
  "Best dogs to buy for apartments India",
  "Easy dogs for beginners in India",
  "Buy pets online from Indian puppy sellers",
];

export default function PopularDogSearchesScreen() {
  return (
    <ScrollView style={styles.section} contentContainerStyle={styles.content}>
      {/* Layered image block */}
      <View style={styles.imageOuter}>
        {/* Orange border frame */}
        <View style={styles.borderFrame} />

        <View style={styles.imageCard}>
          {/* Background image */}
          <Image
            source={require("../../../assets/bgsearches.png")}
            style={styles.bgImage}
            resizeMode="cover"
          />
          {/* Foreground image */}
          <Image
            source={require("../../../assets/searches.jpg")}
            style={styles.fgImage}
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Text content */}
      <View style={styles.textBlock}>
        <Text style={styles.heading}>Popular Dog Searches We Serve</Text>

        <View style={styles.list}>
          {searches.map((item, index) => (
            <View key={index} style={styles.listItem}>
              <FontAwesome name="paw" size={16} color={ORANGE} style={styles.pawIcon} />
              <Text style={styles.listText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFF6F0",
  },
  content: {
    paddingVertical: 60,
    paddingHorizontal: 24,
    alignItems: "center",
    gap: 40,
  },

  // ---- Image block ----
  imageOuter: {
    width: 320,
    height: 320,
    alignItems: "center",
    justifyContent: "center",
  },
  borderFrame: {
    position: "absolute",
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderWidth: 3,
    borderColor: ORANGE,
    borderRadius: 20,
  },
  imageCard: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  bgImage: {
    ...StyleSheet.absoluteFill,
    opacity: 0.7,
  },
  fgImage: {
    width: "100%",
    height: "100%",
  },

  // ---- Text block ----
  textBlock: {
    width: "100%",
    maxWidth: 480,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 20,
  },
  list: {
    gap: 14,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  pawIcon: {
    marginTop: 3,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
});