/**
 * FeedbackSection.tsx
 * React Native conversion of the Next.js Feedback (testimonial carousel) component.
 *
 * Auto-advances through 3 testimonials every 4 seconds, with a fade
 * cross-transition between slides.
 *
 * Notes on conversion:
 *  - `next/image` -> RN `Image`, sourced from local assets (see comment below).
 *  - CSS `transition-all duration-700` -> RN `Animated.timing` fade.
 *  - `react-icons/fa` FaStar -> `react-native-vector-icons/FontAwesome`.
 *  - The absolute-positioned purple bar behind the card is recreated with
 *    a plain `View` positioned via `top`/`height`.
 *
 * Required package: react-native-vector-icons
 */

import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, Animated, Dimensions } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const PURPLE = "#9B76E8";
const GOLD = "#FFD700";

const feedbacks = [
  {
    name: "Anuja Goenka",
    text: "Great service! I'm very happy with their service response and coordination. Mr. & Mrs. deliver very healthy lovable pups — special thanks to Jai who took care of everything till delivery.",
    // Point this at your local asset or a remote URL:
    image: require("../assets/Feedback/feedback1.png"),
  },
  {
    name: "Rahul Sharma",
    text: "Fantastic experience! The MMP team made the process effortless and kept me informed at every step. My puppy arrived happy and healthy. special thanks to Jai who took care of everything till delivery.",
    image: require("../assets/Feedback/feedback2.png"),
  },
  {
    name: "Neha Patel",
    text: "Really impressed with the communication and love they show for pets. Transparent process and great care throughout. Highly recommend! special thanks to Jai who took care of everything till delivery.",
    image: require("../assets/Feedback/feedback3.png"),
  },
];

export default function FeedbackSection() {
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Auto-slide every 4 seconds, with a quick fade out/in on change
  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setCurrent((prev) => (prev + 1) % feedbacks.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  const active = feedbacks[current];

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text style={styles.title}>MMP Customer Feedback</Text>
        <Text style={styles.subtitle}>
          Have a look at what people say about us. It reflects our commitment
          to offering quality pet care.
        </Text>
      </View>

      {/* Purple background bar */}
      <View style={styles.purpleBar} />

      {/* Feedback card */}
      <Animated.View style={[styles.cardWrapper, { opacity: fadeAnim }]}>
        <View style={styles.card}>
          {/* Profile image, overlapping the top edge of the card */}
          <View style={styles.avatarWrapper}>
            <Image source={active.image} style={styles.avatar} resizeMode="cover" />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.name}>{active.name}</Text>
            <Text style={styles.text}>{active.text}</Text>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FontAwesome key={i} name="star" size={16} color={GOLD} style={{ marginHorizontal: 2 }} />
              ))}
            </View>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

const CARD_WIDTH = Math.min(SCREEN_WIDTH - 40, 480);

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FAFAFA",
    paddingVertical: 60,
    overflow: "hidden",
  },

  header: {
    alignItems: "center",
    marginBottom: 90,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
  },

  purpleBar: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "55%",
    height: 110,
    backgroundColor: PURPLE,
  },

  cardWrapper: {
    alignSelf: "center",
    width: CARD_WIDTH,
    zIndex: 10,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#9a79d7",
    paddingHorizontal: 32,
    paddingTop: 48,
    paddingBottom: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 25,
    shadowOffset: { width: 0, height: 0 },
    elevation: 6,
  },

  avatarWrapper: {
    position: "absolute",
    top: -40,
    alignSelf: "center",
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#e5e7eb",
  },
  avatar: { width: "100%", height: "100%" },

  cardContent: { alignItems: "center" },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});