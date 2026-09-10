import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

export default function PopularCatSearches() {
  const searches = [
    "Where to buy a healthy kitten in Pakistan",
    "Cats for sale near me with price",
    "Buy Persian cat with certified papers",
    "Low-shedding cats for families in Pakistan",
    "Hypoallergenic cat breeds Pakistan",
    "Best apartment cats Pakistan",
    "Easy cats for first-time pet parents",
    "Buy kittens online from responsible Pakistani breeders",
  ];

  return (
    <ScrollView contentContainerStyle={styles.section}>
      <View style={styles.container}>
        {/* Main Section */}
        <View style={styles.mainContent}>
          {/* Left Images */}
          <View style={styles.imageWrapper}>
            {/* Outer Decorative Border */}
            <View style={styles.outerBorder} />

            {/* Foreground Container with Background Overlay */}
            <View style={styles.innerImageContainer}>
              {/* Background Image */}
              <Image
                source={require("../../../assets/bgsearches.png")} // Update to your local background image path
                style={styles.backgroundImage}
              />
              {/* Foreground Image */}
              <Image
                source={require("../../../assets/searches.jpg")} // Update to your local foreground image path
                style={styles.foregroundImage}
              />
            </View>
          </View>

          {/* Right Text */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Popular Cat Searches We Serve</Text>
            <View style={styles.listContainer}>
              {searches.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <FontAwesome5
                    name="bone"
                    size={14}
                    color="#FBB885"
                    style={styles.boneIcon}
                  />
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFF6F0",
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  container: {
    maxWidth: 600,
    width: "100%",
    alignSelf: "center",
  },
  mainContent: {
    flexDirection: "column",
    alignItems: "center",
    gap: 32,
  },
  imageWrapper: {
    position: "relative",
    padding: 12,
  },
  outerBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 3,
    borderColor: "#FBB885",
    borderRadius: 16,
  },
  innerImageContainer: {
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    width: 320,
    height: 320,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.7,
  },
  foregroundImage: {
    width: 280,
    height: 280,
    borderRadius: 12,
    resizeMode: "cover",
    zIndex: 10,
  },
  textContainer: {
    width: "100%",
    maxWidth: 400,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 20,
    textAlign: "center",
  },
  listContainer: {
    gap: 16,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  boneIcon: {
    marginTop: 4,
  },
  listText: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
    lineHeight: 20,
  },
});