import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 40;

const joinButtons = [
  "Join as a Breeder",
  "Join as a Sitter",
  "Join as a Dog Trainer",
  "Join as a Dog Walker",
  "Join as a Dog Groomer",
  "Join as a Veterinarian",
];

const cards = [

  {
    src: require("@/assets/joinus/breed_2021.webp"),
    title: "Breed Selector",
    subtitle: "Select Your Breed In All Pets Type",
    button: "View Breeds",
  },
  {
    src: require("@/assets/joinus/compare_breed_2021.webp"),
    title: "Compare Breeds",
    subtitle: "Compare Between 2 Breeds",
    button: "View Breeds",
  },
  {
    src: require("@/assets/joinus/more_breed_2021.webp"),
    title: "More Breeds?",
    subtitle: "70+ Breeds Information here.",
    button: "View Breeds",
  },
];

export default function JoinUsSection() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Join Us Heading & Buttons Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.headingPrimary}>Join Us</Text>
        <View style={styles.buttonGrid}>
          {joinButtons.map((text, index) => (
            <TouchableOpacity
              key={index}
              style={styles.joinButton}
              activeOpacity={0.8}
            >
              <Text style={styles.joinButtonText}>{text}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Excited Section Banner */}
      <View style={styles.excitedBanner}>
        <Text style={styles.excitedTitle}>
          Excited to get a pet,{"\n"}
          <Text style={styles.excitedHighlight}>but still confused?</Text>
        </Text>
        <Text style={styles.excitedSubtext}>
          We're here to help you! Try MMP Tools and make the right choice!
        </Text>
      </View>

      {/* Pet Cards List */}
      <View style={styles.cardsGrid}>
        {cards.map((card, idx) => (
          <View key={idx} style={styles.cardContainer}>
            <Image source={card.src} style={styles.cardImage} resizeMode="cover" />

            {card.button ? (
              <View style={styles.overlayAction}>
                <Text style={styles.actionTitle}>{card.title}</Text>
                <Text style={styles.actionSubtitle}>{card.subtitle}</Text>
                <TouchableOpacity
                  style={styles.actionButton}
                  activeOpacity={0.85}
                >
                  <Text style={styles.actionButtonText}>{card.button}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.overlaySimple}>
                <Text style={styles.simpleTitle}>{card.title}</Text>
              </View>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: "#1F2937",
    alignItems: "center",
  },
  sectionHeader: {
    width: "100%",
    alignItems: "center",
    marginBottom: 32,
  },
  headingPrimary: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#55C5D0",
    marginBottom: 20,
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
    width: "100%",
  },
  joinButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: "45%",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  joinButtonText: {
    color: "#111827",
    fontSize: 12,
    fontWeight: "600",
  },
  excitedBanner: {
    alignItems: "center",
    marginBottom: 28,
    paddingHorizontal: 10,
  },
  excitedTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 28,
  },
  excitedHighlight: {
    color: "#FFAC0D",
  },
  excitedSubtext: {
    color: "#E5E7EB",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
  },
  cardsGrid: {
    width: "100%",
    gap: 20,
  },
  cardContainer: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  overlayAction: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 10,
    textAlign: "center",
  },
  actionButton: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  overlaySimple: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
    padding: 16,
  },
  simpleTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});