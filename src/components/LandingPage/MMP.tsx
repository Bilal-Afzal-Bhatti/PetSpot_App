import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const features = [
  {
    image: require("@/assets/MMP/Healthy_Pet.png"),
    title: "Healthy Pet",
    description:
      "Being pet lovers ourself, we understand the importance of a pet’s health. All our puppies are at least eight weeks old when they are sent to you. Before your bundle of joy reaches you, he is required to undergo an extensive health checkup by a licensed veterinarian.",
    paws: require("@/assets/MMP/paws_01.png"),
  },
  {
    image: require("@/assets/MMP/Vaccinated.png"),
    title: "Vaccinated & Insured Pet",
    description:
      "To make the initial experience with your furry family member smooth and trouble-free, we make sure that all our puppies are up-to-date on their vaccinations and are insured.",
    paws: require("@/assets/MMP/paws_02.png"),
  },
  {
    image: require("@/assets/MMP/Responsible.png"),
    title: "Responsible Breeders",
    description:
      "All of our puppies are raised by responsible breeders who consider their pet’s health their foremost priority. We have zero tolerance for puppy mills and all our breeders are pet lovers just like us who are looking for the best homes for their fur babies.",
    paws: require("@/assets/MMP/paws_03.png"),
  },
  {
    image: require("@/assets/MMP/Process.png"),
    title: "Easy and Hassle-free Process",
    description:
      "With Pets Corner, your journey with a pet starts with no difficulties. You have access to adorable pets looking for furever homes nationwide. You can receive guidance regarding any pet-related aspect in the comfort of your home. We make sure that a healthy and happy pet is delivered to you and have a secured payment process.",
    paws: require("@/assets/MMP/paws_04.png"),
  },
  {
    image: require("@/assets/MMP/experts.png"),
    title: "Expert Pet Guidance",
    description:
      "Our pet experts will guide you throughout your journey as a pet parent and will always be at your beck and call there to help you.",
    paws: require("@/assets/MMP/paws_05.png"),
  },
  {
    image: require("@/assets/MMP/familya.png"),
    title: "Happy Pet Parenting",
    description:
      "We don’t stop at providing you with a furry family member and guidance related to it. We are also connected with service providers such as veterinarians, trainers, groomers, and hostels. We always make sure to provide you with the best of best.",
    paws: require("@/assets/MMP/paws_06.png"),
  },
];

export default function WhyMMP() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>
          Why <Text style={styles.headingHighlight}>Pets Corner?</Text>
        </Text>
        <Text style={styles.subtitle}>
          Looking for a furry companion? Know why Pets Corner is the perfect
          option for you.
        </Text>
      </View>

      {/* Cards List */}
      <View style={styles.cardsGrid}>
        {features.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <Animated.View
              key={idx}
              style={styles.card}
              layout={LinearTransition.duration(250)}
            >
              {/* Decorative Paws Overlay */}
              <Image
                source={item.paws}
                style={styles.pawsImage}
                resizeMode="contain"
              />

              {/* Card Main Content */}
              <View style={styles.cardContent}>
                {/* Feature Icon */}
                <Image
                  source={item.image}
                  style={styles.featureIcon}
                  resizeMode="contain"
                />

                {/* Title */}
                <Text style={styles.cardTitle}>{item.title}</Text>

                {/* Description with Truncation */}
                <Text
                  style={styles.cardDescription}
                  numberOfLines={isExpanded ? undefined : 3}
                  ellipsizeMode="tail"
                >
                  {item.description}
                </Text>
              </View>

              {/* Toggle Expand Button */}
              <TouchableOpacity
                onPress={() => toggleExpand(idx)}
                style={styles.toggleButton}
                activeOpacity={0.7}
              >
                <Text style={styles.toggleText}>
                  {isExpanded ? "View Less" : "View More"}
                </Text>
                <MaterialCommunityIcons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color="#1E7E8F"
                />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2937",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 6,
    textAlign: "center",
  },
  headingHighlight: {
    color: "#55C5D0",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.85)",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 18,
  },
  cardsGrid: {
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    position: "relative",
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    justifyContent: "space-between",
  },
  pawsImage: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 90,
    height: 90,
    opacity: 0.25,
  },
  cardContent: {
    zIndex: 1,
  },
  featureIcon: {
    width: 48,
    height: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 20,
  },
  toggleButton: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 2,
  },
  toggleText: {
    color: "#1E7E8F",
    fontSize: 13,
    fontWeight: "600",
  },
});