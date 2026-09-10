import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";

export default function GuaranteeBadges() {
  return (
    <ScrollView>
    <View style={styles.wrapper}>
      <View style={styles.row}>
        {/* Best Price Guarantee */}
        <View style={styles.badgeItem}>
          <View style={styles.iconBox}>
            <FontAwesome
              name="tag"
              size={22}
              color="#CA8A04"
              style={styles.tagIcon}
            />
          </View>
          <Text style={styles.badgeText} numberOfLines={2}>
            <Text style={styles.textGray}>BEST PRICE{"\n"}</Text>
            <Text style={styles.textTeal}>GUARANTEE</Text>
          </Text>
        </View>

        {/* Pets You'll Love */}
        <View style={styles.badgeItem}>
          <View style={[styles.iconBox, styles.iconBoxCircle]}>
            <FontAwesome name="check-circle" size={18} color="#0F766E" />
          </View>
          <Text style={styles.badgeText} numberOfLines={2}>
            <Text style={styles.textTeal}>PETS{"\n"}</Text>
            <Text style={styles.textGray}>YOU'LL LOVE</Text>
          </Text>
        </View>

        {/* Instant Confirmation */}
        <View style={styles.badgeItem}>
          <View style={styles.iconBox}>
            <FontAwesome5 name="mobile-alt" size={20} color="#3B82F6" />
          </View>
          <Text style={styles.badgeText} numberOfLines={2}>
            <Text style={styles.textTeal}>INSTANT{"\n"}</Text>
            <Text style={styles.textGray}>CONFIRMATION</Text>
          </Text>
        </View>
      </View>
    </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  badgeItem: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  iconBox: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  iconBoxCircle: {
    backgroundColor: "#D1FAE5",
    borderRadius: 18,
  },
  tagIcon: {
    transform: [{ rotate: "-12deg" }],
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
    lineHeight: 15,
  },
  textGray: {
    color: "#1F2937",
  },
  textTeal: {
    color: "#0F766E",
  },
});