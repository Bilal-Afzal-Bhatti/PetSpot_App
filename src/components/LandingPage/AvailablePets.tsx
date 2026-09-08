import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAdStore, Base_URL } from "@/../Store/AdsStore";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.58;

interface Pet {
  _id?: string;
  id?: string;
  name?: string;
  title?: string;
  img?: string;
  image?: string;
  images?: string[];
  category?: string;
  type?: string;
  breed?: string;
  [key: string]: any;
}

const getPetImage = (pet: Pet): string => {
  const rawPath =
    (typeof pet.img === "string" && pet.img.trim() !== "" ? pet.img : null) ||
    (Array.isArray(pet.images) && pet.images[0] ? pet.images[0] : null) ||
    (typeof pet.image === "string" && pet.image.trim() !== "" ? pet.image : null);

  if (!rawPath) return "https://via.placeholder.com/300x300.png?text=Pet+Image";
  if (rawPath.startsWith("http")) return rawPath;

  return `${Base_URL}${rawPath.startsWith("/") ? "" : "/"}${rawPath}`;
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export default function AvailablePets() {
  const router = useRouter();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchAllPets = async () => {
      try {
        const store = useAdStore.getState();

        const [dogsData, catsData] = await Promise.all([
          store.getApprovedDogAds ? store.getApprovedDogAds(1, 5) : Promise.resolve({ ads: [] }),
          store.getApprovedCatAds ? store.getApprovedCatAds(1, 5) : Promise.resolve({ ads: [] }),
        ]);

        if (isMounted) {
          const dogs: Pet[] = dogsData?.ads || [];
          const cats: Pet[] = catsData?.ads || [];
          const combined = shuffleArray([...dogs, ...cats]);
          setPets(combined.slice(0, 5));
        }
      } catch (err) {
        console.error("Failed to load available pets", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAllPets();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleViewPet = (pet: Pet) => {
    const petId = pet._id || pet.id;
    if (petId) {
      router.push(`/pets_view/${petId}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <View style={styles.badgeRow}>
          <Ionicons name="paw" size={18} color="#55C5D0" />
          <Text style={styles.badgeText}>FEATURED PETS</Text>
        </View>

        <Text style={styles.title}>
          Meet Your New{"\n"}
          <Text style={styles.highlightTitle}>Furry Friend</Text>
        </Text>
      </View>

      {/* Content Section */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#FFAC0D" />
        </View>
      ) : pets.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            No approved pets available at the moment.
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollList}
        >
          {pets.map((pet, index) => {
            const petId = pet._id || pet.id || index.toString();
            const petImage = getPetImage(pet);
            const petName = pet.name || pet.title || "Pet";
            const petCategory = pet.category || pet.type || "pets";

            return (
              <TouchableOpacity
                key={petId}
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => handleViewPet(pet)}
              >
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: petImage }}
                    style={styles.petImage}
                    resizeMode="cover"
                  />
                  <View style={styles.categoryTag}>
                    <Text style={styles.categoryText}>{petCategory}</Text>
                  </View>
                </View>

                <View style={styles.cardDetails}>
                  <Text style={styles.petName} numberOfLines={1}>
                    {petName}
                  </Text>
                  <Text style={styles.petBreed} numberOfLines={1}>
                    {pet.breed || "Available Now"}
                  </Text>

                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleViewPet(pet)}
                  >
                    <Text style={styles.actionButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Bottom CTA Button */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.exploreButton}
          activeOpacity={0.85}
          onPress={() => router.push("/(tabs)/pets")}
        >
          <Text style={styles.exploreText}>Explore All Pets</Text>
          <Ionicons name="arrow-forward" size={18} color="#000000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: "#FAFAFA",
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#55C5D0",
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#111827",
    textAlign: "center",
    lineHeight: 32,
  },
  highlightTitle: {
    color: "#FFAC0D",
  },
  loaderContainer: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },
  scrollList: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 10,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imageWrapper: {
    height: 150,
    width: "100%",
    backgroundColor: "#E5E7EB",
    position: "relative",
  },
  petImage: {
    width: "100%",
    height: "100%",
  },
  categoryTag: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "rgba(0, 0, 0, 0.65)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  categoryText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  cardDetails: {
    padding: 12,
    justifyContent: "space-between",
  },
  petName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 2,
  },
  petBreed: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 12,
  },
  actionButton: {
    backgroundColor: "#000000",
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
  },
  actionButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 12,
  },
  ctaContainer: {
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  exploreButton: {
    backgroundColor: "#FFAC0D",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 16,
    elevation: 3,
    shadowColor: "#FFAC0D",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  exploreText: {
    color: "#000000",
    fontSize: 15,
    fontWeight: "bold",
  },
});