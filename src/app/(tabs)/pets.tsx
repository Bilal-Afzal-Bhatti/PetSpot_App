import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAdStore, Base_URL } from "@/../Store/AdsStore";

const { width } = Dimensions.get("window");
const ITEMS_PER_PAGE = 8;
const HERO_HEIGHT = 220;

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "https://via.placeholder.com/300?text=No+Image";

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("file:")
  ) {
    return imagePath;
  }

  const cleanPath = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;
  const fullPath = cleanPath.startsWith("/uploads/")
    ? cleanPath
    : `/uploads${cleanPath}`;

  return `${Base_URL}${fullPath}`;
};

export default function AllPetsPage() {
  const router = useRouter();
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const scrollViewRef = useRef<ScrollView>(null);

  // ---------- Utility helpers ----------
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

  const handleViewPet = (pet: any) => {
    const petId = pet._id || pet.id;
    // Direct navigation using Expo Router's dynamic route
    router.push(`/pet/${petId}` as any);
  };

  // Fetch data directly from Zustand store
  useEffect(() => {
    let isMounted = true;

    const fetchAndProcessPets = async () => {
      try {
        const store = useAdStore.getState();

        const [dogsData, catsData] = await Promise.all([
          store.getApprovedAds ? store.getApprovedAds("dogs", 1, 50) : Promise.resolve({ ads: [] }),
          store.getApprovedAds ? store.getApprovedAds("cats", 1, 50) : Promise.resolve({ ads: [] }),
        ]);

        if (!isMounted) return;

        const rawDogs = dogsData?.ads || [];
        const rawCats = catsData?.ads || [];

        const mappedDogs = rawDogs.map((item: any) => ({ ...item, category: "Dog" }));
        const mappedCats = rawCats.map((item: any) => ({ ...item, category: "Cat" }));

        const combined = [...mappedDogs, ...mappedCats].sort((a, b) =>
          (a._id || a.id).toString().localeCompare((b._id || b.id).toString())
        );

        setPets(combined);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching all pets:", err);
        if (isMounted) setLoading(false);
      }
    };

    fetchAndProcessPets();

    return () => {
      isMounted = false;
    };
  }, []);

  // Main Carousel Auto-play Timer
  useEffect(() => {
    if (pets.length === 0) return;

    const timer = setInterval(() => {
      setCarouselIndex((prev) => (prev === pets.length - 1 ? 0 : prev + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [pets.length]);

  const totalPages = Math.ceil(pets.length / ITEMS_PER_PAGE);

  const currentPets = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return pets.slice(start, start + ITEMS_PER_PAGE);
  }, [pets, currentPage]);

  const handleNextSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev === pets.length - 1 ? 0 : prev + 1));
  }, [pets.length]);

  const handlePrevSlide = useCallback(() => {
    setCarouselIndex((prev) => (prev === 0 ? pets.length - 1 : prev - 1));
  }, [pets.length]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const activePet = pets[carouselIndex];

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.badgeRow}>
          <MaterialCommunityIcons name="paw" size={18} color="#1E7E8F" />
          <Text style={styles.badgeText}>Our Marketplace</Text>
        </View>
        <Text style={styles.title}>Explore All Available Pets</Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#1E7E8F" />
          <Text style={styles.loadingText}>Fetching available pets...</Text>
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No pets currently available.</Text>
        </View>
      ) : (
        <>
          {/* Featured Hero Carousel */}
          {activePet && (
            <View style={styles.heroCard}>
              <Image
                source={{ uri: getImageUrl(activePet.images?.[0] || activePet.image) }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroOverlay} />

              {/* Slide Controls */}
              <TouchableOpacity
                style={[styles.arrowButton, { left: 12 }]}
                onPress={handlePrevSlide}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="chevron-left" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.arrowButton, { right: 12 }]}
                onPress={handleNextSlide}
                activeOpacity={0.7}
              >
                <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
              </TouchableOpacity>

              {/* Hero Content */}
              <View style={styles.heroContent}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {activePet.category} ({carouselIndex + 1} / {pets.length})
                  </Text>
                </View>
                <Text style={styles.heroTitle} numberOfLines={1}>
                  {activePet.petName || activePet.breed || "Adorable Companion"}
                </Text>
                <Text style={styles.heroSubtitle} numberOfLines={1}>
                  {activePet.breed ? `${activePet.breed} • ` : ""}Looking for a loving home
                </Text>

                <TouchableOpacity
                  style={styles.heroButton}
                  onPress={() => handleViewPet(activePet)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.heroButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Grid Display Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Available Listings</Text>
            <Text style={styles.pageIndicator}>
              Page {currentPage} of {totalPages}
            </Text>
          </View>

          {/* 2-Column Responsive Card Grid */}
          <View style={styles.gridContainer}>
            {currentPets.map((pet) => {
              const petId = pet._id || pet.id;
              const petName = pet.petName || pet.name || pet.breed || "Adorable Pet";
              const petImage = getImageUrl(pet.images?.[0] || pet.image);
              const price = pet.price ? `₹${pet.price}` : "Contact for Price";

              return (
                <TouchableOpacity
                  key={petId}
                  style={styles.petCard}
                  onPress={() => handleViewPet(pet)}
                  activeOpacity={0.9}
                >
                  <View style={styles.cardImageContainer}>
                    <Image source={{ uri: petImage }} style={styles.cardImage} />
                    <View style={styles.cardCategoryBadge}>
                      <Text style={styles.cardCategoryText}>{pet.category}</Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Text style={styles.cardName} numberOfLines={1}>
                      {petName}
                    </Text>
                    {pet.breed && (
                      <Text style={styles.cardBreed} numberOfLines={1}>
                        {pet.breed}
                      </Text>
                    )}

                    <View style={styles.cardFooter}>
                      <Text style={styles.cardPrice}>{price}</Text>
                      <MaterialCommunityIcons
                        name="chevron-right"
                        size={18}
                        color="#1E7E8F"
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <View style={styles.paginationRow}>
              <TouchableOpacity
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                style={[
                  styles.pageButton,
                  currentPage === 1 && styles.disabledPageButton,
                ]}
              >
                <Text style={styles.pageButtonText}>Previous</Text>
              </TouchableOpacity>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.pageNumbersContainer}
              >
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <TouchableOpacity
                    key={page}
                    onPress={() => handlePageChange(page)}
                    style={[
                      styles.pageNumber,
                      currentPage === page && styles.activePageNumber,
                    ]}
                  >
                    <Text
                      style={[
                        styles.pageNumberText,
                        currentPage === page && styles.activePageNumberText,
                      ]}
                    >
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <TouchableOpacity
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={[
                  styles.pageButton,
                  currentPage === totalPages && styles.disabledPageButton,
                ]}
              >
                <Text style={styles.pageButtonText}>Next</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const cardWidth = (width - 48) / 2; // Dynamic width for 2-column layout

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
    marginTop: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  loaderContainer: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
  },
  heroCard: {
    height: HERO_HEIGHT,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#111827",
    marginBottom: 24,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  arrowButton: {
    position: "absolute",
    top: "40%",
    zIndex: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroContent: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  categoryBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  categoryBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  heroSubtitle: {
    fontSize: 12,
    color: "#E5E7EB",
    marginTop: 2,
    marginBottom: 10,
  },
  heroButton: {
    backgroundColor: "#1E7E8F",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
  heroButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  pageIndicator: {
    fontSize: 12,
    color: "#6B7280",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  petCard: {
    width: cardWidth,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  cardImageContainer: {
    height: 120,
    width: "100%",
    backgroundColor: "#E5E7EB",
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  cardCategoryBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  cardCategoryText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#374151",
  },
  cardBody: {
    padding: 10,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  cardBreed: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 2,
  },
  cardFooter: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: "#F3F4F6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111827",
  },
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 24,
    gap: 8,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },
  disabledPageButton: {
    opacity: 0.4,
  },
  pageButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },
  pageNumbersContainer: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 4,
  },
  pageNumber: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  activePageNumber: {
    backgroundColor: "#1E7E8F",
    borderColor: "#1E7E8F",
  },
  pageNumberText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  activePageNumberText: {
    color: "#FFFFFF",
  },
});