import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

type BreedNavbarProps = {
  scrollY: Animated.Value; // pass this from the parent ScrollView
  onViewPuppies?: () => void;
};

export default function BreedNavbar({ scrollY, onViewPuppies }: BreedNavbarProps) {
  // Slide down when scrollY > 50, slide up (hidden) when <= 50
  const translateY = scrollY.interpolate({
    inputRange: [0, 50, 51],
    outputRange: [-80, -80, 0],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.navbar, { transform: [{ translateY }] }]}>
      <View style={styles.row}>
        <Text style={styles.logo}>🐾 Pets Corner</Text>
        <TouchableOpacity style={styles.button} onPress={onViewPuppies}>
          <Text style={styles.buttonText}>View Puppies</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    backgroundColor: "#0B2545", // 🔁 replace with your --bg-dark color
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  row: {
    width: "100%",
    maxWidth: 1152,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  logo: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
  button: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  buttonText: {
    color: "#028D8F",
    fontWeight: "500",
    fontSize: 14,
  },
});