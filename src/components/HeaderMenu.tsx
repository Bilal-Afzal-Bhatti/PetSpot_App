import { useAuthStore } from "@/../Store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const logoImage = require("@/../assets/app_images/petLogo.png");
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DRAWER_WIDTH = SCREEN_WIDTH * 0.7;

export default function HeaderMenu() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const [petsExpanded, setPetsExpanded] = useState(false);
  const [breedsExpanded, setBreedsExpanded] = useState(false);
  const [blogExpanded, setBlogExpanded] = useState(false);

  const authUser = useAuthStore((state) => state.authUser);
  const logout = useAuthStore((state) => state.logout);

  const handleNavigation = (path: Href) => {
    setDrawerVisible(false);
    router.push(path);
  };

  const handleLogout = async () => {
    setDrawerVisible(false);
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: insets.top, height: 60 + insets.top },
      ]}
    >
      {/* 1. Left: Hamburger Icon */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => setDrawerVisible(true)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="menu-outline" size={28} color="#ffffff" />
      </TouchableOpacity>

      {/* 2. Middle: Logo and Name */}
      <TouchableOpacity
        style={styles.logoRow}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brandTitle}>myPetshop</Text>
      </TouchableOpacity>

      {/* 3. Right: Avatar or Profile Icon */}
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() =>
          authUser
            ? router.push("/(tabs)/profile")
            : router.push("/(auth)/login")
        }
      >
        {authUser ? (
          authUser.profileImage ? (
            <Image
              source={{ uri: authUser.profileImage }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarInitialContainer}>
              <Text style={styles.avatarInitialText}>
                {authUser.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
          )
        ) : (
          <Ionicons name="person-circle-outline" size={30} color="#ffffff" />
        )}
      </TouchableOpacity>

      {/* Slide-out Side Drawer */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          {/* Backdrop */}
          <Pressable
            style={styles.backdrop}
            onPress={() => setDrawerVisible(false)}
          />

          {/* Drawer Content Surface */}
          <View
            style={[
              styles.drawerContainer,
              { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
            ]}
          >
            <View style={styles.drawerHeader}>
              <View style={styles.drawerBrand}>
                <Image
                  source={logoImage}
                  style={styles.drawerLogo}
                  resizeMode="contain"
                />
                <Text style={styles.drawerBrandText}>Menu</Text>
              </View>
              <TouchableOpacity onPress={() => setDrawerVisible(false)}>
                <Ionicons name="close" size={26} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.scrollFlex}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.drawerScroll}
            >
              {/* SECTION 1: PETS */}
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setPetsExpanded(!petsExpanded)}
              >
                <View style={styles.accordionTitleRow}>
                  <Ionicons name="paw-outline" size={22} color="#FFAC0D" />
                  <Text style={styles.accordionTitle}>Pets</Text>
                </View>
                <Ionicons
                  name={petsExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#FFAC0D"
                />
              </TouchableOpacity>
              {petsExpanded && (
                <View style={styles.subItemContainer}>
                  <TouchableOpacity
                    style={styles.subMenuItem}
                    onPress={() =>
                      handleNavigation({
                        pathname: "/(dogs)/for-sale",
                        params: { type: "dog" },
                      })
                    }
                  >
                    <Text style={styles.subMenuItemText}>Dogs for Sale</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.subMenuItem}
                    onPress={() =>
                      handleNavigation({
                        pathname: "/(cats)/for-sale",
                        params: { type: "cat" },

                      })
                    }
                  >
                    <Text style={styles.subMenuItemText}>Cats for Sale</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.divider} />

              {/* SECTION 2: BREEDS */}
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setBreedsExpanded(!breedsExpanded)}
              >
                <View style={styles.accordionTitleRow}>
                  <Ionicons name="ribbon-outline" size={22} color="#FFAC0D" />
                  <Text style={styles.accordionTitle}>Breeds</Text>
                </View>
                <Ionicons
                  name={breedsExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#FFAC0D"
                />
              </TouchableOpacity>
              {breedsExpanded && (
                <View style={styles.subItemContainer}>
                  <TouchableOpacity
                    style={styles.subMenuItem}
                    onPress={() => handleNavigation("/(tabs)/breed/dog-breed")}
                  >
                    <Text style={styles.subMenuItemText}>Dog Breeds</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.subMenuItem}
                    onPress={() => handleNavigation("/(tabs)/breed/cat-breed")}
                  >
                    <Text style={styles.subMenuItemText}>Cat Breeds</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.divider} />

              {/* SECTION 3: BLOG */}
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setBlogExpanded(!blogExpanded)}
              >
                <View style={styles.accordionTitleRow}>
                  <Ionicons name="newspaper-outline" size={22} color="#FFAC0D" />
                  <Text style={styles.accordionTitle}>Blog Care</Text>
                </View>
                <Ionicons
                  name={blogExpanded ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#FFAC0D"
                />
              </TouchableOpacity>
              {blogExpanded && (
                <View style={styles.subItemContainer}>
                  <TouchableOpacity
                    style={styles.subMenuItem}
                    onPress={() => handleNavigation("/(tabs)/blog/dog-care")}
                  >
                    <Text style={styles.subMenuItemText}>Dog Care</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.subMenuItem}
                    onPress={() => handleNavigation("/(tabs)/blog/cat-care")}
                  >
                    <Text style={styles.subMenuItemText}>Cat Care</Text>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.divider} />

              {/* SECTION 4: DASHBOARD */}
              <TouchableOpacity
                style={styles.directMenuItem}
                onPress={() => handleNavigation("/(dashboard)")}
              >
                <Ionicons name="grid-outline" size={22} color="#FFAC0D" />
                <Text style={styles.directMenuText}>Dashboard</Text>
              </TouchableOpacity>
            </ScrollView>

            {/* Bottom Pinned Footer */}
            <View style={styles.drawerFooter}>
              {authUser ? (
                <TouchableOpacity
                  style={styles.directMenuItem}
                  onPress={handleLogout}
                >
                  <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                  <Text style={[styles.directMenuText, styles.logoutText]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.directMenuItem}
                  onPress={() => handleNavigation("/(auth)/login")}
                >
                  <Ionicons name="log-in-outline" size={22} color="#FFAC0D" />
                  <Text style={styles.directMenuText}>Login / Signup</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#191C33",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    zIndex: 10,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: { width: 30, height: 30 },
  brandTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  headerButton: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  avatarInitialContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFAC0D",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitialText: { color: "#ffffff", fontSize: 14, fontWeight: "bold" },

  modalOverlay: {
    flex: 1,
    flexDirection: "row",
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  drawerContainer: {
    width: DRAWER_WIDTH,
    backgroundColor: "#191C33",
    height: "100%",
    paddingHorizontal: 16,
    elevation: 16,
    shadowColor: "#000",
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 1,
  },
  drawerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.15)",
  },
  drawerBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  drawerLogo: {
    width: 66,
    height: 66,
    flexShrink: 0,
  },
  drawerBrandText: { fontSize: 18, fontWeight: "bold", color: "#FFAC0D" },
  scrollFlex: {
    flex: 1,
  },
  drawerScroll: {
    paddingVertical: 12,
  },
  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.15)",
    paddingTop: 8,
  },

  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
  },
  accordionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accordionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFAC0D",
  },
  subItemContainer: {
    paddingLeft: 34,
    paddingVertical: 4,
  },
  subMenuItem: {
    paddingVertical: 10,
  },
  subMenuItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFAC0D",
  },
  directMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  directMenuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFAC0D",
  },
  logoutText: {
    color: "#EF4444",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 6,
  },
});