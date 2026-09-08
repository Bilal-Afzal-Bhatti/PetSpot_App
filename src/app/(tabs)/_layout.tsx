import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuthStore } from "../../../Store/authStore";

const logoImage = require("../../../assets/app_images/petLogo.png");

// Base (content-only) tab bar height, safe-area inset is added on top of this
const BASE_TAB_HEIGHT = Platform.select({
  ios: 50,
  android: 56,
  default: 56,
});

export default function TabsLayout() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [menuVisible, setMenuVisible] = useState(false);

  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  const handleNavigation = (path: string) => {
    setMenuVisible(false);
    router.push(path as any);
  };

  const handleLogout = async () => {
    setMenuVisible(false);
    await logout();
    router.replace("/(auth)/login");
  };

  // Single source of truth for bottom safe area — no SafeAreaView double-wrapping.
  // insets.bottom = height of the phone's own gesture bar / nav buttons.
  const tabBarBottomPadding = insets.bottom > 0 ? insets.bottom : 8;
  const tabBarHeight = BASE_TAB_HEIGHT + tabBarBottomPadding;

  return (
    <View style={styles.safeContainer}>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: "#D86B35",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 16,
          },
          // React Navigation's header already respects insets.top natively —
          // no extra SafeAreaView needed here.
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setMenuVisible(true)}
              style={styles.menuButton}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="menu-outline" size={24} color="#ffffff" />
            </TouchableOpacity>
          ),
          tabBarActiveTintColor: "#D86B35",
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
          name="home"
          options={{
            title: "Home",
            headerTitle: () => (
              <View style={styles.headerLogoRow}>
                <Image
                  source={logoImage}
                  style={styles.smallLogo}
                  resizeMode="contain"
                />
                <Text style={styles.headerBrandText}>myPetshop</Text>
              </View>
            ),
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="pets"
          options={{
            title: "Pets",
            headerTitle: "Available Pets",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="breeds"
          options={{
            title: "Breeds",
            headerTitle: "Pet Breeds Directory",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ribbon-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="blog"
          options={{
            title: "Blog",
            headerTitle: "Pet Care Guides",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size - 2} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerTitle: "My Account",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size - 2} color={color} />
            ),
          }}
        />
      </Tabs>

      {/* Header Menu Dropdown Overlay */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            { paddingTop: insets.top + 8, paddingRight: 12 },
          ]}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.dropdownCard}>
            <Text style={styles.sectionHeader}>Categories</Text>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/(tabs)/pets")}
            >
              <Ionicons name="paw-outline" size={18} color="#D86B35" />
              <Text style={styles.menuItemText}>Pets for Sale</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/(tabs)/breeds")}
            >
              <Ionicons name="ribbon-outline" size={18} color="#D86B35" />
              <Text style={styles.menuItemText}>Pet Breeds</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleNavigation("/(tabs)/blog")}
            >
              <Ionicons name="newspaper-outline" size={18} color="#D86B35" />
              <Text style={styles.menuItemText}>Blog & Care</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {authUser ? (
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                <Text style={[styles.menuItemText, styles.logoutText]}>
                  Logout
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("/(auth)/login")}
              >
                <Ionicons name="log-in-outline" size={18} color="#D86B35" />
                <Text style={styles.menuItemText}>Login / Signup</Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  headerLogoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  smallLogo: {
    width: 32,
    height: 32,
  },
  headerBrandText: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#ffffff",
  },
  menuButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  dropdownCard: {
    width: 190,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 6,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#9CA3AF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  menuItemText: {
    fontSize: 13,
    color: "#1F2937",
    fontWeight: "500",
  },
  logoutText: {
    color: "#EF4444",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 4,
  },
});