import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function BreedDetails() {
  return (
    <View style={styles.container}>
      {/* === Health Section === */}
      <View style={styles.healthSection}>
        <Text style={styles.healthTitle}>Health</Text>
        <View style={styles.healthGrid}>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Hypothyroidism</Text>
            <Text style={styles.healthValue}>High</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Hip Dysplasia</Text>
            <Text style={styles.healthValue}>Medium</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Démodé tic Mange</Text>
            <Text style={styles.healthValue}>Medium</Text>
          </View>
          <View style={styles.healthItem}>
            <Text style={styles.healthLabel}>Cataracts</Text>
            <Text style={styles.healthValue}>High</Text>
          </View>
        </View>
      </View>

      {/* === Other Info === */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Info</Text>
        <View style={styles.otherInfoGrid}>
          <View style={styles.otherInfoItem}>
            <Text style={styles.infoLabel}>Hypoallergenic:</Text>
            <Text style={styles.infoValue}>Yes</Text>
          </View>
          <View style={styles.otherInfoItem}>
            <Text style={styles.infoLabel}>Litter Size:</Text>
            <Text style={styles.infoValue}>6–8</Text>
          </View>
          <View style={styles.otherInfoItem}>
            <Text style={styles.infoLabel}>Weight Gain Potential:</Text>
            <Text style={styles.infoValue}>Low</Text>
          </View>
          <View style={styles.otherInfoItem}>
            <Text style={styles.infoLabel}>Drooling Tendency:</Text>
            <Text style={styles.infoValue}>Low</Text>
          </View>
        </View>
      </View>

      {/* === Characteristics === */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Characteristics</Text>
        <Text style={styles.characteristicsList}>
          Alert, Friendly, Intelligent, Loyal, Playful, Quiet
        </Text>

        <View style={styles.characteristicsGrid}>
          <View style={styles.characteristicItem}>
            <Text style={styles.infoLabel}>Sensitivity Level:</Text>
            <Text style={styles.charValue}>High</Text>
          </View>
          <View style={styles.characteristicItem}>
            <Text style={styles.infoLabel}>Barking:</Text>
            <Text style={styles.charValue}>Occasional</Text>
          </View>
          <View style={styles.characteristicItem}>
            <Text style={styles.infoLabel}>Mouthiness:</Text>
            <Text style={styles.charValue}>Considerable</Text>
          </View>
          <View style={styles.characteristicItem}>
            <Text style={styles.infoLabel}>Hunting Drive:</Text>
            <Text style={styles.charValue}>Medium</Text>
          </View>
          <View style={styles.characteristicItem}>
            <Text style={styles.infoLabel}>Impulse to Wander:</Text>
            <Text style={styles.charValue}>Low</Text>
          </View>
        </View>
      </View>

      {/* === Breed Image === */}
      <View style={styles.imageWrap}>
        <Image
          source={require("@/assets/HeroSectionBG/rottweiler.webp")} // 🔁 adjust path to your assets
          style={styles.breedImage}
          resizeMode="contain"
        />
      </View>

      {/* === Suitable For === */}
      <View style={styles.suitableRow}>
        <View style={styles.suitableItem}>
          <FontAwesome name="users" size={24} color="#018F98" />
          <Text style={styles.suitableLabel}>Couples</Text>
        </View>

        <View style={styles.suitableItem}>
          <FontAwesome name="user-plus" size={24} color="#018F98" />
          <Text style={styles.suitableLabel}>New Owners</Text>
        </View>

        <View style={styles.suitableItem}>
          <FontAwesome name="user" size={24} color="#018F98" />
          <Text style={styles.suitableLabel}>Citizens</Text>
        </View>

        <View style={styles.suitableItem}>
          <FontAwesome name="child" size={24} color="#018F98" />
          <Text style={styles.suitableLabel}>Kids</Text>
        </View>

        <View style={styles.suitableItem}>
          <FontAwesome name="home" size={24} color="#018F98" />
          <Text style={styles.suitableLabel}>Family</Text>
        </View>

        <View style={styles.suitableItem}>
          <FontAwesome name="shield" size={24} color="#018F98" />
          <Text style={styles.suitableLabel}>Security</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  // Health section
  healthSection: {
    backgroundColor: "#0891B2", // 🔁 replace with your --gradient-hero color (or use LinearGradient once installed)
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  healthTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  healthGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  healthItem: {
    width: "50%",
    marginBottom: 8,
  },
  healthLabel: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 13,
    marginBottom: 4,
  },
  healthValue: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 11,
  },

  // Generic sections
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontWeight: "600",
    color: "#018F98",
    fontSize: 15,
    marginBottom: 8,
  },

  // Other info
  otherInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  otherInfoItem: {
    width: "50%",
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: "700",
    fontSize: 12,
    color: "#000",
  },
  infoValue: {
    fontSize: 12,
    color: "#000",
  },

  // Characteristics
  characteristicsList: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 16,
  },
  characteristicsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  characteristicItem: {
    width: "50%",
    marginBottom: 8,
  },
  charValue: {
    fontSize: 14,
    color: "#374151",
  },

  // Image
  imageWrap: {
    width: "100%",
    height: 260,
  },
  breedImage: {
    width: "100%",
    height: "100%",
  },

  // Suitable for
  suitableRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 20,
  },
  suitableItem: {
    alignItems: "center",
    gap: 4,
    width: "33%",
    marginBottom: 12,
  },
  suitableLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
  },
});