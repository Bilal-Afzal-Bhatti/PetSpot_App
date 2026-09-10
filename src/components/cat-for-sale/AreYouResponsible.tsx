import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
export default function AreYouResponsible() {
  return (
    <View style={styles.section}>
      <View style={styles.card}>
        {/* LEFT CONTENT */}
        <View style={styles.contentContainer}>
          <Text style={styles.heading}>Are you a responsible breeder?</Text>
          <Text style={styles.description}>
            Be part of our pet-lovers community — list your litters online and get discovered nationwide!
          </Text>
        </View>

        {/* BUTTON */}
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Join Now!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  contentContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  heading: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 20,
  },
  button: {
    backgroundColor: "#9A79D7",
    width: 112,
    height: 48,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "500",
    fontSize: 14,
  },
});