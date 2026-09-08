import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32;

const PET_IMAGES = [
  require("../../assets/pets/image1.jpg"),
  require("../../assets/pets/image2.webp"),
  require("../../assets/pets/image3.avif"),
  require("../../assets/pets/image4.webp"),
  require("../../assets/pets/image5.jpg"),
];

const STATS = [
  { label: "Happy Families", value: "10K+" },
  { label: "Pets Listed", value: "5K+" },
  { label: "Breeders", value: "500+" },
];

export default function HeroSection() {
  const router = useRouter();
  const [selectedPet, setSelectedPet] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isProcessingRef = useRef(false);

  const changeImage = useCallback((targetIndex: number) => {
    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setCurrentImageIndex(targetIndex);

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

  const handleSearch = () => {
    if (
      !selectedPet ||
      selectedPet === "Select Pet Type" ||
      selectedPet === ""
    ) {
      Alert.alert("Notice", "Please select a pet type first!");
      return;
    }

    const route =
      selectedPet === "Dogs"
        ? "/(tabs)/pets"
        : selectedPet === "Cats"
        ? "/(tabs)/pets"
        : selectedPet === "Small Pets"
        ? "/(tabs)/pets"
        : "/(tabs)/home";

    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      {/* Welcome Tag */}
      <View style={styles.welcomeRow}>
        <FontAwesome5 name="paw" size={18} color="#FFFFFF" />
        <View style={styles.welcomeBadge}>
          <Text style={styles.welcomeText}>WELCOME TO PETS CORNER</Text>
        </View>
      </View>

      {/* Hero Header */}
      <Text style={styles.headingTitle}>
        Find Your{"\n"}
        <Text style={styles.headingHighlight}>Perfect Companion</Text>
      </Text>
      <Text style={styles.subTitle}>
        Connecting loving families with adorable pets. Your journey to unconditional
        love starts here.
      </Text>

      {/* Search Widget */}
      <View style={styles.searchCard}>
        <View style={styles.searchHeader}>
          <Ionicons name="search" size={18} color="#FFAC0D" />
          <Text style={styles.searchTitle}>Search for Your Pet</Text>
        </View>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedPet}
            onValueChange={(itemValue) => setSelectedPet(itemValue)}
            dropdownIconColor="#000"
            style={styles.picker}
          >
            <Picker.Item label="Select Pet Type" value="" />
            <Picker.Item label="Dogs" value="Dogs" />
            <Picker.Item label="Cats" value="Cats" />
            <Picker.Item label="Small Pets" value="Small Pets" />
          </Picker>
        </View>

        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          activeOpacity={0.85}
        >
          <Ionicons name="search" size={16} color="#000" />
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Counter Row */}
      <View style={styles.statsRow}>
        {STATS.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Custom Carousel */}
      <View style={styles.carouselContainer}>
        <Image
          source={PET_IMAGES[currentImageIndex]}
          style={styles.carouselImage}
          resizeMode="cover"
        />

        {/* Navigation Buttons */}
        <TouchableOpacity
          style={[styles.arrowButton, { left: 10 }]}
          onPress={prevImage}
        >
          <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.arrowButton, { right: 10 }]}
          onPress={nextImage}
        >
          <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Dot Indicators */}
        <View style={styles.indicatorsContainer}>
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

        {/* Bottom Track Progress Line */}
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  ((currentImageIndex + 1) / PET_IMAGES.length) * 100
                }%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  welcomeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  welcomeBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  headingTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    lineHeight: 38,
  },
  headingHighlight: {
    color: "#FFAC0D",
  },
  subTitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    marginBottom: 20,
  },
  searchCard: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
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
    marginBottom: 10,
  },
  searchTitle: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  pickerWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    marginBottom: 10,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#111827",
  },
  searchButton: {
    backgroundColor: "#FFAC0D",
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  searchButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 15,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  carouselContainer: {
    width: CAROUSEL_WIDTH,
    height: 260,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
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
  },
  indicatorsContainer: {
    position: "absolute",
    bottom: 14,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
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
  progressTrack: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFAC0D",
  },
});