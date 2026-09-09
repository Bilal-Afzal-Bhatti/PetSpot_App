import React, { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useBreedStore, Breed } from "@/../Store/BreedStore";

export default function CatBreedListing() {
  const router = useRouter();

  const {
    breeds,
    loading,
    category,
    search,
    setCategory,
    setSearch,
    fetchBreeds,
  } = useBreedStore();

  useEffect(() => {
    setCategory("cat");
    fetchBreeds();
  }, []);

  // Routes to the correct breed-detail page based on the breed's own category,
  // not hardcoded — so this component stays correct even if reused elsewhere.
  const handleBreedClick = (breed: Breed) => {
    // Fallback to lowercased name replacement if slug isn't populated yet
    const slug = breed.slug || breed.name.toLowerCase().replace(/ /g, "-");

    const categoryRouteMap: Record<string, string> = {
      dog: "dog-breed",
      cat: "cat-breed",
      bird: "small-pet-breed",
      other: "small-pet-breed",
    };

    const routeBase =
      categoryRouteMap[breed.category?.toLowerCase()] || "cat-breed";
    router.push(`/${routeBase}/${slug}` as any);
  };

  const getSuitableIcon = (type: string) => {
    switch (type?.trim()) {
      case "Couple":
      case "COUPLE":
        return <FontAwesome name="users" size={16} color="#9CA3AF" />;
      case "New Owner":
      case "NEW OWNER":
        return <FontAwesome name="child" size={16} color="#9CA3AF" />;
      case "Kids":
      case "KIDS":
        return <FontAwesome name="child" size={16} color="#FB923C" />;
      case "Family":
      case "FAMILY":
        return <FontAwesome name="home" size={16} color="#9CA3AF" />;
      case "Citizen":
      case "CITIZEN":
        return <FontAwesome name="user" size={16} color="#374151" />;
      case "Security":
      case "SECURITY":
        return <FontAwesome name="shield" size={16} color="#22C55E" />;
      case "Single":
      case "SINGLE":
        return <FontAwesome name="users" size={16} color="#60A5FA" />;
      default:
        return <FontAwesome name="home" size={16} color="#9CA3AF" />;
    }
  };

  const handlePetTypeClick = (pet: string) => {
    const formattedPet = pet.toLowerCase();
    setCategory(formattedPet);
    fetchBreeds();

    switch (pet) {
      case "Dog":
        router.push("/dog-breed" as any);
        break;
      case "Cat":
        router.push("/cat-breed" as any);
        break;
      case "Small Pet":
        router.push("/small-pet-breed" as any);
        break;
      default:
        break;
    }
  };

  // suitableFor is stored as a comma-separated string in the DB
  const getSuitableArray = (suitableFor?: string) => {
    if (!suitableFor) return [];
    return suitableFor
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Pet Type Selector */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Pet Type</Text>
        <View style={styles.petTypeRow}>
          {["Dog", "Cat", "Small Pet"].map((pet) => {
            const active = category.toLowerCase() === pet.toLowerCase();
            return (
              <TouchableOpacity
                key={pet}
                onPress={() => handlePetTypeClick(pet)}
                style={[styles.petTypeBtn, active && styles.petTypeBtnActive]}
              >
                <Text
                  style={[
                    styles.petTypeText,
                    active && styles.petTypeTextActive,
                  ]}
                >
                  {pet}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Search + Breed Quick List */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Choose Your Breed</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search breed..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />

        <View style={styles.breedListWrap}>
          {loading ? (
            <Text style={styles.mutedText}>Loading breeds...</Text>
          ) : breeds.length === 0 ? (
            <Text style={styles.mutedText}>No breeds found</Text>
          ) : (
            breeds.map((breed) => (
              <TouchableOpacity
                key={breed._id}
                onPress={() => handleBreedClick(breed)}
                style={[
                  styles.breedListItem,
                  search === breed.name && styles.breedListItemActive,
                ]}
              >
                <Text style={styles.breedListText}>{breed.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>

      {/* Breed Cards */}
      <View>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#06B6D4" />
            <Text style={styles.loadingText}>
              Loading catalog data from server...
            </Text>
          </View>
        ) : breeds.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.mutedText}>
              No pet breeds available matching your filter.
            </Text>
          </View>
        ) : (
          breeds.map((breed) => {
            const suitableList = getSuitableArray(breed.suitableFor);

            return (
              <TouchableOpacity
                key={breed._id}
                onPress={() => handleBreedClick(breed)}
                style={styles.breedCard}
                activeOpacity={0.85}
              >
                {/* Image */}
                <Image
                  source={{ uri: breed.image || "https://via.placeholder.com/400" }}
                  style={styles.breedImage}
                  resizeMode="cover"
                />

                {/* Content */}
                <View style={styles.breedContent}>
                  <Text style={styles.breedName}>{breed.name}</Text>

                  {/* Stats — exactly Weight / Height / Max-Life, matching the DB schema */}
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <View style={styles.statIconBox}>
                        <FontAwesome name="balance-scale" size={12} color="#fff" />
                      </View>
                      <View>
                        <Text style={styles.statLabel}>Weight</Text>
                        <Text style={styles.statValue}>
                          {breed.weight || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.statItem}>
                      <View style={styles.statIconBox}>
                        <FontAwesome name="arrows-v" size={12} color="#fff" />
                      </View>
                      <View>
                        <Text style={styles.statLabel}>Height</Text>
                        <Text style={styles.statValue}>
                          {breed.height || "N/A"}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.statItem}>
                      <View style={styles.statIconBox}>
                        <FontAwesome name="clock-o" size={12} color="#fff" />
                      </View>
                      <View>
                        <Text style={styles.statLabel}>Max-Life</Text>
                        <Text style={styles.statValue}>
                          {breed.maxlife || "N/A"}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Suitable For */}
                  <View>
                    <Text style={styles.suitableTitle}>Suitable For</Text>
                    <View style={styles.suitableRow}>
                      {suitableList.length > 0 ? (
                        suitableList.map((type: string) => (
                          <View key={type} style={styles.suitableItem}>
                            <View style={styles.suitableIconCircle}>
                              {getSuitableIcon(type)}
                            </View>
                            <Text style={styles.suitableLabel}>{type}</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.mutedTextSmall}>General</Text>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  sectionTitle: {
    color: "#06B6D4",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 12,
  },
  petTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  petTypeBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: "#F9FAFB",
  },
  petTypeBtnActive: {
    backgroundColor: "#F3F4F6",
  },
  petTypeText: {
    color: "#374151",
    fontSize: 14,
  },
  petTypeTextActive: {
    fontWeight: "600",
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
    color: "#111827",
  },
  breedListWrap: {
    borderLeftWidth: 4,
    borderLeftColor: "#FACC15",
    paddingLeft: 12,
    maxHeight: 220,
  },
  breedListItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  breedListItemActive: {
    backgroundColor: "#F3F4F6",
  },
  breedListText: {
    fontSize: 14,
    color: "#111827",
  },
  mutedText: {
    fontSize: 14,
    color: "#9CA3AF",
    paddingVertical: 8,
  },
  mutedTextSmall: {
    fontSize: 12,
    color: "#9CA3AF",
  },
  centerBox: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: "#6B7280",
    fontWeight: "500",
    marginTop: 10,
  },
  emptyCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 1,
  },
  breedCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  breedImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#F3E8FF",
  },
  breedContent: {
    padding: 18,
  },
  breedName: {
    color: "#0891B2",
    fontWeight: "600",
    fontSize: 17,
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    flex: 1,
  },
  statIconBox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: "#06B6D4",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#0891B2",
    fontWeight: "500",
  },
  statValue: {
    fontSize: 11,
    color: "#374151",
  },
  suitableTitle: {
    color: "#0891B2",
    fontWeight: "500",
    fontSize: 13,
    marginBottom: 10,
  },
  suitableRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  suitableItem: {
    alignItems: "center",
    gap: 4,
    width: 56,
  },
  suitableIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  suitableLabel: {
    fontSize: 11,
    color: "#4B5563",
    textAlign: "center",
  },
});