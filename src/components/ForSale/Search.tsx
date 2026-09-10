import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { FiMapPin, FiPlus } from "react-icons/fi"; // Or use your vector-icons library like @expo/vector-icons
import { FaDog } from "react-icons/fa";

// Import your data (adjust paths relative to your Expo structure)
import {
  pets,
  breeds,
  statesWithCities,
} from "@/Components/dogs-for-sale/data";

const { width } = Dimensions.get("window");

export default function DogsCatchAllPage() {
  const pathname = usePathname();
  const router = useRouter();

  // States
  const [budget, setBudget] = useState<number>(500000);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showBreeds, setShowBreeds] = useState<boolean>(false);
  const [showStates, setShowStates] = useState<boolean>(false);
  const [showCities, setShowCities] = useState<boolean>(false);
  
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  const [petCategory, setPetCategory] = useState<string>("Dogs");
  const [lookingFor, setLookingFor] = useState<string>("Buying");
  const [sortBy, setSortBy] = useState<string>("");
  const [filteredPetsList, setFilteredPetsList] = useState(pets);

  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState<string>("");

  // Helpers
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

  const unSlug = (s?: string) => {
    if (!s) return "";
    try {
      const dec = decodeURIComponent(s);
      const words = dec
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .trim()
        .split(/\s+/)
        .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w));
      return words.join(" ");
    } catch {
      return s.replace(/-/g, " ");
    }
  };

  const findStateForCity = (cityName: string) => {
    if (!cityName) return "";
    for (const [state, cities] of Object.entries(statesWithCities)) {
      if ((cities as string[]).map((c) => c.toLowerCase()).includes(cityName.toLowerCase())) {
        return state;
      }
    }
    return "";
  };

  // Parse Pathname sync
  useEffect(() => {
    if (!pathname) return;
    const parts = pathname.split("/").filter(Boolean);
    let breedFromPath = "";
    let cityFromPath = "";

    if (parts[0] !== "dogs") return;

    const forSaleIdx = parts.indexOf("for-sale");
    const inIdx = parts.indexOf("in");

    if (parts.length >= 2 && parts[1] !== "for-sale") {
      if (forSaleIdx === 2 || forSaleIdx === -1) {
        breedFromPath = parts[1];
      }
    }

    if (inIdx !== -1 && parts.length > inIdx + 1) {
      cityFromPath = parts[inIdx + 1];
    }

    const breedReadable = unSlug(breedFromPath);
    const cityReadable = unSlug(cityFromPath);

    if (breedReadable && breedReadable !== selectedBreed) {
      setSelectedBreed(breedReadable);
    } else if (!breedReadable) {
      setSelectedBreed("");
    }

    if (cityReadable && cityReadable !== selectedCity) {
      setSelectedCity(cityReadable);
      const stateFound = findStateForCity(cityReadable);
      if (stateFound) setSelectedState(stateFound);
    } else if (!cityReadable) {
      setSelectedCity("");
    }
  }, [pathname]);

  // Filtering logic
  const applyFilters = () => {
    let result = pets.slice();
    setCurrentPage(1);

    if (selectedBreed && selectedBreed.trim() !== "") {
      const q = selectedBreed.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.breed.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      );
    }

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    } else if (selectedState) {
      const cities = (statesWithCities as any)[selectedState] || [];
      if (cities.length > 0) {
        result = result.filter(
          (p) => cities.includes(p.city) || p.city === selectedState
        );
      } else {
        result = result.filter((p) => p.city === selectedState);
      }
    }

    if (budget !== undefined && budget !== null) {
      result = result.filter((p) => p.price <= budget);
    }

    if (selectedGender) {
      result = result.filter((p) => p.gender === selectedGender);
    }

    if (selectedFeature === "Puppy Quality") {
      result = result.filter((p) => {
        const weeks = parseInt(String(p.age || "0"), 10) || 0;
        return weeks <= 8;
      });
    }

    if (sortBy === "priceLowHigh") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHighLow") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    setFilteredPetsList(result);
  };

  useEffect(() => {
    applyFilters();
  }, [
    selectedBreed,
    selectedState,
    selectedCity,
    budget,
    selectedGender,
    selectedFeature,
    sortBy,
    petCategory,
    lookingFor,
  ]);

  const handleSearch = () => {
    applyFilters();
    const breedSlug = slugify(selectedBreed);
    const citySlug = slugify(selectedCity);

    let path: any = "/dogs/for-sale";
    if (breedSlug && citySlug) {
      path = `/dogs/${breedSlug}/for-sale/in/${citySlug}`;
    } else if (breedSlug) {
      path = `/dogs/${breedSlug}/for-sale`;
    } else if (citySlug) {
      path = `/dogs/for-sale/in/${citySlug}`;
    }

    router.push(path);
  };

  const handleViewPet = (pet: any) => {
    const petName = pet.name || pet.title || "Pet";
    const petBreed = pet.breed || "dogs";
    const petSlug = `${slugify(petName)}-${slugify(petBreed)}`;
    const petId = pet._id || pet.id;

    router.push({
      pathname: "/(dogs)/[id]", 
      params: { 
        id: petId,
        slug: petSlug,
        petData: JSON.stringify(pet) 
      },
    });
  };

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedList = filteredPetsList.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* 🔍 Integrated Search Bar Container */}
      <View style={styles.searchContainer}>
        {/* Breed Input */}
        <View style={styles.inputWrapper}>
          <FaDog size={16} color="#9ca3af" />
          <TextInput
            placeholder="Breed"
            placeholderTextColor="#9ca3af"
            value={selectedBreed}
            onFocus={() => {
              setShowBreeds(true);
              setShowStates(false);
              setShowCities(false);
            }}
            onChangeText={setSelectedBreed}
            style={styles.textInput}
          />
          {showBreeds && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {breeds
                  .filter((b) => b.toLowerCase().includes(selectedBreed.toLowerCase()))
                  .map((breed) => (
                    <TouchableOpacity
                      key={breed}
                      onPress={() => {
                        setSelectedBreed(breed);
                        setShowBreeds(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownText}>{breed}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* State Input */}
        <View style={styles.inputWrapper}>
          <FiMapPin size={16} color="#9ca3af" />
          <TextInput
            placeholder="State"
            placeholderTextColor="#9ca3af"
            value={selectedState}
            editable={false}
            onPressIn={() => {
              setShowStates(!showStates);
              setShowBreeds(false);
              setShowCities(false);
            }}
            style={styles.textInput}
          />
          {showStates && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {Object.keys(statesWithCities).map((state) => (
                  <TouchableOpacity
                    key={state}
                    onPress={() => {
                      setSelectedState(state);
                      setSelectedCity("");
                      setShowStates(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{state}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* City Input */}
        <View style={styles.inputWrapper}>
          <FiMapPin size={16} color="#9ca3af" />
          <TextInput
            placeholder="City"
            placeholderTextColor="#9ca3af"
            value={selectedCity}
            editable={false}
            onPressIn={() => {
              if (selectedState) {
                setShowCities(!showCities);
                setShowBreeds(false);
                setShowStates(false);
              }
            }}
            style={styles.textInput}
          />
          {showCities && selectedState && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {(statesWithCities as any)[selectedState].map((city: string) => (
                  <TouchableOpacity
                    key={city}
                    onPress={() => {
                      setSelectedCity(city);
                      setShowCities(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Search Button */}
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Body */}
      <View style={styles.mainBody}>
        {/* Breadcrumb / Header info */}
        <View style={styles.headerCard}>
          <Text style={styles.breadcrumb}>
            Home &gt; <Text style={{ color: "#9333ea" }}>Dogs</Text> &gt;{" "}
            {selectedBreed ? `${selectedBreed} for Sale` : "All Dogs for Sale"}
          </Text>
          <Text style={styles.title}>
            {selectedBreed ? `${selectedBreed} For Sale` : "Dogs For Sale"}
          </Text>
          <Text style={styles.subtitle}>
            <Text style={{ fontWeight: "600" }}>Pets in Pakistan:</Text> Find pets near you.
          </Text>
        </View>

        {/* Pet Grid */}
        <View style={styles.gridContainer}>
          {paginatedList.length === 0 ? (
            <Text style={styles.noPetsText}>No pets found for the current filters.</Text>
          ) : (
            paginatedList.map((pet) => (
              <View key={pet.id} style={styles.petCard}>
                <View style={{ position: "relative" }}>
                  <Image source={{ uri: pet.img }} style={styles.petImage} />
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Pet Quality</Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <Text style={styles.petName}>{pet.name}</Text>
                  <Text style={styles.petText}><Text style={{ fontWeight: "500" }}>Breed:</Text> {pet.breed}</Text>
                  <Text style={styles.petText}>
                    <Text style={{ fontWeight: "500" }}>Gender:</Text> {pet.gender}   
                    <Text style={{ fontWeight: "500", marginLeft: 10 }}> Age:</Text> {pet.age}
                  </Text>
                  <Text style={styles.petText}>
                    <Text style={{ fontWeight: "500" }}>City:</Text>{" "}
                    <Text style={{ color: "#9333ea", textDecorationLine: "underline" }}>{pet.city}</Text>
                  </Text>

                  {/* Action Buttons */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>Call</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>Whatsapp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionBtn}
                      onPress={() => handleViewPet(pet)}
                    >
                      <Text style={styles.actionBtnText}>Details</Text>
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity 
                    style={styles.bookButton}
                    onPress={() => handleViewPet(pet)}
                  >
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  searchContainer: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 10,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: "relative",
  },
  textInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: "#374151",
  },
  dropdown: {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 6,
    zIndex: 1000,
    elevation: 5,
    marginTop: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  dropdownText: {
    fontSize: 14,
    color: "#374151",
  },
  searchButton: {
    backgroundColor: "#8957E9",
    borderRadius: 6,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 16,
  },
  mainBody: {
    flex: 1,
  },
  headerCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  breadcrumb: {
    fontSize: 12,
    color: "#6b7280",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 6,
  },
  subtitle: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 6,
  },
  gridContainer: {
    gap: 16,
  },
  petCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  petImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  badge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#9333ea",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  cardBody: {
    padding: 12,
    gap: 6,
  },
  petName: {
    color: "#7e22ce",
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 4,
  },
  petText: {
    fontSize: 12,
    color: "#374151",
  },
  actionRow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#111827",
  },
  bookButton: {
    backgroundColor: "#9461F7",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 6,
  },
  bookButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  noPetsText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
    fontSize: 14,
  },
});