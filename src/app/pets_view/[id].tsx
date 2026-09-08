import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

// Relative Store Imports
import { Base_URL } from "@/../Store/AdsStore";
import { useBuyStore } from "@/../Store/buyStore";

const { width, height } = Dimensions.get("window");

const getPetImage = (pet: any) => {
  const rawPath =
    (typeof pet?.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet?.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet?.image === "string" && pet.image.trim() !== "" ? pet.image : null) ||
    (typeof pet?.petImage === "string" && pet.petImage.trim() !== "" ? pet.petImage : null);

  if (!rawPath) return "https://via.placeholder.com/400x300.png?text=No+Image";
  if (rawPath.startsWith("http")) return rawPath;

  const baseUrl = Base_URL || "";
  return `${baseUrl}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};

const slugify = (s?: string) => {
  if (!s) return "";
  return encodeURIComponent(
    s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[\s\_]+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
  );
};

export default function PetDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;

  const setSelectedPet = useBuyStore((state: any) => state.setSelectedPet);
  const selectedPet = useBuyStore((state: any) => state.selectedPet);

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadPet = async () => {
      setLoading(true);
      try {
        // 1. Check Zustand Store Memory
        if (selectedPet) {
          if (isMounted) {
            setPet(selectedPet);
            setLoading(false);
          }
          return;
        }

        // 2. Check AsyncStorage Session Persistence
        const storedPet = await AsyncStorage.getItem("selectedPetData");
        if (storedPet && isMounted) {
          const parsedPet = JSON.parse(storedPet);
          setPet(parsedPet);
          setSelectedPet(parsedPet);
        }
      } catch (err) {
        console.error("Failed to load pet from AsyncStorage", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadPet();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#EA580C" />
        <Text style={styles.loadingText}>Loading pet details...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>Pet Not Found</Text>
          <Text style={styles.notFoundSub}>
            We couldn't find the details for this pet. Please select one from the marketplace.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Back to Marketplace</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const petName = pet.petName || pet.name || pet.title || "Pet";
  const images =
    Array.isArray(pet.images) && pet.images.length > 0
      ? pet.images
      : [pet.img || pet.image || pet.petImage].filter(Boolean);

  const currentImageUrl = images[selectedImageIndex]
    ? getPetImage({ images: [images[selectedImageIndex]] })
    : "https://via.placeholder.com/400x300.png?text=No+Image";

  const handleBuyNow = async () => {
    setSelectedPet(pet);

    const petId = pet._id || pet.id;
    const pName = pet.petName || pet.name || pet.title || "Pet";
    const petBreed = pet.breed || "cat";
    const petSlug = `${slugify(pName)}-${slugify(petBreed)}`;

    try {
      await AsyncStorage.setItem("selectedPetData", JSON.stringify(pet));
      if (petId) {
        await AsyncStorage.setItem("currentPetId", String(petId));
      }
    } catch (err) {
      console.error("Error persisting pet state before checkout", err);
    }

    router.push(`/checkout/${petSlug}` as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#4B5563" />
          <Text style={styles.backButtonText}>Back to Listings</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          {/* Main Image Container */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.mainImageContainer}
            onPress={() => setIsZoomed(true)}
          >
            <Image source={{ uri: currentImageUrl }} style={styles.mainImage} resizeMode="cover" />
            <View style={styles.expandBadge}>
              <Text style={styles.expandBadgeText}>Click to expand</Text>
            </View>
          </TouchableOpacity>

          {/* Thumbnails */}
          {images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbScrollView}>
              {images.map((img: string, idx: number) => {
                const thumbUrl = getPetImage({ images: [img] });
                const isSelected = selectedImageIndex === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedImageIndex(idx)}
                    style={[styles.thumbButton, isSelected && styles.thumbButtonSelected]}
                  >
                    <Image source={{ uri: thumbUrl }} style={styles.thumbImage} resizeMode="cover" />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Details Section */}
          <View style={styles.headerRow}>
            <Text style={styles.petTitle}>{petName}</Text>
            <Text style={styles.priceText}>PKR {pet.price || "Contact for Price"}</Text>
          </View>
          <Text style={styles.breedText}>{pet.breed || pet.category || "Available Pet"}</Text>

          {/* Specifications Grid */}
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Ionicons name="calendar-outline" size={18} color="#EA580C" />
              <View style={styles.gridTextContainer}>
                <Text style={styles.gridLabel}>AGE</Text>
                <Text style={styles.gridValue} numberOfLines={1}>{pet.age || "Not Specified"}</Text>
              </View>
            </View>

            <View style={styles.gridItem}>
              <Ionicons name="transgender-outline" size={18} color="#EA580C" />
              <View style={styles.gridTextContainer}>
                <Text style={styles.gridLabel}>GENDER</Text>
                <Text style={styles.gridValue} numberOfLines={1}>{pet.gender || "Not Specified"}</Text>
              </View>
            </View>

            <View style={[styles.gridItem, styles.fullWidthGridItem]}>
              <Ionicons name="location-outline" size={18} color="#EA580C" />
              <View style={styles.gridTextContainer}>
                <Text style={styles.gridLabel}>LOCATION</Text>
                <Text style={styles.gridValue} numberOfLines={1}>{pet.location || pet.city || "Pakistan"}</Text>
              </View>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.aboutSection}>
            <Text style={styles.aboutTitle}>ABOUT {petName.toUpperCase()}</Text>
            <Text style={styles.aboutBody}>
              {pet.description || pet.bio || "No description provided for this pet yet."}
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleBuyNow}>
              <Text style={styles.primaryButtonText}>Proceed to Checkout</Text>
            </TouchableOpacity>

            <View style={styles.verifiedRow}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={styles.verifiedText}>Verified healthy & vaccinated pet listing.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Image Zoom */}
      <Modal visible={isZoomed} transparent animationType="fade" onRequestClose={() => setIsZoomed(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsZoomed(false)}>
          <Image source={{ uri: currentImageUrl }} style={styles.zoomedImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#4B5563",
    fontWeight: "600",
  },
  notFoundCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  notFoundSub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    paddingVertical: 4,
  },
  backButtonText: {
    color: "#4B5563",
    fontWeight: "600",
    fontSize: 14,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  mainImageContainer: {
    height: 280,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#F3F4F6",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  expandBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  expandBadgeText: {
    color: "#ffffff",
    fontSize: 10,
  },
  thumbScrollView: {
    marginVertical: 12,
  },
  thumbButton: {
    width: 68,
    height: 68,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbButtonSelected: {
    borderColor: "#111827",
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  petTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    flex: 1,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "900",
    color: "#EA580C",
  },
  breedText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 16,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#F9FAFB",
    padding: 12,
    borderRadius: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    marginBottom: 16,
  },
  gridItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "46%",
  },
  fullWidthGridItem: {
    width: "100%",
  },
  gridTextContainer: {
    flex: 1,
  },
  gridLabel: {
    fontSize: 10,
    color: "#9CA3AF",
    fontWeight: "bold",
  },
  gridValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#374151",
  },
  aboutSection: {
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 6,
  },
  aboutBody: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  actionContainer: {
    borderTopWidth: 1,
    borderColor: "#E5E7EB",
    paddingTop: 16,
  },
  primaryButton: {
    backgroundColor: "#000000",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 15,
  },
  verifiedRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  zoomedImage: {
    width: width,
    height: height * 0.7,
  },
});