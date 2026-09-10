import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const { width } = Dimensions.get("window");

export default function Feedback() {
  const feedbacks = [
    {
      name: "Anuja Goenka",
      text: "Great service! I'm very happy with their service response and coordination. Mr. & Mrs. deliver very healthy lovable pups — special thanks to Jai who took care of everything till delivery.",
      image: require("../assets/Feedback/feedback1.png"), // Update to your local image require paths
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

  const [current, setCurrent] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % feedbacks.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [feedbacks.length]);

  return (
    <View style={styles.section}>
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>MMP Customer Feedback</Text>
        <Text style={styles.subtitle}>
          Have a look at what people say about us. It reflects our commitment to
          offering quality pet care.
        </Text>
      </View>

      {/* Purple Background Bar */}
      <View style={styles.purpleBar} />

      {/* Feedback Card */}
      <View style={styles.cardWrapper}>
        <View style={styles.card}>
          {/* Profile Image */}
          <View style={styles.imageContainer}>
            <Image
              source={feedbacks[current].image}
              style={styles.profileImage}
            />
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.name}>{feedbacks[current].name}</Text>
            <Text style={styles.text}>{feedbacks[current].text}</Text>
            
            {/* Star Ratings */}
            <View style={styles.starsRow}>
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <FontAwesome key={i} name="star" size={16} color="#FFD700" style={{ marginHorizontal: 2 }} />
                ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    position: "relative",
    backgroundColor: "#FAFAFA",
    paddingVertical: 40,
    overflow: "hidden",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
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
    height: 112,
    backgroundColor: "#9B76E8",
  },
  cardWrapper: {
    position: "relative",
    maxWidth: 600,
    width: "90%",
    alignSelf: "center",
    zIndex: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 24,
    paddingTop: 40,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#9a79d7",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  imageContainer: {
    position: "absolute",
    top: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#9a79d7",
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
});