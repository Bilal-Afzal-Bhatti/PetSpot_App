import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter, usePathname } from "expo-router";

// Import your data (adjust path as needed for your React Native structure)
import {
  pets,
  breeds,
  popularBreeds,
  statesWithCities,
} from "@/components/dogs-for-sale/data";

const { width } = Dimensions.get("window");

export default function DogsCatchAllPage() {
  const pathname = usePathname();
  const router = useRouter();

  // Core states
  const [budget, setBudget] = useState<number>(500000);
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [showBreeds, setShowBreeds] = useState<boolean>(false);
  const [showStates, setShowStates] = useState<boolean>(false);
  const [showCities, setShowCities] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 12;

  // Sidebar/filter states
  const [petCategory, setPetCategory] = useState<string>("Dogs");
  const [lookingFor, setLookingFor] = useState<string>("Buying");
  const [sortBy, setSortBy] = useState<string>("");
  const [filteredPetsList, setFilteredPetsList] = useState(pets);
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState<string>("");

  const genderOptions = ["Male", "Female", "Other"];
  const featureOptions = [
    "Puppy Quality",
    "Pet Quality",
    "KCI Registered",
    "Champion Bloodline",
    "All",
  ];

  // Slug helpers
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
      return dec
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .trim()
        .split(/\s+/)
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");
    } catch {
      return s.replace(/-/g, " ");
    }
  };

  const findStateForCity = (cityName: string) => {
    if (!cityName) return "";
    for (const [state, cities] of Object.entries(statesWithCities)) {
      if (
        (cities as string[])
          .map((c: string) => c.toLowerCase())
          .includes(cityName.toLowerCase())
      )
        return state;
    }
    return "";
  };

  // Parse URL on pathname change
  useEffect(() => {
    const parsePath = () => {
      if (!pathname) return;
      const parts = pathname.split("/").filter(Boolean);

      if (parts[0] !== "dogs") return;

      let breed = "";
      let city = "";
      const inIdx = parts.indexOf("in");

      if (
        parts.length > 1 &&
        parts[1] !== "for-sale" &&
        !parts.includes("in", 1)
      ) {
        breed = unSlug(parts[1]);
      }
      if (inIdx !== -1 && parts[inIdx + 1]) {
        city = unSlug(parts[inIdx + 1]);
      }

      setSelectedBreed(breed);
      setSelectedCity(city);
      if (city) {
        const state = findStateForCity(city);
        if (state) setSelectedState(state);
      } else {
        setSelectedState("");
      }
    };

    parsePath();
  }, [pathname]);

  // Apply filters
  const applyFilters = () => {
    let result = pets.slice();
    setCurrentPage(1);

    if (selectedBreed) {
      const q = selectedBreed.toLowerCase();
      result = result.filter(
        (p) =>
          p.breed.toLowerCase().includes(q) || p.name.toLowerCase().includes(q)
      );
    }

    if (selectedCity) {
      result = result.filter((p) => p.city === selectedCity);
    } else if (selectedState) {
      const cities = (statesWithCities as Record<string, string[]>)[selectedState] || [];
      result = result.filter(
        (p) => cities.includes(p.city) || p.city === selectedState
      );
    }

    if (budget) result = result.filter((p) => p.price <= budget);
    if (selectedGender)
      result = result.filter((p) => p.gender === selectedGender);
    if (selectedFeature === "Puppy Quality") {
      result = result.filter((p) => {
        const weeks = parseInt(p.age || "0") || 0;
        return weeks <= 8;
      });
    }

    // Sorting
    if (sortBy === "priceLowHigh") result.sort((a, b) => a.price - b.price);
    else if (sortBy === "priceHighLow")
      result.sort((a, b) => b.price - a.price);
    else if (sortBy === "ageLowHigh")
      result.sort((a, b) => (parseInt(a.age) || 0) - (parseInt(b.age) || 0));
    else if (sortBy === "ageHighLow")
      result.sort((a, b) => (parseInt(b.age) || 0) - (parseInt(a.age) || 0));
    else if (sortBy === "newest") result.sort((a, b) => b.id - a.id);

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
  ]);

  const handleSearch = () => {
    applyFilters();
    const breedSlug = slugify(selectedBreed);
    const citySlug = slugify(selectedCity);

    let path: any = "/dogs/for-sale";
    if (breedSlug && citySlug)
      path = `/dogs/${breedSlug}/for-sale/in/${citySlug}`;
    else if (breedSlug) path = `/dogs/${breedSlug}/for-sale`;
    else if (citySlug) path = `/dogs/for-sale/in/${citySlug}`;

    router.push(path);
    setShowBreeds(false);
    setShowStates(false);
    setShowCities(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      
      {/* Search Bar Container */}
      <View style={styles.searchCard}>
        {/* Breed Input */}
        <View style={styles.inputBox}>
          <Text style={styles.iconText}>🐶</Text>
          <TextInput
            placeholder="Breed"
            placeholderTextColor="#9ca3af"
            value={selectedBreed}
            onChangeText={setSelectedBreed}
            onFocus={() => {
              setShowBreeds(true);
              setShowStates(false);
              setShowCities(false);
            }}
            style={styles.textInput}
          />
          {showBreeds && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {breeds
                  .filter((b) =>
                    b.toLowerCase().includes(selectedBreed.toLowerCase())
                  )
                  .map((breed) => (
                    <TouchableOpacity
                      key={breed}
                      onPress={() => {
                        setSelectedBreed(breed);
                        setShowBreeds(false);
                      }}
                      style={styles.dropdownItem}
                    >
                      <Text style={styles.dropdownItemText}>{breed}</Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* State Input */}
        <View style={styles.inputBox}>
          <Text style={styles.iconText}>📍</Text>
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
                    <Text style={styles.dropdownItemText}>{state}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* City Input */}
        <View style={styles.inputBox}>
          <Text style={styles.iconText}>📍</Text>
          <TextInput
            placeholder="City"
            placeholderTextColor="#9ca3af"
            value={selectedCity}
            editable={false}
            onPressIn={() => selectedState && setShowCities(!showCities)}
            style={styles.textInput}
          />
          {showCities && selectedState && (
            <View style={styles.dropdown}>
              <ScrollView style={{ maxHeight: 150 }} nestedScrollEnabled>
                {(statesWithCities as Record<string, string[]>)[selectedState].map((city) => (
                  <TouchableOpacity
                    key={city}
                    onPress={() => {
                      setSelectedCity(city);
                      setShowCities(false);
                    }}
                    style={styles.dropdownItem}
                  >
                    <Text style={styles.dropdownItemText}>{city}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Main Layout Body */}
      <View style={styles.mainLayout}>
        
        {/* Sidebar Filters Section */}
        <View style={styles.sidebar}>
          
          {/* Add Pet Box */}
          <View style={styles.filterCardBg}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardHeaderTitle}>Add Pet</Text>
              <Text style={styles.plusIcon}>＋</Text>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.filterOptionPad}>
              <Text style={styles.optionTextBold}>For Sale</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.filterOptionPad}>
              <Text style={styles.optionTextBold}>For Mating</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.filterOptionPad}>
              <Text style={styles.optionTextBold}>For Adoption</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeading}>Filters</Text>

          {/* I am Looking */}
          <View style={styles.filterCard}>
            <Text style={styles.cardHeaderTitle}>I am Looking</Text>
            <View style={styles.divider} />
            {["Buying", "Mating", "Adoption"].map((item) => (
              <View key={item}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setLookingFor(item)}
                >
                  <View style={styles.radioOuter}>
                    {lookingFor === item && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionTextBold}>For {item}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            ))}
          </View>

          {/* Pet Category */}
          <View style={styles.filterCard}>
            <Text style={styles.cardHeaderTitle}>Pet Category</Text>
            <View style={styles.divider} />
            {["Dogs", "Cats", "Small Pets"].map((cat) => (
              <View key={cat}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setPetCategory(cat)}
                >
                  <View style={styles.radioOuter}>
                    {petCategory === cat && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionTextBold}>{cat}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            ))}
          </View>

          {/* Sort By */}
          <View style={styles.filterCard}>
            <Text style={styles.cardHeaderTitle}>Sort By</Text>
            <View style={styles.divider} />
            {[
              { label: "Price Low to High", val: "priceLowHigh" },
              { label: "Price High to Low", val: "priceHighLow" },
              { label: "Age Low to High", val: "ageLowHigh" },
              { label: "Age High to Low", val: "ageHighLow" },
              { label: "Whats New", val: "newest" },
            ].map((sort) => (
              <View key={sort.val}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setSortBy(sort.val)}
                >
                  <View style={styles.radioOuter}>
                    {sortBy === sort.val && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionTextBold}>{sort.label}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            ))}
          </View>

          {/* Gender */}
          <View style={styles.filterCard}>
            <Text style={styles.cardHeaderTitle}>Gender</Text>
            <View style={styles.divider} />
            {genderOptions.map((opt) => (
              <View key={opt}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setSelectedGender(opt)}
                >
                  <View style={styles.radioOuter}>
                    {selectedGender === opt && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionTextBold}>{opt}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            ))}
          </View>

          {/* Pet Features */}
          <View style={styles.filterCard}>
            <Text style={styles.cardHeaderTitle}>Pet Features</Text>
            <View style={styles.divider} />
            {featureOptions.map((opt) => (
              <View key={opt}>
                <TouchableOpacity
                  style={styles.radioRow}
                  onPress={() => setSelectedFeature(opt)}
                >
                  <View style={styles.radioOuter}>
                    {selectedFeature === opt && <View style={styles.radioInner} />}
                  </View>
                  <Text style={styles.optionTextBold}>{opt}</Text>
                </TouchableOpacity>
                <View style={styles.divider} />
              </View>
            ))}
          </View>

          {/* Popular Breeds */}
          <Text style={styles.sectionHeading}>Popular Breeds</Text>
          <View style={styles.filterCard}>
            {popularBreeds.map((breed, i) => {
              const breedCount = pets.filter((p) => p.breed === breed).length;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setSelectedBreed(breed)}
                  style={styles.popularBreedRow}
                >
                  <Text style={styles.popularBreedText}>{breed}</Text>
                  <Text style={styles.breedCountText}>({breedCount})</Text>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>

        {/* Pets Grid + Pagination Section */}
        <View style={styles.contentArea}>
          
          <View style={styles.headerInfoCard}>
            <Text style={styles.breadcrumbText}>
              Home &gt; <Text style={{ color: "#8957E9" }}>Dogs</Text> &gt;
              {selectedBreed ? ` ${selectedBreed} for Sale` : " All Dogs for Sale"}
            </Text>
            <Text style={styles.mainTitle}>
              {selectedBreed ? `${selectedBreed} For Sale` : "Dogs For Sale"}
            </Text>
            <Text style={styles.resultCountText}>{filteredPetsList.length} Result Found</Text>
            <Text style={styles.subDescription}>
              <Text style={{ fontWeight: "600" }}>Pets in Pakistan:</Text> Find pets near you.
            </Text>
            <TouchableOpacity style={styles.readMoreBtn}>
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
          </View>

          {/* Grid loop */}
          <View style={styles.gridContainer}>
            {filteredPetsList
              .slice(
                (currentPage - 1) * ITEMS_PER_PAGE,
                currentPage * ITEMS_PER_PAGE
              )
              .map((pet) => (
                <View key={pet.id} style={styles.petCard}>
                  <View style={{ position: "relative" }}>
                    <Image source={{ uri: pet.img }} style={styles.petImage} />
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Pet Quality</Text>
                    </View>
                    <View style={styles.priceOverlay}>
                      <Text style={styles.priceOverlayText}>View Price</Text>
                    </View>
                  </View>

                  <View style={styles.petCardBody}>
                    <Text style={styles.petName}>{pet.name}</Text>
                    <Text style={styles.petDetailText}>
                      <Text style={{ fontWeight: "500" }}>Breed:</Text> {pet.breed}
                    </Text>
                    <View style={styles.rowInline}>
                      <Text style={styles.petDetailText}>
                        <Text style={{ fontWeight: "500" }}>Gender:</Text> {pet.gender}
                      </Text>
                      <Text style={styles.petDetailText}>
                        <Text style={{ fontWeight: "500" }}>Age:</Text> {pet.age}
                      </Text>
                    </View>
                    <Text style={styles.petDetailText}>
                      <Text style={{ fontWeight: "500" }}>City: </Text>
                      <Text style={styles.cityHighlight}>{pet.city}</Text>
                    </Text>

                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity style={styles.smallActionBtn}>
                        <Text style={styles.actionBtnText}>Call</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.smallActionBtn}>
                        <Text style={styles.actionBtnText}>Whatsapp</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.smallActionBtn}>
                        <Text style={styles.actionBtnText}>Details</Text>
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.bookNowBtn}>
                      <Text style={styles.bookNowText}>Book Now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}

            {filteredPetsList.length === 0 && (
              <Text style={styles.noPetsText}>No pets found for the current filters.</Text>
            )}
          </View>

          {/* Pagination Controls */}
          {filteredPetsList.length > ITEMS_PER_PAGE && (
            <View style={styles.paginationRow}>
              <TouchableOpacity
                disabled={currentPage === 1}
                onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                style={[
                  styles.pageBtn,
                  currentPage === 1 && { backgroundColor: "#f3f4f6" },
                ]}
              >
                <Text
                  style={[
                    styles.pageBtnText,
                    currentPage === 1 && { color: "#9ca3af" },
                  ]}
                >
                  Previous Page
                </Text>
              </TouchableOpacity>

              <Text style={styles.pageIndicatorText}>
                Page {currentPage} of {Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE)}
              </Text>

              <TouchableOpacity
                disabled={currentPage >= Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE)}
                onPress={() =>
                  setCurrentPage((p) =>
                    Math.min(Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE), p + 1)
                  )
                }
                style={[
                  styles.pageBtn,
                  currentPage >= Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE) &&
                    { backgroundColor: "#f3f4f6" },
                ]}
              >
                <Text
                  style={[
                    styles.pageBtnText,
                    currentPage >= Math.ceil(filteredPetsList.length / ITEMS_PER_PAGE) &&
                      { color: "#9ca3af" },
                  ]}
                >
                  Next Page
                </Text>
              </TouchableOpacity>
            </View>
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
  searchCard: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    gap: 12,
  },
  inputBox: {
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
  iconText: {
    fontSize: 16,
  },
  plusIcon: {
    color: "#8957E9",
    fontSize: 20,
    lineHeight: 20,
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
    elevation: 4,
    marginTop: 4,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#f3f4f6",
  },
  dropdownItemText: {
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
  mainLayout: {
    flex: 1,
    gap: 16,
  },
  sidebar: {
    width: "100%",
    marginBottom: 20,
  },
  filterCardBg: {
    backgroundColor: "#F9F6FF",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  filterCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeaderTitle: {
    fontWeight: "600",
    fontSize: 15,
    color: "#8957E9",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 8,
  },
  filterOptionPad: {
    paddingVertical: 4,
  },
  optionTextBold: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8957E9",
    marginVertical: 8,
  },
  radioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 4,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#8957E9",
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#8957E9",
  },
  popularBreedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  popularBreedText: {
    fontSize: 13,
    color: "#374151",
  },
  breedCountText: {
    fontSize: 13,
    color: "#6b7280",
  },
  contentArea: {
    flex: 1,
  },
  headerInfoCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  breadcrumbText: {
    fontSize: 12,
    color: "#6b7280",
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 6,
  },
  resultCountText: {
    fontSize: 14,
    color: "#4b5563",
    marginTop: 4,
  },
  subDescription: {
    fontSize: 13,
    color: "#4b5563",
    marginTop: 6,
  },
  readMoreBtn: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  readMoreText: {
    color: "#8957E9",
    fontSize: 12,
    fontWeight: "600",
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
    backgroundColor: "#8957E9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "600",
  },
  priceOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 6,
  },
  priceOverlayText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  petCardBody: {
    padding: 12,
    gap: 4,
  },
  petName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7e22ce",
    marginBottom: 4,
  },
  petDetailText: {
    fontSize: 12,
    color: "#374151",
  },
  rowInline: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cityHighlight: {
    color: "#8957E9",
    textDecorationLine: "underline",
  },
  actionButtonsRow: {
    flexDirection: "row",
    gap: 6,
    marginVertical: 8,
  },
  smallActionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#111827",
  },
  bookNowBtn: {
    backgroundColor: "#9461F7",
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  bookNowText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  noPetsText: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: 20,
    fontSize: 14,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  pageBtn: {
    backgroundColor: "#f3e8ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pageBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8957E9",
  },
  pageIndicatorText: {
    fontSize: 12,
    color: "#374151",
  },
});