import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useBreedStore } from "@/../Store/BreedStore";
import BreedInfoSidebar from "./BreedInfoSidebar";
import BreedInfoNotFound from "./BreedInfoNotFound";
import BreedDetails from "./BreedDetail";

export default function BreedInfoMainSection() {
  const params = useLocalSearchParams();

  const slug =
    (params?.slug as string) ||
    (params?.id as string) ||
    (params?.breed as string) ||
    "";

  const { selectedBreed, detailLoading, detailError, fetchBreedBySlug } =
    useBreedStore();
  const [index, setIndex] = useState(0);

  const defaultImages = [
    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
    "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
  ];

  // Fetch individual breed directly via its slug/id on mount or param change
  useEffect(() => {
    if (slug && slug !== "dog-breed" && slug !== "cat-breed") {
      fetchBreedBySlug(slug);
    }
  }, [slug, fetchBreedBySlug]);

  if (detailLoading) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.loadingText}>Loading breed details...</Text>
      </View>
    );
  }

  if (detailError || !selectedBreed) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>
          {detailError || "Breed not found."}
        </Text>
      </View>
    );
  }

  const IMAGES = selectedBreed?.image
    ? [selectedBreed.image, ...defaultImages]
    : defaultImages;

  const nextSlide = () => setIndex((prev) => (prev + 1) % IMAGES.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + IMAGES.length) % IMAGES.length);

  // Safely parse temperament array or string
  const rawTemperament: unknown = selectedBreed?.temperament;
  const temperamentList: string[] = Array.isArray(rawTemperament)
    ? rawTemperament.filter((t): t is string => typeof t === "string")
    : typeof rawTemperament === "string"
    ? rawTemperament.split(",").map((t: string) => t.trim()).filter(Boolean)
    : [];

  // Safely parse overviewPoints array if available
  const overviewPoints = Array.isArray(selectedBreed?.overviewPoints)
    ? selectedBreed.overviewPoints
    : [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* MAIN: Details */}
      <View style={styles.mainCol}>
        {/* Featured slider */}
        <View style={styles.sliderWrap}>
          <View style={styles.sliderImageBox}>
            <TouchableOpacity
              onPress={prevSlide}
              style={[styles.navBtn, styles.navBtnLeft]}
            >
              <FontAwesome name="arrow-left" size={16} color="#374151" />
            </TouchableOpacity>

            <Image
              source={{ uri: IMAGES[index] }}
              style={styles.sliderImage}
              resizeMode="cover"
            />

            <TouchableOpacity
              onPress={nextSlide}
              style={[styles.navBtn, styles.navBtnRight]}
            >
              <FontAwesome name="arrow-right" size={16} color="#374151" />
            </TouchableOpacity>

            {/* Overlay text */}
            <View style={styles.overlayText}>
              <Text style={styles.categoryTag}>
                {(selectedBreed.category || "Pet Care").toUpperCase()}
              </Text>
              <Text style={styles.overlayTitle}>
                {selectedBreed.name} Breed
              </Text>
              <Text style={styles.overlaySubtitle}>
                Breed Information & Guide
              </Text>
            </View>
          </View>
        </View>

        {/* === MATCHING TARGET DESIGN (Clean Typography) === */}
        <View style={styles.infoBlock}>
          <Text style={styles.sectionHeading}>Overview</Text>

          <View style={styles.overviewList}>
            {selectedBreed.origin ? (
              <Text style={styles.paragraph}>
                <Text style={styles.bold}>Origin: </Text>
                {selectedBreed.origin}
              </Text>
            ) : null}

            {overviewPoints.length > 0 ? (
              overviewPoints.map((point: any, idx: number) => (
                <Text key={idx} style={styles.paragraph}>
                  <Text style={styles.boldDark}>{point.title}: </Text>
                  {point.description}
                </Text>
              ))
            ) : (
              <Text style={styles.mutedText}>
                Detailed overview content coming soon for this breed.
              </Text>
            )}
          </View>

          <Text style={[styles.sectionHeading, { marginTop: 8 }]}>
            Breed Info
          </Text>

          <View>
            <Text style={styles.boldDark}>Common Nicknames</Text>
            <Text style={styles.mutedTextMt}>
              {selectedBreed.commonNicknames || "N/A"}
            </Text>
          </View>

          <View style={{ marginTop: 12 }}>
            <Text style={[styles.boldDark, { marginBottom: 8 }]}>
              Temperament
            </Text>
            <View style={styles.chipRow}>
              {temperamentList.length > 0 ? (
                temperamentList.map((trait) => (
                  <View key={trait} style={styles.chip}>
                    <Text style={styles.chipText}>{trait}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.mutedText}>Friendly, Playful</Text>
              )}
            </View>
          </View>

          {/* Flat Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <Text style={styles.boldDark}>Trainability</Text>
                <Text style={styles.mutedTextMt}>
                  {selectedBreed.trainability || "N/A"}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.boldDark}>Shedding</Text>
                <Text style={styles.mutedTextMt}>
                  {selectedBreed.shedding || "N/A"}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.boldDark}>Grooming</Text>
                <Text style={styles.mutedTextMt}>
                  {selectedBreed.grooming || "N/A"}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.boldDark}>Breed Type</Text>
                <Text style={styles.mutedTextMt}>
                  {selectedBreed.breedType || selectedBreed.category || "N/A"}
                </Text>
              </View>
              <View style={styles.statBlock}>
                <Text style={styles.boldDark}>Size</Text>
                <Text style={styles.mutedTextMt}>
                  {selectedBreed.size || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Extra Sections & Expert Banner */}
        <View style={styles.extraSection}>
          <TouchableOpacity style={styles.expertBanner}>
            <Text style={styles.expertBannerText}>
              Get in touch with our Pet Experts
            </Text>
          </TouchableOpacity>
          <BreedInfoNotFound />
          <BreedDetails />
        </View>
      </View>

      {/* SIDEBAR */}
      <View style={styles.sidebarCol}>
        <BreedInfoSidebar />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerBox: {
    minHeight: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#6B7280",
    fontWeight: "500",
  },
  errorText: {
    color: "#EF4444",
    fontWeight: "500",
  },

  mainCol: {
    width: "100%",
  },
  sidebarCol: {
    width: "100%",
    marginTop: 24,
  },

  // Slider
  sliderWrap: {
    marginBottom: 24,
  },
  sliderImageBox: {
    width: "100%",
    height: 260,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
  },
  navBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -18,
    zIndex: 10,
    backgroundColor: "#E5E7EB",
    padding: 12,
    borderRadius: 8,
  },
  navBtnLeft: {
    left: 8,
  },
  navBtnRight: {
    right: 8,
  },
  overlayText: {
    position: "absolute",
    bottom: 16,
    left: 16,
  },
  categoryTag: {
    backgroundColor: "#EAB308",
    color: "#000",
    fontSize: 11,
    fontWeight: "600",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    overflow: "hidden",
  },
  overlayTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    marginTop: 8,
  },
  overlaySubtitle: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
    marginTop: 2,
  },

  // Info block
  infoBlock: {
    gap: 16,
  },
  sectionHeading: {
    color: "#00897B",
    fontWeight: "600",
    fontSize: 19,
  },
  overviewList: {
    gap: 12,
  },
  paragraph: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
  },
  bold: {
    fontWeight: "700",
  },
  boldDark: {
    fontWeight: "700",
    color: "#111827",
  },
  mutedText: {
    color: "#9CA3AF",
    fontSize: 13,
  },
  mutedTextMt: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 4,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#00897B",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  chipText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "500",
  },
  statsBar: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 16,
    marginVertical: 8,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statBlock: {
    width: "45%",
  },

  // Extra sections
  extraSection: {
    marginTop: 32,
    gap: 16,
  },
  expertBanner: {
    width: "100%",
    backgroundColor: "#0B2545",
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 20,
    alignItems: "center",
  },
  expertBannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
});