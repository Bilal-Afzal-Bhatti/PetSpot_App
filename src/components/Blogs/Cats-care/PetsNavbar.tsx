import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function PetsNavbar() {
  const router = useRouter();
  const [active, setActive] = useState("");

  const tabs = [
    { name: "Dog Care", href: "/blog/dog-care" },
    { name: "Cat Care", href: "/blog/cat-care" },
    { name: "Small Pet Care", href: "/blog/small-pets" },
  ];

  const handlePress = (tab: { name: string; href: string }) => {
    setActive(tab.name);
    router.push(tab.href as any);
  };

  return (
    <View style={styles.nav}>
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={() => handlePress(tab)}
            style={[
              styles.tabItem,
              active === tab.name && styles.tabItemActive,
            ]}
            activeOpacity={0.8}
          >
            <Text style={styles.tabText}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: "100%",
    backgroundColor: "#018F98",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
  },
  tabItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 6,
  },
  tabItemActive: {
    backgroundColor: "#07828A",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
  },
});