import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function BreederBanner() {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.leftSection}>
          <View style={styles.iconBox}>
           <Image
  source={require("@/assets/Breed/breed_register.webp")}
  style={styles.icon}
  resizeMode="contain"
/>
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.heading}>ARE YOU A BREEDER?</Text>
            <Text style={styles.subtext}>
              It takes only a few clicks to connect with genuine pet lovers.{" "}
              <Text style={styles.registerNow}>Register Now!</Text>
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Add Your Pet</Text>
          <FontAwesome name="angle-right" size={14} color="#fff" style={styles.buttonIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1152, // max-w-6xl equivalent
    alignSelf: "center",
    backgroundColor: "#fff",
  },
  row: {
    paddingHorizontal: 24,
    paddingVertical: 28,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 6,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 36,
    height: 36,
  },
  textWrap: {
    flexShrink: 1,
  },
  heading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#17A2B8",
  },
  subtext: {
    fontSize: 15,
    color: "#000",
    marginTop: 2,
  },
  registerNow: {
    color: "#17A2B8",
    fontWeight: "500",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#028D8F",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
  buttonIcon: {
    marginLeft: 8,
  },
});