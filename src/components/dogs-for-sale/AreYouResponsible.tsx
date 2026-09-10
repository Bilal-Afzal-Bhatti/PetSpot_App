import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function AreYouResponsible() {
  return (
    <ScrollView contentContainerStyle={styles.section}>
      <View style={styles.card}>
        {/* LEFT CONTENT */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Are you a responsible dog breeder?</Text>
          <Text style={styles.subtitle}>
            Be part of our pet-lovers community — list your litters online and
            get discovered nationwide!
          </Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Join Now!</Text>
          <Feather name="arrow-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 24,
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    flexDirection: "column",
    alignItems: "center",
    // Clean shadow styling for React Native cross-platform support
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#8E5AF7", // Using primary brand token color (matches your previous components)
    width: 120,
    height: 48,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 14,
  },
});