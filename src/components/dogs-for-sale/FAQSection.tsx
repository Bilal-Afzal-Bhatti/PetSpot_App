/**
 * FAQScreen.tsx
 * React Native conversion of the Next.js + Tailwind FAQ accordion page.
 *
 * Renders 10 FAQ items, all closed by default. Tapping a question row
 * toggles its answer with a smooth height/opacity animation. Multiple
 * items can be open at the same time.
 *
 * No extra packages required beyond core React Native
 * (uses the built-in `Animated` and `LayoutAnimation` APIs).
 */

import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const PURPLE = "#A78BFA"; // violet-400 equivalent

const faqs = [
  {
    q: "Should I get a dog?",
    a: "Dogs need time, care, patience, and consistent love. If you can provide a stable home, daily attention, and long-term responsibility, getting a dog can be one of the most rewarding decisions you'll ever make.",
  },
  {
    q: "How much does a dog cost in India?",
    a: "Price varies by breed, age, and seller — from low-cost adoption fees to several lakhs for rare pedigree pups. Consider lifetime costs (food, vet, grooming) too.",
  },
  {
    q: "Where can I get dogs in India from?",
    a: "You can adopt from local shelters, rescue groups, or buy from registered breeders. Always verify breeder credentials and prioritise adoption.",
  },
  {
    q: "Is it safe to buy dogs online in India?",
    a: "Buying online is possible but requires caution — verify seller reviews, request health records, and prefer meet-and-greet before payment.",
  },
  {
    q: "Why is Pets Corner a reliable option to buy dogs online in India?",
    a: "We list verified breeders, provide health reports, and enable secure communication between buyers and sellers (example placeholder answer).",
  },
  {
    q: "How do I prepare my home for a new dog?",
    a: "Dog-proofing your home, setting up a sleeping area, buying essentials (collar, leash, bowls), and scheduling a vet check are good first steps.",
  },
  {
    q: "What vaccinations does a puppy need?",
    a: "Puppies require core vaccines (distemper, parvo, hepatitis, rabies) and boosters — consult your vet for a schedule.",
  },
  {
    q: "How often should I groom my dog?",
    a: "Grooming frequency depends on coat type: short-haired dogs monthly, long-haired dogs weekly, and regular nail trims and ear cleaning as needed.",
  },
  {
    q: "Can I travel with my dog on public transport?",
    a: "Rules vary by city and transport provider. Many public systems require muzzles or carriers — check local regulations.",
  },
  {
    q: "What is the average lifespan of common dog breeds?",
    a: "Small breeds often live longer (12–16 years) while larger breeds have shorter lifespans (8–12 years). Many factors like genetics and care affect lifespan.",
  },
];

export default function FAQScreen() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Frequently Asked Questions</Text>
        <Text style={styles.subtitle}>
          These are questions that people commonly search for on Pets Corner
        </Text>
      </View>

      <View style={styles.list}>
        {faqs.map((item, i) => {
          const isOpen = !!open[i];
          return (
            <View key={i} style={styles.cardWrapper}>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => toggle(i)}
                style={styles.card}
              >
                <View style={styles.questionRow}>
                  <Text style={styles.question}>{item.q}</Text>
                </View>

                {isOpen && (
                  <View style={styles.answerBox}>
                    <Text style={styles.answer}>{item.a}</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Purple toggle square, positioned top-right, overlapping the card */}
              <View style={styles.toggleSquare}>
                <Feather
                  name="chevron-down"
                  size={16}
                  color="#fff"
                  style={{
                    transform: [{ rotate: isOpen ? "180deg" : "0deg" }],
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { paddingVertical: 48, paddingHorizontal: 20 },

  header: { alignItems: "center", marginBottom: 32 },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: "500",
    color: "#6B7280",
    textAlign: "center",
  },

  list: { gap: 28 },

  cardWrapper: { position: "relative" },

  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    // soft shadow (iOS)
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 },
    // elevation (Android)
    elevation: 3,
  },

  questionRow: { paddingRight: 24 },
  question: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
  },

  answerBox: { marginTop: 12 },
  answer: {
    fontSize: 14,
    lineHeight: 21,
    color: "#4B5563",
  },

  toggleSquare: {
    position: "absolute",
    right: 20,
    top: -12,
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});