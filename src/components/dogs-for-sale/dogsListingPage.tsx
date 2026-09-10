/**
 * DogsScreen.tsx
 * React Native conversion of the Dogs page component.
 *
 * FILTERS SIMPLIFIED:
 *   Only City, Price (budget) and Gender remain.
 *
 * PAGE STRUCTURE:
 *   1. Filter (City / Price / Gender)
 *   2. Dogs (grid list of ads)
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Linking,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { useAdStore } from "@/../Store/AdsStore";
import { statesWithDogCities } from "./data";

const ITEMS_PER_PAGE = 12;
const PRIMARY = "#ea580c"; // Warm orange theme for dogs
const PRIMARY_HOVER = "#c2410c";

const genderOptions = ["Male", "Female", "Other"];

type LocalSliderProps = {
  minimumValue: number;
  maximumValue: number;
  value: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
};

// Local slider avoids requiring external slider package dependencies
const Slider = ({
  minimumValue,
  maximumValue,
  value,
  onValueChange,
  minimumTrackTintColor = PRIMARY,
  maximumTrackTintColor = "#D1D5DB",
  thumbTintColor = PRIMARY,
}: LocalSliderProps) => {
  const percentage = Math.max(
    0,
    Math.min(100, ((value - minimumValue) / (maximumValue - minimumValue || 1)) * 100)
  );

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onValueChange(value >= maximumValue ? minimumValue : maximumValue)}
      style={{ height: 32, justifyContent: "center" }}
      accessibilityRole="adjustable"
      accessibilityValue={{ min: minimumValue, max: maximumValue, now: value }}
    >
      <View style={{ height: 4, borderRadius: 2, backgroundColor: maximumTrackTintColor }}>
        <View
          style={{
            width: `${percentage}%`,
            height: 4,
            borderRadius: 2,
            backgroundColor: minimumTrackTintColor,
          }}
        />
        <View
          style={{
            position: "absolute",
            left: `${percentage}%`,
            top: -6,
            marginLeft: -8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: thumbTintColor,
          }}
        />
      </View>
    </TouchableOpacity>
  );
};

// Flatten all cities from every state into one simple list
const ALL_CITIES: string[] = Array.from(
  new Set(Object.values(statesWithDogCities || {}).flat() as string[])
).sort();

export default function DogsScreen() {
  const router = useRouter();

  // ---------- Filter state ----------
  const [budget, setBudget] = useState<number>(500000);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [showCityModal, setShowCityModal] = useState<boolean>(false);
  const [citySearch, setCitySearch] = useState<string>("");

  // ---------- Pagination / API state ----------
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [apiData, setApiData] = useState<any[]>([]);
  const [filteredPetsList, setFilteredPetsList] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [totalPages, setTotalPages] = useState<number>(1);

  // AdsStore approved-ads fetcher for dogs
  const { getApprovedAds: fetchApprovedAds } = useAdStore();
  const getApprovedAds = (category: string, page: number, limit: number) =>
    fetchApprovedAds("dogs", page, limit);

  // ---------- Fetch Ads ----------
  useEffect(() => {
    const fetchApprovedDogAds = async () => {
      setLoading(true);
      try {
        const result = await getApprovedAds("dogs", currentPage, ITEMS_PER_PAGE);
        setApiData(result.ads || []);
        setFilteredPetsList(result.ads || []);
        setTotalPages(result.pagination?.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch approved dog ads:", error);
        setApiData([]);
        setFilteredPetsList([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApprovedDogAds();
  }, [currentPage]);

  // ---------- Apply Filters (City / Price / Gender) ----------
  const applyFilters = () => {
    if (!apiData.length) return;
    let result = [...apiData];

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    }

    if (budget !== undefined && budget !== null) {
      result = result.filter((p) => p.price <= budget);
    }

    if (selectedGender) {
      result = result.filter((p) => p.gender === selectedGender);
    }

    setFilteredPetsList(result);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedCity, budget, selectedGender, apiData]);

  const clearFilters = () => {
    setSelectedCity("");
    setSelectedGender("");
    setBudget(500000);
  };

  // ---------- Utility Helpers ----------
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

  // ---------- Actions ----------
  const handleViewPet = (pet: any) => {
    const petName = pet.name || pet.title || "Pet";
    const petBreed = pet.breed || "dogs";
    const petSlug = `${slugify(petName)}-${slugify(petBreed)}`;
    const petId = pet._id || pet.id;

    // Expo Router push targeting dog route segment
    router.push({
      pathname: "/(dogs)/pet/[id]",
      params: {
        id: petId,
        slug: petSlug,
        petData: JSON.stringify(pet),
      },
    });
  };

  const handleCall = (number: string) => {
    if (number) Linking.openURL(`tel:${number}`);
  };

  const handleWhatsApp = (number: string) => {
    if (!number) return;
    const text = encodeURIComponent("Hi, I saw your dog ad, I am interested");
    Linking.openURL(`https://wa.me/${number}?text=${text}`);
  };

  // ---------- Render Helpers ----------
  const renderCityModal = () => (
    <Modal
      visible={showCityModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowCityModal(false)}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setShowCityModal(false)}
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select City</Text>
          <TextInput
            placeholder="Search city"
            value={citySearch}
            onChangeText={setCitySearch}
            style={styles.modalSearchInput}
          />
          <FlatList
            data={ALL_CITIES.filter((c) =>
              c.toLowerCase().includes(citySearch.toLowerCase())
            )}
            keyExtractor={(item) => item}
            style={{ maxHeight: 320 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => {
                  setSelectedCity(item);
                  setShowCityModal(false);
                  setCitySearch("");
                }}
              >
                <Text style={styles.modalItemText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseBtn}
            onPress={() => setShowCityModal(false)}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  const renderDogCard = ({ item: pet }: { item: any }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: pet.img || pet.images?.[0] || "https://placehold.co/400x300" }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{pet.name}</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Breed</Text>
          <Text style={styles.value}>{pet.breed}</Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Gender & Age</Text>
          <Text style={styles.value}>
            {pet.gender}, {pet.age} {pet.age === 1 ? "month" : "months"}
          </Text>
        </View>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Location</Text>
          <Text style={[styles.value, { color: PRIMARY }]}>{pet.city}</Text>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleCall(pet.contactNumber)}
          >
            <Feather name="phone" size={14} color="#16a34a" />
            <Text style={styles.actionBtnText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleWhatsApp(pet.contactNumber)}
          >
            <FontAwesome5 name="whatsapp" size={14} color="#16a34a" />
            <Text style={styles.actionBtnText}>Chat</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#fff7ed" }]}
            onPress={() => handleViewPet(pet)}
          >
            <Feather name="info" size={14} color={PRIMARY} />
            <Text style={[styles.actionBtnText, { color: PRIMARY }]}>Info</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.priceBtn}>
          <Text style={styles.priceBtnText}>
            {pet.price?.toLocaleString() || "N/A"} PKR
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={loading ? [] : filteredPetsList}
        keyExtractor={(item) => item._id || item.id}
        numColumns={2}
        columnWrapperStyle={{ gap: 12 }}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        renderItem={renderDogCard}
        ListHeaderComponent={
          <View>
            {/* ============ 1. FILTER ============ */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Filter</Text>

              {/* City */}
              <Text style={styles.filterLabel}>City</Text>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={() => setShowCityModal(true)}
              >
                <Feather name="map-pin" size={16} color="#9CA3AF" />
                <Text
                  style={[
                    styles.inputText,
                    { color: selectedCity ? "#1f2937" : "#9CA3AF" },
                  ]}
                >
                  {selectedCity || "Select City"}
                </Text>
              </TouchableOpacity>

              {/* Price / Budget */}
              <Text style={styles.filterLabel}>Budget</Text>
              <Slider
                minimumValue={0}
                maximumValue={1000000}
                value={budget}
                onValueChange={setBudget}
                minimumTrackTintColor={PRIMARY}
                maximumTrackTintColor="#D1D5DB"
                thumbTintColor={PRIMARY}
              />
              <View style={styles.rowBetween}>
                <Text style={styles.sliderEndLabel}>0</Text>
                <Text style={styles.sliderEndLabel}>10L</Text>
              </View>
              <Text style={styles.budgetValueText}>
                Your Budget: <Text style={{ fontWeight: "700" }}>{Math.round(budget)} PKR</Text>
              </Text>

              {/* Gender */}
              <Text style={styles.filterLabel}>Gender</Text>
              <View style={styles.genderRow}>
                {genderOptions.map((opt) => {
                  const active = selectedGender === opt;
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setSelectedGender(active ? "" : opt)}
                      style={[
                        styles.genderChip,
                        active && { backgroundColor: PRIMARY, borderColor: PRIMARY },
                      ]}
                    >
                      <Text
                        style={[
                          styles.genderChipText,
                          active && { color: "#fff" },
                        ]}
                      >
                        {opt}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.filterButtonsRow}>
                <TouchableOpacity style={styles.applyBtn} onPress={applyFilters}>
                  <Text style={styles.applyBtnText}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
                  <Text style={styles.clearBtnText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* ============ 2. DOGS LIST ============ */}
            <Text style={styles.sectionTitle}>Dogs</Text>

            {loading && (
              <View style={{ paddingVertical: 40, alignItems: "center" }}>
                <ActivityIndicator size="large" color={PRIMARY} />
              </View>
            )}

            {!loading && filteredPetsList.length === 0 && (
              <View style={{ paddingVertical: 40, alignItems: "center" }}>
                <Text style={{ fontSize: 40, marginBottom: 8 }}>🐶</Text>
                <Text style={styles.emptyTitle}>No dogs found</Text>
                <Text style={styles.emptySubtitle}>Try adjusting your filters</Text>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          !loading && totalPages > 1 ? (
            <View style={styles.paginationRow}>
              <TouchableOpacity
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={[
                  styles.pageBtn,
                  currentPage === 1 && styles.pageBtnDisabled,
                ]}
              >
                <Text style={styles.pageBtnText}>Previous</Text>
              </TouchableOpacity>

              <Text style={styles.pageIndicator}>
                Page {currentPage} of {totalPages}
              </Text>

              <TouchableOpacity
                disabled={currentPage === totalPages}
                onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                style={[
                  styles.pageBtn,
                  currentPage === totalPages && styles.pageBtnDisabled,
                ]}
              >
                <Text style={styles.pageBtnText}>Next</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
      {renderCityModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF7ED" },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginVertical: 12,
  },

  // Filter section
  filterSection: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    marginTop: 14,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputText: { fontSize: 14 },

  sliderEndLabel: { fontSize: 12, color: "#6B7280", fontWeight: "600" },
  budgetValueText: { fontSize: 13, color: "#374151", marginTop: 4 },

  genderRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  genderChip: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  genderChipText: { fontSize: 13, fontWeight: "600", color: "#374151" },

  filterButtonsRow: { flexDirection: "row", gap: 10, marginTop: 18 },
  applyBtn: {
    flex: 1,
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  applyBtnText: { color: "#fff", fontWeight: "700" },
  clearBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  clearBtnText: { color: PRIMARY, fontWeight: "700" },

  // Dog card
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    marginBottom: 4,
  },
  cardImage: { width: "100%", height: 150, backgroundColor: "#e5e7eb" },
  cardBody: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#1f2937", marginBottom: 8 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: { fontSize: 12, color: "#6B7280" },
  value: { fontSize: 12, fontWeight: "700", color: "#1f2937" },

  actionsRow: { flexDirection: "row", gap: 6, marginTop: 8, marginBottom: 8 },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "#f0fdf4",
    borderRadius: 8,
    paddingVertical: 8,
  },
  actionBtnText: { fontSize: 11, fontWeight: "600", color: "#16a34a" },

  priceBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  priceBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },

  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#1f2937" },
  emptySubtitle: { fontSize: 13, color: "#6B7280", marginTop: 4 },

  // Pagination
  paginationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    paddingVertical: 24,
  },
  pageBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
  },
  pageBtnDisabled: { backgroundColor: "#D1D5DB" },
  pageBtnText: { color: "#fff", fontWeight: "600", fontSize: 13 },
  pageIndicator: { fontSize: 13, fontWeight: "600", color: "#374151" },

  // City modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    maxHeight: "70%",
  },
  modalTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10, color: "#1f2937" },
  modalSearchInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalItemText: { fontSize: 14, color: "#1f2937" },
  modalCloseBtn: {
    marginTop: 12,
    backgroundColor: PRIMARY_HOVER,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
});