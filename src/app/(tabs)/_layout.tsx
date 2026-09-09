import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Update relative path to match your component directory
import HeaderMenu from "@/components/HeaderMenu";

const BASE_TAB_HEIGHT = Platform.select({
  ios: 50,
  android: 56,
  default: 56,
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  const tabBarBottomPadding = insets.bottom > 0 ? insets.bottom : 8;
  const tabBarHeight = BASE_TAB_HEIGHT + tabBarBottomPadding;

  return (
    <View style={styles.safeContainer}>
      {/* Global Header Menu */}
      <HeaderMenu />

      <Tabs
        screenOptions={{
          headerShown: false, // Completely removes default React Navigation header
          tabBarActiveTintColor: "#191C33",
          tabBarInactiveTintColor: "#6B7280",
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#E5E7EB",
            height: tabBarHeight,
            paddingBottom: tabBarBottomPadding,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "500",
            marginBottom: 0,
          },
        }}
      >
        <Tabs.Screen
          name="pets"
          options={{
            title: "Pets",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="breed"
          options={{
            title: "Breeds",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ribbon-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: "Blog",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size - 2} color={color} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});