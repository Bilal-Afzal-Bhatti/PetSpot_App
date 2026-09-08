import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function BlogsNavbar() {
  const router = useRouter();
  const [active, setActive] = useState("Dogs"); // Default active tab

  const tabs = ["Dogs", "Cats", "Small Pets"];

  const handlePress = (tab: string) => {
    setActive(tab);

    // Custom navigation paths
    let path = "/blog";
    if (tab === "Dogs") path += "/dog-care";
    else if (tab === "Cats") path += "/cat-care";
    else if (tab === "Small Pets") path += "/small-pets";

    router.push(path as any);
  };

  return (
    <View style={styles.nav}>
      <View style={styles.tabRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handlePress(tab)}
            style={[
              styles.tabItem,
              active === tab && styles.tabItemActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                active === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingTop: 12,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabItemActive: {
    borderBottomColor: "#007b80",
  },
  tabText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#374151",
  },
  tabTextActive: {
    color: "#007b80",
  },
});