import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAdStore } from "@/../Store/AdsStore";
import { useBuyStore } from "@/../Store/buyStore";
import { api } from "@/../lib/axios";

const { width } = Dimensions.get("window");
const AUTO_SLIDE_INTERVAL_MS = 4000;
const Base_URL = api.defaults.baseURL;

// Custom image helper function for cats
const getCatImage = (pet: any) => {
  const rawPath =
    (typeof pet?.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet?.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet?.image === "string" && pet.image.trim() !== "" ? pet.image : null) ||
    (typeof pet?.petImage === "string" && pet.petImage.trim() !== "" ? pet.petImage : null);

  if (!rawPath) return Image.resolveAssetSource(require("@/../assets/app_images/login_image.png")).uri; // Fallback or placeholder URI
  if (rawPath.startsWith("http")) return rawPath;

  return `${Base_URL}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};

export default function CatDetailPage() {
  const router = useRouter();
  // Extract petData and id from local search params
  const { id, petData } = useLocalSearchParams<{ id: string; petData?: string }>(); 
  
  const adStore = useAdStore() as any;
  
  // Safe function lookup with more fallbacks
  const getApprovedCatAdById = 
    adStore?.getApprovedCatAdById ?? 
    adStore?.getApprovedAdById ?? 
    null;

  const [pet, setPet] = useState<any>(() => {
    // 1. Try initializing immediately from route params if available
    if (petData) {
      try {
        return JSON.parse(petData);
      } catch (e) {
        return null;
      }
    }
    // 2. Or try finding it instantly from the store's existing ads array (if it exists)
    const adsList = adStore?.ads || adStore?.approvedAds || [];
    if (adsList.length > 0 && id) {
      return adsList.find((item: any) => (item._id || item.id) === id) || null;
    }
    return null;
  });

  const [loading, setLoading] = useState<boolean>(!pet); // Only load if we don't have pet data yet
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    // If we already found the pet via params or store cache, skip fetching
    if (pet) {
      setLoading(false);
      return;
    }

    const fetchPet = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        // Check if the function actually exists before calling it
        if (typeof getApprovedCatAdById === "function") {
          const data = await getApprovedCatAdById(id);
          if (data) {
            setPet(data);
          } else {
            setError("Cat not found");
          }
        } else {
          // Fallback if the store function doesn't exist at all
          setError("Cat details function is unavailable");
          console.warn("AdStore is missing getApprovedCatAdById/getApprovedAdById");
        }
      } catch (err) {
        console.error("Failed to fetch cat:", err);
        setError("Failed to load cat details");
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id, getApprovedCatAdById, pet]);
  // Resolve backend images array safely using helper logic
  const rawImagesList = Array.isArray(pet?.images) && pet.images.length > 0 
    ? pet.images 
    : [pet?.img, pet?.image, pet?.petImage].filter(Boolean);

  const backendImages: string[] = rawImagesList.length > 0
    ? rawImagesList.map((imgStr: string) => {
        if (!imgStr || typeof imgStr !== "string") return getCatImage(pet);
        if (imgStr.startsWith("http")) return imgStr;
        return `${Base_URL}${imgStr.startsWith("/") ? "" : "/"}${imgStr}`;
      })
    : [getCatImage(pet)];

  const petImage = backendImages[currentImageIndex] || getCatImage(pet);

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? backendImages.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === backendImages.length - 1 ? 0 : prev + 1));
  };

  // Auto-slide effect
  useEffect(() => {
    if (backendImages.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev === backendImages.length - 1 ? 0 : prev + 1));
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
    const petId = (pet._id || pet.id || id || "").toString();
    const petBreed = pet.breed || "cat";
    const petSlug = pet.slug || `${slugify(pet.name)}-${slugify(petBreed)}-${petId.slice(-6)}`;

    // In React Native, use global state or AsyncStorage instead of sessionStorage if needed, 
    // or pass through router params/store.
    router.push(`/checkout/${petSlug}`);
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
        <Text style={styles.errorSubtitle}>The cat you're looking for might have been removed.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Banner Background */}
      <View style={styles.banner} />

      <View style={styles.contentWrapper}>
        {/* Breadcrumb */}
        <View style={styles.breadcrumbContainer}>
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={styles.breadcrumbLink}>Home</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>→</Text>
          <TouchableOpacity onPress={() => router.push("/(cats)/for-sale/index")}>
            <Text style={styles.breadcrumbLink}>Cats</Text>
          </TouchableOpacity>
          <Text style={styles.breadcrumbSeparator}>→</Text>
          <Text style={styles.breadcrumbCurrent} numberOfLines={1}>{pet.name}</Text>
        </View>

        {/* Main Section */}
        <View style={styles.mainGrid}>
          
          {/* Left Column: Image Gallery & Description & Seller */}
          <View style={styles.column}>
            
            {/* Image Slider Container */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: petImage }} style={styles.mainImage} resizeMode="cover" />

              {backendImages.length > 1 && (
                <>
                  <TouchableOpacity onPress={goToPrevImage} style={[styles.sliderButton, { left: 12 }]} activeOpacity={0.8}>
                    <Ionicons name="chevron-back" size={20} color="#1f2937" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={goToNextImage} style={[styles.sliderButton, { right: 12 }]} activeOpacity={0.8}>
                    <Ionicons name="chevron-forward" size={20} color="#1f2937" />
                  </TouchableOpacity>
                </>
              )}
            </View>

            {/* Description Card */}
            {pet.description ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Description</Text>
                <Text style={styles.descriptionText}>{pet.description}</Text>
              </View>
            ) : null}

            {/* Seller Info Card */}
            {pet.user ? (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Seller Information</Text>
                <View style={styles.sellerRow}>
                  {pet.user.avatar ? (
                    <Image source={{ uri: pet.user.avatar }} style={styles.sellerAvatar} />
                  ) : (
                    <View style={styles.sellerAvatarPlaceholder}>
                      <Ionicons name="person" size={20} color="#ea580c" />
                    </View>
                  )}
                  <View>
                    <Text style={styles.sellerName}>{pet.user.name}</Text>
                    <Text style={styles.sellerEmail}>{pet.user.email}</Text>
                  </View>
                </View>
              </View>
            ) : null}
          </View>

          {/* Right Column: Details & Actions */}
          <View style={styles.column}>
            <View>
              <Text style={styles.petName}>{pet.name}</Text>
              <View style={styles.badgeRow}>
                <View style={styles.infoBadgeItem}>
                  <FontAwesome5 name="cat" size={14} color="#ea580c" />
                  <Text style={styles.infoBadgeText}>{pet.breed}</Text>
                </View>
                <View style={styles.infoBadgeItem}>
                  <Ionicons name="location-outline" size={16} color="#ea580c" />
                  <Text style={styles.infoBadgeText}>{pet.city}</Text>
                </View>
              </View>
              <Text style={styles.priceText}>
                PKR {pet.price?.toLocaleString() || "N/A"}
              </Text>
            </View>

            {/* Contact / Action Buttons */}
            <View style={styles.actionButtonsRow}>
              <TouchableOpacity
                onPress={() => Linking.openURL(`tel:${pet.contactNumber}`)}
                style={[styles.actionButton, styles.gradientButton]}
              >
                <Ionicons name="call-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => Linking.openURL(`https://wa.me/${pet.contactNumber}?text=${encodeURIComponent('Hi, I saw your ad, I am interested')}`)}
                style={[styles.actionButton, styles.gradientButton]}
              >
                <MaterialCommunityIcons name="whatsapp" size={18} color="#fff" style={{ marginRight: 6 }} />
                <Text style={styles.actionButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>

            {/* Cat Attributes Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Cat Details</Text>
              <View style={styles.gridAttributes}>
                <View style={styles.attributeItem}>
                  <Ionicons name="person-outline" size={18} color="#ea580c" />
                  <View>
                    <Text style={styles.attributeLabel}>Gender</Text>
                    <Text style={styles.attributeValue}>{pet.gender}</Text>
                  </View>
                </View>
                <View style={styles.attributeItem}>
                  <Ionicons name="calendar-outline" size={18} color="#ea580c" />
                  <View>
                    <Text style={styles.attributeLabel}>Age</Text>
                    <Text style={styles.attributeValue}>{pet.age} months</Text>
                  </View>
                </View>
                <View style={styles.attributeItem}>
                  <FontAwesome5 name="weight" size={16} color="#ea580c" />
                  <View>
                    <Text style={styles.attributeLabel}>Weight</Text>
                    <Text style={styles.attributeValue}>{pet.weight} kg</Text>
                  </View>
                </View>
                <View style={styles.attributeItem}>
                  <FontAwesome5 name="ruler-vertical" size={16} color="#ea580c" />
                  <View>
                    <Text style={styles.attributeLabel}>Height</Text>
                    <Text style={styles.attributeValue}>{pet.height} cm</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Health & Features Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Health & Features</Text>
              <View style={styles.healthList}>
                <View style={styles.healthRow}>
                  <View style={styles.healthLabelContainer}>
                    <FontAwesome5 name="syringe" size={14} color="#ea580c" />
                    <Text style={styles.healthText}>Vaccinated</Text>
                  </View>
                  <View style={[styles.statusBadge, pet.vaccinated ? styles.bgGreen : styles.bgRed]}>
                    <Text style={[styles.statusText, pet.vaccinated ? styles.textGreen : styles.textRed]}>
                      {pet.vaccinated ? "Yes" : "No"}
                    </Text>
                  </View>
                </View>
                <View style={styles.healthRow}>
                  <View style={styles.healthLabelContainer}>
                    <FontAwesome5 name="certificate" size={14} color="#ea580c" />
                    <Text style={styles.healthText}>Registered</Text>
                  </View>
                  <View style={[styles.statusBadge, pet.kcpRegistered ? styles.bgGreen : styles.bgRed]}>
                    <Text style={[styles.statusText, pet.kcpRegistered ? styles.textGreen : styles.textRed]}>
                      {pet.kcpRegistered ? "Yes" : "No"}
                    </Text>
                  </View>
                </View>
                <View style={styles.healthRow}>
                  <View style={styles.healthLabelContainer}>
                    <MaterialCommunityIcons name="heart-pulse" size={16} color="#ea580c" />
                    <Text style={styles.healthText}>Life Expectancy</Text>
                  </View>
                  <Text style={styles.attributeValue}>{pet.maxLife} years</Text>
                </View>
              </View>
            </View>

            {/* Suitable For Card */}
            {pet.suitableFor ? (
              Array.isArray(pet.suitableFor) && pet.suitableFor.length > 0 ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Suitable For</Text>
                  <View style={styles.tagsContainer}>
                    {pet.suitableFor.map((item: string, index: number) => (
                      <View key={index} style={styles.tagBadge}>
                        <Text style={styles.tagText}>{item.trim()}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : typeof pet.suitableFor === "string" && pet.suitableFor.trim() !== "" ? (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Suitable For</Text>
                  <View style={styles.tagsContainer}>
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{pet.suitableFor}</Text>
                    </View>
                  </View>
                </View>
              ) : null
            ) : null}

            {/* Buy Now Checkout Button */}
            <TouchableOpacity onPress={handleBuyNow} style={[styles.buyButton, styles.gradientButton]} activeOpacity={0.9}>
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
    padding: 20,
    minHeight: 400,
  },
  loadingText: {
    marginTop: 12,
    color: "#4b5563",
    fontSize: 14,
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  errorSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
  },
  banner: {
    height: 100,
    backgroundColor: "#ea580c", // Fallback for gradient
  },
  contentWrapper: {
    padding: 16,
    marginTop: -20,
  },
  breadcrumbContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  breadcrumbLink: {
    fontSize: 13,
    color: "#4b5563",
  },
  breadcrumbSeparator: {
    fontSize: 13,
    color: "#9ca3af",
    marginHorizontal: 6,
  },
  breadcrumbCurrent: {
    fontSize: 13,
    color: "#1f2937",
    fontWeight: "500",
    maxWidth: 180,
  },
  mainGrid: {
    flexDirection: width > 768 ? "row" : "column",
    gap: 20,
  },
  column: {
    flex: 1,
    gap: 16,
  },
  imageContainer: {
    position: "relative",
    height: 350,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  sliderButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  sellerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  sellerAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ffedd5",
    justifyContent: "center",
    alignItems: "center",
  },
  sellerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
  },
  sellerEmail: {
    fontSize: 12,
    color: "#6b7280",
  },
  petName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 12,
  },
  infoBadgeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoBadgeText: {
    fontSize: 14,
    color: "#4b5563",
  },
  priceText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ea580c",
    marginBottom: 16,
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  gradientButton: {
    backgroundColor: "#ea580c",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  gridAttributes: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  attributeItem: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  attributeLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  attributeValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1f2937",
  },
  healthList: {
    gap: 12,
  },
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  healthLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  healthText: {
    fontSize: 14,
    color: "#374151",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bgGreen: {
    backgroundColor: "#dcfce7",
  },
  bgRed: {
    backgroundColor: "#fee2e2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  textGreen: {
    color: "#166534",
  },
  textRed: {
    color: "#991b1b",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: "#fff7ed",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffedd5",
  },
  tagText: {
    fontSize: 12,
    color: "#c2410c",
    fontWeight: "500",
  },
  buyButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buyButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
});