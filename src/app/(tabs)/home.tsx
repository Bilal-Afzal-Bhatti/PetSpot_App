import React, { useState, useEffect, useRef, useCallback, memo, Suspense } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

// Dynamic Imports / Lazy Component Rendering
const AvailablePets = React.lazy(() => import("@/components/LandingPage/AvailablePets"));
const MMPSection = React.lazy(() => import("@/components/LandingPage/MMP"));
const ServicesSection = React.lazy(() => import("@/components/LandingPage/Service"));
const JoinUsSection = React.lazy(() => import("@/components/LandingPage/joinUs"));


const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32;

const PET_IMAGES = [
  require("@/../assets/pets/image1.jpg"),
  require("@/../assets/pets/image2.webp"),
  require("@/../assets/pets/image3.avif"),
  require("@/../assets/pets/image4.webp"),
  require("@/../assets/pets/image5.jpg"),
];

const STATS = [
  { label: "Happy Families", value: "10K+" },
  { label: "Pets Listed", value: "5K+" },
  { label: "Breeders", value: "500+" },
];

// Memoized Helper Components to prevent unnecessary re-renders
const StatsSection = memo(({ stats }: { stats: typeof STATS }) => (
  <View style={styles.statsContainer}>
    {stats.map((stat, i) => (
      <View key={i} style={styles.statCard}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    ))}
  </View>
));

const ComponentFallback = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="small" color="#D86B35" />
  </View>
);

export default function Home() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scrollViewRef = useRef<ScrollView>(null);
  const isProcessingRef = useRef(false);

  const changeImage = useCallback((targetIndex: number) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setCurrentImageIndex(targetIndex);
    scrollViewRef.current?.scrollTo({
      x: targetIndex * CAROUSEL_WIDTH,
      animated: true,
    });

    setTimeout(() => {
      isProcessingRef.current = false;
    }, 300);
  }, []);

  const nextImage = useCallback(() => {
    const nextIdx =
      currentImageIndex === PET_IMAGES.length - 1 ? 0 : currentImageIndex + 1;
    changeImage(nextIdx);
  }, [currentImageIndex, changeImage]);

  const prevImage = useCallback(() => {
    const prevIdx =
      currentImageIndex === 0 ? PET_IMAGES.length - 1 : currentImageIndex - 1;
    changeImage(prevIdx);
  }, [currentImageIndex, changeImage]);

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 5000);

    return () => clearInterval(interval);
  }, [nextImage]);

  const handleSearch = useCallback(() => {
    if (!selectedPet) {
      Alert.alert("Select Pet", "Please select a pet type first!");
      return;
    }
    router.push("/(tabs)/home" as any);
  }, [selectedPet, router]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={true} // Unmounts offscreen views to save memory
    >
      {/* Hero Welcome Header */}
      <View style={styles.badgeRow}>
        <Ionicons name="paw" size={18} color="#D86B35" />
        <Text style={styles.badgeText}>WELCOME TO PETS CORNER</Text>
      </View>

      <Text style={styles.mainTitle}>
        Find Your <Text style={styles.highlightTitle}>Perfect Companion</Text>
      </Text>

      <Text style={styles.subtitle}>
        Connecting loving families with adorable pets. Your journey to
        unconditional love starts here.
      </Text>

      {/* Search Filter Box */}
      <View style={styles.searchCard}>
        <View style={styles.searchHeader}>
          <Ionicons name="search" size={20} color="#D86B35" />
          <Text style={styles.searchTitle}>Search for Your Pet</Text>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedPet}
            onValueChange={(itemValue) => setSelectedPet(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Select Pet Type" value="" color="#9CA3AF" />
            <Picker.Item label="Dogs" value="Dogs" color="#1F2937" />
            <Picker.Item label="Cats" value="Cats" color="#1F2937" />
            <Picker.Item label="Small Pets" value="Small Pets" color="#1F2937" />
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.8}
        >
          <Ionicons name="search" size={18} color="#FFFFFF" />
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Statistics Grid */}
      <StatsSection stats={STATS} />

      {/* Hero Carousel */}
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          style={styles.carouselScrollView}
        >
          {PET_IMAGES.map((imgSrc, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={imgSrc} style={styles.carouselImage} />
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={[styles.arrowButton, styles.leftArrow]}
          onPress={prevImage}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrowButton, styles.rightArrow]}
          onPress={nextImage}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.dotsContainer}>
          {PET_IMAGES.map((_, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => changeImage(index)}
              style={[
                styles.dot,
                index === currentImageIndex ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          ))}
        </View>

        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${((currentImageIndex + 1) / PET_IMAGES.length) * 100}%`,
              },
            ]}
          />
        </View>
      </View>

      {/* Lazy Loaded Sub-Sections */}
      <Suspense fallback={<ComponentFallback />}>
        <AvailablePets />
      </Suspense>

      <Suspense fallback={<ComponentFallback />}>
        <MMPSection />
      </Suspense>

        <Suspense fallback={<ComponentFallback />}>
        <ServicesSection />
      </Suspense>
      <Suspense fallback={<ComponentFallback />}>
        <JoinUsSection />
      </Suspense>


    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A202C",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 38,
  },
  highlightTitle: {
    color: "#FFAC0D",
  },
  subtitle: {
    fontSize: 14,
    color: "#E2E8F0",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  searchCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  searchTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  pickerWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 12,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  searchButton: {
    backgroundColor: "#FFAC0D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#CBD5E1",
    fontSize: 11,
    marginTop: 2,
  },
  carouselContainer: {
    width: CAROUSEL_WIDTH,
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  carouselScrollView: {
    width: CAROUSEL_WIDTH,
    height: 260,
  },
  imageWrapper: {
    width: CAROUSEL_WIDTH,
    height: 260,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  arrowButton: {
    position: "absolute",
    top: "42%",
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
  },
  dotsContainer: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    zIndex: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#FFFFFF",
  },
  inactiveDot: {
    width: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  progressBarBackground: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#D86B35",
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});