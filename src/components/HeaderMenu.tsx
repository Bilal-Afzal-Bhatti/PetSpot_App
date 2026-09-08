import { useAuthStore } from "@/../Store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
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

export default function HeaderMenu() {
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

  return (
    <View
      style={[
        styles.headerContainer,
        { paddingTop: insets.top, height: 60 + insets.top },
      ]}
    >
      <TouchableOpacity
        style={styles.logoRow}
        onPress={() => router.push("/(tabs)/home")}
      >
        <Image source={logoImage} style={styles.logo} resizeMode="contain" />
        <Text style={styles.brandTitle}>myPetshop</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => setMenuVisible(true)}
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
                {authUser.name ? authUser.name[0]?.toUpperCase() : "U"}
              </Text>
            </View>
          )
        ) : (
          <Ionicons name="menu-outline" size={28} color="#ffffff" />
        )}
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <Pressable
          style={[
            styles.modalOverlay,
            { paddingTop: insets.top + 60 + 8 },
          ]}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.dropdownCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.sectionHeader}>Pets</Text>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("/(tabs)/Blogs/dog-care")}
              >
                <Ionicons name="paw-outline" size={18} color="#D86B35" />
                <Text style={styles.menuItemText}>Dogs for Sale</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("/(tabs)/home")}
              >
                <Ionicons name="paw-outline" size={18} color="#D86B35" />
                <Text style={styles.menuItemText}>Cats for Sale</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>Breeds</Text>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("/(tabs)/home")}
              >
                <Ionicons name="ribbon-outline" size={18} color="#D86B35" />
                <Text style={styles.menuItemText}>Dog Breeds</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("/(tabs)/home")}
              >
                <Ionicons name="ribbon-outline" size={18} color="#D86B35" />
                <Text style={styles.menuItemText}>Cat Breeds</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              <Text style={styles.sectionHeader}>Blog & Care</Text>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("/(tabs)/Blogs/dog-care")}
              >
                <Ionicons name="newspaper-outline" size={18} color="#D86B35" />
                <Text style={styles.menuItemText}>Dog Care</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigation("/(tabs)/Blogs/cat-care")}
              >
                <Ionicons name="newspaper-outline" size={18} color="#D86B35" />
                <Text style={styles.menuItemText}>Cat Care</Text>
              </TouchableOpacity>

              <View style={styles.divider} />

              {authUser ? (
                <>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => handleNavigation("/(tabs)/profile")}
                  >
                    <Ionicons name="person-outline" size={18} color="#D86B35" />
                    <Text style={styles.menuItemText}>Dashboard</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={18} color="#EF4444" />
                    <Text style={[styles.menuItemText, styles.logoutText]}>
                      Logout
                    </Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigation("/(auth)/login")}
                >
                  <Ionicons name="log-in-outline" size={18} color="#D86B35" />
                  <Text style={styles.menuItemText}>Login / Signup</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </Pressable>
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
  },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logo: { width: 32, height: 32 },
  brandTitle: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  menuButton: { padding: 2 },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  avatarInitialContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFAC0D",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  avatarInitialText: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingRight: 16,
  },
  dropdownCard: {
    width: 220,
    maxHeight: 420,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 10,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: "700",
    color: "#9CA3AF",
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 2,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuItemText: { fontSize: 14, color: "#1F2937", fontWeight: "500" },
  logoutText: { color: "#EF4444" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 4 },
});