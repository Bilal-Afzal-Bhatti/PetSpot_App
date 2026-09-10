import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Linking,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Feather,
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { useAdStore } from "@/../Store/AdsStore";
import { useBuyStore } from "@/../Store/buyStore";
import { api } from "@/../lib/axios";
import HeaderMenu from "@/components/HeaderMenu";
import { SafeAreaView } from "react-native-safe-area-context";
const AUTO_SLIDE_INTERVAL_MS = 4000;
const Base_URL = api.defaults.baseURL;
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const getCatImage = (pet: any) => {
  const rawPath =
    (typeof pet?.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet?.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet?.image === "string" && pet.image.trim() !== "" ? pet.image : null) ||
    (typeof pet?.petImage === "string" && pet.petImage.trim() !== "" ? pet.petImage : null);

  if (!rawPath) return "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba";
  if (rawPath.startsWith("http")) return rawPath;

  return `${Base_URL}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};

export default function CatDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const catId = typeof params.id === "string" ? params.id : params.id?.[0];

  const adStore = useAdStore() as any;
  const getApprovedCatAdById =
    typeof adStore?.getApprovedCatAdById === "function"
      ? adStore.getApprovedCatAdById
      : typeof adStore?.getApprovedAdById === "function"
        ? adStore.getApprovedAdById
        : typeof adStore?.getAdById === "function"
          ? adStore.getAdById
          : null;
          
  const { setSelectedPet } = useBuyStore();

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const sliderRef = useRef<ScrollView>(null);

  useEffect(() => {
    const fetchPet = async () => {
      if (!catId) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getApprovedCatAdById(catId);
        if (data) {
          setPet(data);
        } else {
          setError("Cat not found");
        }
      } catch (err) {
        console.error("Failed to fetch cat:", err);
        setError("Failed to load cat details");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [catId, getApprovedCatAdById]);

  // Resolve backend images array
  const rawImagesList =
    Array.isArray(pet?.images) && pet.images.length > 0
      ? pet.images
      : [pet?.img, pet?.image, pet?.petImage].filter(Boolean);

  const backendImages: string[] =
    rawImagesList.length > 0
      ? rawImagesList.map((imgStr: string) => {
          if (!imgStr || typeof imgStr !== "string") return getCatImage(pet);
          if (imgStr.startsWith("http")) return imgStr;
          return `${Base_URL}${imgStr.startsWith("/") ? "" : "/"}${imgStr}`;
        })
      : [getCatImage(pet)];

  const petImage = backendImages[currentImageIndex] || getCatImage(pet);

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? backendImages.length - 1 : prev - 1
    );
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === backendImages.length - 1 ? 0 : prev + 1
    );
  };

  // Auto-slide effect
  useEffect(() => {
    if (backendImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === backendImages.length - 1 ? 0 : prev + 1
      );
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [backendImages.length]);

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

  const handleBuyNow = () => {
    if (!pet) return;
    setSelectedPet(pet);

    const petId = (pet._id || pet.id || catId || "").toString();
    const petBreed = pet.breed || "cat";
    const petName = pet.name || "pet";
    const petSlug = pet.slug || `${slugify(petName)}-${slugify(petBreed)}`;

    if (Platform.OS === "web" && typeof window !== "undefined") {
      sessionStorage.setItem("selectedPetData", JSON.stringify(pet));
      if (petId) sessionStorage.setItem("currentPetId", petId);
    }

    router.push({
      pathname: "/checkout/[id]",
      params: { id: petId || "", slug: petSlug },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#ea580c" />
        <Text style={styles.loadingText}>Loading cat details...</Text>
      </View>
    );
  }

  if (error || !pet) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>🐱</Text>
        <Text style={styles.errorTitle}>{error || "Cat not found"}</Text>
        <Text style={styles.errorSubtitle}>
          The cat you're looking for might have been removed or is no longer available.
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}
  >
      <HeaderMenu/>
  
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
   
      


      <View style={styles.innerWrapper}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.breadcrumbLink}>Home</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>→</Text>
          <TouchableOpacity onPress={() => router.push("/(cats)/for-sale")}>
            <Text style={styles.breadcrumbLink}>Cats</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>→</Text>
          <Text style={styles.breadcrumbCurrent} numberOfLines={1}>
            {pet.name}
          </Text>
        </View>

        {/* Main Image Container */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: petImage }} style={styles.mainImage} resizeMode="cover" />

          {backendImages.length > 1 && (
            <>
              <TouchableOpacity style={[styles.sliderButton, { left: 12 }]} onPress={goToPrevImage}>
                <Feather name="chevron-left" size={20} color="#1f2937" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.sliderButton, { right: 12 }]} onPress={goToNextImage}>
                <Feather name="chevron-right" size={20} color="#1f2937" />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Cat Main Info */}
        <View style={styles.detailsHeader}>
          <Text style={styles.petName}>{pet.name}</Text>
          <View style={styles.subMetaRow}>
            <View style={styles.metaItem}>
              <FontAwesome5 name="cat" size={14} color="#ea580c" />
              <Text style={styles.metaText}>{pet.breed}</Text>
            </View>
            <View style={styles.metaItem}>
              <Feather name="map-pin" size={14} color="#ea580c" />
              <Text style={styles.metaText}>{pet.city}</Text>
            </View>
          </View>
          <Text style={styles.priceText}>
            PKR {pet.price?.toLocaleString() || "N/A"}
          </Text>
        </View>

        {/* Contact Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.actionButtonPrimary}
            onPress={() => Linking.openURL(`tel:${pet.contactNumber}`)}
          >
            <Feather name="phone" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButtonPrimary}
            onPress={() =>
              Linking.openURL(
                `https://wa.me/${pet.contactNumber}?text=${encodeURIComponent(
                  "Hi, I saw your ad, I am interested"
                )}`
              )
            }
          >
            <FontAwesome name="whatsapp" size={16} color="#fff" />
            <Text style={styles.actionButtonText}>Chat</Text>
          </TouchableOpacity>
        </View>

        {/* Attributes Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cat Details</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Feather name="user" size={18} color="#ea580c" />
              <View>
                <Text style={styles.gridLabel}>Gender</Text>
                <Text style={styles.gridValue}>{pet.gender}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Feather name="calendar" size={18} color="#ea580c" />
              <View>
                <Text style={styles.gridLabel}>Age</Text>
                <Text style={styles.gridValue}>{pet.age} months</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <FontAwesome5 name="weight" size={18} color="#ea580c" />
              <View>
                <Text style={styles.gridLabel}>Weight</Text>
                <Text style={styles.gridValue}>{pet.weight} kg</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <FontAwesome5 name="ruler-vertical" size={18} color="#ea580c" />
              <View>
                <Text style={styles.gridLabel}>Height</Text>
                <Text style={styles.gridValue}>{pet.height} cm</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Health & Features */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Health & Features</Text>
          <View style={styles.healthRow}>
            <View style={styles.healthItemLeft}>
              <FontAwesome5 name="syringe" size={16} color="#ea580c" />
              <Text style={styles.healthText}>Vaccinated</Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: pet.vaccinated ? "#dcfce7" : "#fee2e2" },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: pet.vaccinated ? "#166534" : "#991b1b" },
                ]}
              >
                {pet.vaccinated ? "Yes" : "No"}
              </Text>
            </View>
          </View>
          <View style={styles.healthRow}>
            <View style={styles.healthItemLeft}>
              <FontAwesome5 name="certificate" size={16} color="#ea580c" />
              <Text style={styles.healthText}>Registered</Text>
            </View>
            <View
              style={[
                styles.badge,
                { backgroundColor: pet.kcpRegistered ? "#dcfce7" : "#fee2e2" },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  { color: pet.kcpRegistered ? "#166534" : "#991b1b" },
                ]}
              >
                {pet.kcpRegistered ? "Yes" : "No"}
              </Text>
            </View>
          </View>
          <View style={styles.healthRow}>
            <View style={styles.healthItemLeft}>
              <FontAwesome5 name="heartbeat" size={16} color="#ea580c" />
              <Text style={styles.healthText}>Life Expectancy</Text>
            </View>
            <Text style={styles.valueText}>{pet.maxLife} years</Text>
          </View>
        </View>

        {/* Description */}
        {pet.description ? (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.descriptionText}>{pet.description}</Text>
          </View>
        ) : null}

        {/* Buy Now Button */}
        <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
          <Text style={styles.buyNowButtonText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    width: "100%",
  },
  container: { flex: 1, backgroundColor: "#f9fafb" },
  contentContainer: { paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#f9fafb" },
  loadingText: { marginTop: 12, color: "#4b5563", fontSize: 14 },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 8, textAlign: "center" },
  errorSubtitle: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  
  // Header Navigation Menu Styles
  headerNavMenu: {
    height: 60,
    backgroundColor: "#ea580c",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 10 : 0,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 10,
  },

  heroBanner: { height: 40, backgroundColor: "#ea580c" },
  innerWrapper: { padding: 16, marginTop: -20 },
  breadcrumb: { flexDirection: "row", alignItems: "center", marginBottom: 16, flexWrap: "wrap" },
  breadcrumbLink: { fontSize: 13, color: "#4b5563" },
  breadcrumbSeparator: { marginHorizontal: 6, fontSize: 13, color: "#9ca3af" },
  breadcrumbCurrent: { fontSize: 13, color: "#1f2937", fontWeight: "500", maxWidth: 150 },
  imageContainer: { height: 320, borderRadius: 16, overflow: "hidden", backgroundColor: "#e5e7eb", position: "relative", marginBottom: 20, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  mainImage: { width: "100%", height: "100%" },
  sliderButton: { position: "absolute", top: "50%", transform: [{ translateY: -20 }], width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.8)", justifyContent: "center", alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, elevation: 2 },
  detailsHeader: { marginBottom: 16 },
  petName: { fontSize: 28, fontWeight: "bold", color: "#1f2937", marginBottom: 6 },
  subMetaRow: { flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 14, color: "#4b5563" },
  priceText: { fontSize: 24, fontWeight: "bold", color: "#191C33" },
  actionButtonsRow: { flexDirection: "row", gap: 12, marginBottom: 20 },
  actionButtonPrimary: { flex: 1, backgroundColor: "#FFAC0D", paddingVertical: 12, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, elevation: 2 },
  actionButtonText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: "#f3f4f6", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, elevation: 1 },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937", marginBottom: 12 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", gap: 16 },
  gridItem: { width: "47%", flexDirection: "row", alignItems: "center", gap: 10 },
  gridLabel: { fontSize: 11, color: "#6b7280" },
  gridValue: { fontSize: 13, fontWeight: "500", color: "#1f2937" },
  healthRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "#f3f4f6" },
  healthItemLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  healthText: { fontSize: 14, color: "#374151" },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "500" },
  valueText: { fontSize: 14, fontWeight: "500", color: "#1f2937" },
  descriptionText: { fontSize: 14, color: "#4b5563", lineHeight: 20 },
  buyNowButton: { backgroundColor: "#FFAC0D", paddingVertical: 16, borderRadius: 12, alignItems: "center", marginTop: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, elevation: 3 },
  buyNowButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});