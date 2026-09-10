import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

export default function WinningFormula() {
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
      desc: "A certified vet conducts a full-body checkup, vaccinations, and health screening.",
    },
  ];



  return (
    <ScrollView contentContainerStyle={styles.section}>
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Our Winning Formula</Text>
        <Text style={styles.subtitle}>
          MMP ensures quality, safety, and love in every step of your pet’s
          journey.
        </Text>
      </View>

      <View style={styles.container}>
        {/* Left Side Steps */}
        <View style={styles.stepColumn}>
          {stepsLeft.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.badgeLeft}>
                <Text style={styles.badgeTextLeft}>{item.id}</Text>
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Center Illustration Image */}
        <View style={styles.imageContainer}>
          <Image
            source={require("../../../assets/combodog.svg")} // Update to your local file asset path (.svg or .png)
            style={styles.image}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFF6F0",
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#4B5563",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    gap: 20,
  },
  stepColumn: {
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeLeft: {
    backgroundColor: "#FDDDC6",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  badgeTextLeft: {
    color: "#E4823A",
    fontWeight: "700",
    fontSize: 14,
  },
  badgeRight: {
    backgroundColor: "#FFCEA7",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    flexShrink: 0,
  },
  badgeTextRight: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  textWrapper: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: 280,
    height: 280,
    resizeMode: "contain",
  },
});