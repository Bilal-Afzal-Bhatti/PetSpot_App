import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";

const services = [
  {
    title: "Dog Grooming",
    iconName: "content-cut",
    iconType: "MaterialCommunityIcons",
    hasBooking: true,
  },
  {
    title: "Dog Hostel",
    iconName: "home-heart",
    iconType: "MaterialCommunityIcons",
    hasBooking: true,
  },
  {
    title: "Dog Training",
    iconName: "dog-side",
    iconType: "MaterialCommunityIcons",
    hasBooking: true,
  },
  {
    title: "Pet Adoption",
    iconName: "heart",
    iconType: "FontAwesome5",
    hasBooking: true,
  },
  {
    title: "Mating Services",
    iconName: "paw",
    iconType: "FontAwesome5",
    hasBooking: false,
  },
];

export default function ServicesSection() {
  return (
    <View style={styles.container}>
      {/* Section Header */}
      <Text style={styles.heading}>
        Exciting Services <Text style={styles.headingHighlight}>For Your Pets</Text>
      </Text>

      {/* Vertical Services List */}
      <View style={styles.listContainer}>
        {services.map((service, index) => (
          <View key={index} style={styles.serviceCard}>
            <View style={styles.leftSection}>
              <View style={styles.iconContainer}>
                {service.iconType === "MaterialCommunityIcons" ? (
                  <MaterialCommunityIcons
                    name={service.iconName as any}
                    size={22}
                    color="#FFAC0D"
                  />
                ) : (
                  <FontAwesome5
                    name={service.iconName as any}
                    size={20}
                    color="#FFAC0D"
                  />
                )}
              </View>
              <Text style={styles.serviceTitle}>{service.title}</Text>
            </View>

            {service.hasBooking && (
              <TouchableOpacity style={styles.bookButton} activeOpacity={0.8}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 24,
  },
  headingHighlight: {
    color: "#55C5D0",
    fontWeight: "bold",
  },
  listContainer: {
    gap: 12,
  },
  serviceCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFFBEB",
    justifyContent: "center",
    alignItems: "center",
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  bookButton: {
    backgroundColor: "#1F2937",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  bookButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});