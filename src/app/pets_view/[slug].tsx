import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Base_URL } from "@/../Store/AdsStore";
import { useBuyStore } from "@/../Store/buyStore";
import HeaderMenu from "@/components/HeaderMenu";

const { width } = Dimensions.get("window");

const getPetImage = (pet: any, rawImgPath?: string) => {
  const targetPath =
    rawImgPath ||
    (typeof pet?.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet?.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet?.image === "string" && pet.image.trim() !== "" ? pet.image : null) ||
    (typeof pet?.petImage === "string" && pet.petImage.trim() !== "" ? pet.petImage : null);

  if (!targetPath) return "https://via.placeholder.com/600x400.png?text=Pet+Image";
  if (targetPath.startsWith("http")) return targetPath;

  return `${Base_URL}${targetPath.startsWith("/") ? "" : "/"}${targetPath}`;
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
  const { setSelectedPet } = useBuyStore();

  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const params = useLocalSearchParams<{ slug: string; id?: string; category?: string }>();
  console.log("params", params);
  const apiBaseUrl = typeof Base_URL === "string" ? Base_URL : "";

  const getAdById = async (targetId?: string | string[], category = "dogs") => {
    if (!targetId) return null;

    const id = Array.isArray(targetId) ? targetId[0] : targetId;
    if (!id || !apiBaseUrl) return null;
    console.log("id", id, "category", category);

    try {
      const response = await axios.get(
        `${apiBaseUrl.replace(/\/$/, "")}/api/ads/approved/${category}/${encodeURIComponent(id)}`
      );
      return response?.data?.data ?? response?.data?.ad ?? response?.data ?? null;
    } catch (error) {
      console.error("Failed to fetch pet details:", error);
      return null;
    }
  };

  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    const fetchPet = async () => {
      setLoading(true);
      const targetId = params.id;

      if (!targetId) {
        console.warn("No pet id in route params — cannot fetch pet details.");
        setPet(null);
        setLoading(false);
        return;
      }

      const data = await getAdById(targetId, params.category || "dogs");
      setPet(data);

      if (data) {
        setSelectedPet(data);
      }

      setLoading(false);
    };

    fetchPet();
  }, [params.id, params.category]);
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>Loading pet details...</Text>
      </View>
    );
  }

  if (!pet) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.notFoundCard}>
          <Text style={styles.notFoundTitle}>Pet Not Found</Text>
          <Text style={styles.notFoundSubtitle}>
            We couldn't find the details for this pet. Please select one from the marketplace.
          </Text>
          <TouchableOpacity
            style={styles.backButtonBtn}
            onPress={() => router.push("/")}
          >
            <Text style={styles.backButtonBtnText}>Back to Marketplace</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const petName = pet.petName || pet.name || pet.title || "Pet";
  const petBreed = pet.breed || pet.category || "Available Pet";
  const images = Array.isArray(pet.images) && pet.images.length > 0
    ? pet.images
    : [pet.img || pet.image || pet.petImage].filter(Boolean);

  const currentImageUrl = getPetImage(pet, images[selectedImageIndex]);

  const handleBuyNow = () => {
    setSelectedPet(pet);

    const petId = pet._id || pet.id;
    const petSlug = `${slugify(petName)}-${slugify(petBreed)}`;

    if (Platform.OS === "web" && typeof window !== "undefined") {
      sessionStorage.setItem("selectedPetData", JSON.stringify(pet));
      if (petId) sessionStorage.setItem("currentPetId", petId);
    }

    // Expo Router navigation to Checkout
    router.push({
      pathname: "/checkout/[id]",
      params: { id: petId || "", slug: petSlug },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderMenu/>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backRow} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#4B5563" />
          <Text style={styles.backRowText}>Back to Listings</Text>
        </TouchableOpacity>

        <View style={styles.mainCard}>
          {/* Main Hero Image */}
          <TouchableOpacity
            style={styles.imageBannerWrapper}
            activeOpacity={0.9}
            onPress={() => setIsZoomed(true)}
          >
            <Image
              source={{ uri: currentImageUrl }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <View style={styles.zoomBadge}>
              <Text style={styles.zoomBadgeText}>Tap to expand</Text>
            </View>
          </TouchableOpacity>

          {/* Thumbnails */}
          {images.length > 1 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbList}>
              {images.map((img: string, idx: number) => {
                const thumbUrl = getPetImage(pet, img);
                const isSelected = selectedImageIndex === idx;
                return (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setSelectedImageIndex(idx)}
                    style={[styles.thumbItem, isSelected && styles.thumbSelected]}
                  >
                    <Image source={{ uri: thumbUrl }} style={styles.thumbImage} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          )}

          {/* Details Section */}
          <View style={styles.detailsContainer}>
            <View style={styles.titlePriceRow}>
              <Text style={styles.petTitle}>{petName}</Text>
              <Text style={styles.petPrice}>
                {pet.price ? `PKR ${pet.price}` : "Contact for Price"}
              </Text>
            </View>

            <Text style={styles.petCategory}>{petBreed}</Text>

            {/* Spec Badges Grid */}
            <View style={styles.specGrid}>
              <View style={styles.specBox}>
                <Ionicons name="calendar-outline" size={18} color="#ea580c" />
                <View>
                  <Text style={styles.specLabel}>AGE</Text>
                  <Text style={styles.specValue}>{pet.age || "Not Specified"}</Text>
                </View>
              </View>

              <View style={styles.specBox}>
                <Ionicons name="transgender-outline" size={18} color="#ea580c" />
                <View>
                  <Text style={styles.specLabel}>GENDER</Text>
                  <Text style={styles.specValue}>{pet.gender || "Not Specified"}</Text>
                </View>
              </View>

              <View style={[styles.specBox, { width: "100%" }]}>
                <Ionicons name="location-outline" size={18} color="#ea580c" />
                <View>
                  <Text style={styles.specLabel}>LOCATION</Text>
                  <Text style={styles.specValue}>{pet.location || pet.city || "Pakistan"}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.sectionHeading}>About {petName}</Text>
            <Text style={styles.descriptionText}>
              {pet.description || pet.bio || "No description provided for this pet yet."}
            </Text>

            {/* Actions */}
            <TouchableOpacity style={styles.checkoutBtn} activeOpacity={0.85} onPress={handleBuyNow}>
              <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
            </TouchableOpacity>

            <View style={styles.securityBadge}>
              <Ionicons name="shield-checkmark" size={16} color="#10B981" />
              <Text style={styles.securityText}>Verified healthy & vaccinated pet listing.</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal Image Zoom */}
      <Modal visible={isZoomed} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setIsZoomed(false)}>
          <Image source={{ uri: currentImageUrl }} style={styles.zoomedImage} resizeMode="contain" />
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#FAFAFA" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#FAFAFA" },
  loadingText: { marginTop: 12, color: "#4B5563", fontSize: 14, fontWeight: "500" },
  notFoundCard: { backgroundColor: "#FFFFFF", padding: 24, borderRadius: 20, alignItems: "center", width: "100%", maxWidth: 360, elevation: 3 },
  notFoundTitle: { fontSize: 20, fontWeight: "bold", color: "#111827", marginBottom: 8 },
  notFoundSubtitle: { fontSize: 13, color: "#6B7280", textAlign: "center", marginBottom: 20 },
  backButtonBtn: { backgroundColor: "#000000", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 12 },
  backButtonBtnText: { color: "#FFFFFF", fontWeight: "bold", fontSize: 14 },
  backRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 16 },
  backRowText: { fontSize: 14, fontWeight: "600", color: "#4B5563" },
  mainCard: { backgroundColor: "#FFFFFF", borderRadius: 20, overflow: "hidden", elevation: 2 },
  imageBannerWrapper: { height: 260, width: "100%", backgroundColor: "#F3F4F6", position: "relative" },
  bannerImage: { width: "100%", height: "100%" },
  zoomBadge: { position: "absolute", bottom: 12, right: 12, backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  zoomBadgeText: { color: "#FFFFFF", fontSize: 11 },
  thumbList: { padding: 12, gap: 10 },
  thumbItem: { width: 64, height: 64, borderRadius: 12, overflow: "hidden", borderWidth: 2, borderColor: "transparent" },
  thumbSelected: { borderColor: "#000000" },
  thumbImage: { width: "100%", height: "100%" },
  detailsContainer: { padding: 16 },
  titlePriceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 },
  petTitle: { fontSize: 22, fontWeight: "800", color: "#111827", flex: 1, marginRight: 8 },
  petPrice: { fontSize: 18, fontWeight: "900", color: "#ea580c" },
  petCategory: { fontSize: 12, fontWeight: "700", color: "#6B7280", textTransform: "uppercase", marginBottom: 16 },
  specGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, backgroundColor: "#F9FAFB", padding: 12, borderRadius: 16, borderWidth: 1, borderColor: "#F3F4F6", marginBottom: 20 },
  specBox: { width: "48%", flexDirection: "row", alignItems: "center", gap: 10 },
  specLabel: { fontSize: 10, fontWeight: "700", color: "#9CA3AF" },
  specValue: { fontSize: 13, fontWeight: "700", color: "#374151" },
  sectionHeading: { fontSize: 13, fontWeight: "800", color: "#111827", textTransform: "uppercase", marginBottom: 6 },
  descriptionText: { fontSize: 14, color: "#4B5563", lineHeight: 20, marginBottom: 24 },
  checkoutBtn: { backgroundColor: "#000000", paddingVertical: 14, borderRadius: 14, alignItems: "center", marginBottom: 12 },
  checkoutBtnText: { color: "#FFFFFF", fontSize: 15, fontWeight: "bold" },
  securityBadge: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  securityText: { fontSize: 12, color: "#9CA3AF" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.9)", justifyContent: "center", alignItems: "center" },
  zoomedImage: { width: width * 0.95, height: "80%" },
});