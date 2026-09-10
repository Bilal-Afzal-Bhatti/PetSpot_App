import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

const considerations = [
  {
    title: "Indoor vs. Outdoor Needs",
    desc: "Most purebred cats are best kept indoors.",
  },
  {
    title: "Grooming & Maintenance",
    desc: "Persian cats need regular grooming; British Shorthairs are low-maintenance.",
  },
  {
    title: "Temperament",
    desc: "Long-haired breeds prefer cooler homes; shorthairs adapt better to Pakistani summers.",
  },
  {
    title: "Climate Suitability",
    desc: "Choose breeds suited to local weather conditions and seasonal temperature variations.",
  },
  {
    title: "Time Commitment",
    desc: "Some cats are independent, others need constant affection. Choose based on your availability and lifestyle.",
  },
  {
    title: "Budget",
    desc: "Consider not only purchase cost but also ongoing vet care, grooming, and food expenses.",
  },
];

export default function ThingsToConsider() {
  return (
    <ScrollView contentContainerStyle={styles.section}>
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Things To Consider While Selecting a Cat Breed</Text>
        <Text style={styles.subtitle}>
          Choosing the right cat starts with your lifestyle. Here’s what to keep
          in mind:
        </Text>
      </View>

      {/* Grid Cards Container */}
      <View style={styles.gridContainer}>
        {considerations.map((item, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.desc}</Text>
            </View>
            {/* Background Paw Shape */}
            <Image
              source={require("../../../assets/shape_paw.svg")} // Update to your local SVG/PNG path
              style={styles.pawImage}
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    height: 180,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    marginBottom: 8,
  },
  cardContent: {
    zIndex: 2,
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 20,
  },
  pawImage: {
    position: "absolute",
    right: -10,
    bottom: -10,
    width: 80,
    height: 80,
    resizeMode: "contain",
    opacity: 0.8,
    zIndex: 1,
  },
});