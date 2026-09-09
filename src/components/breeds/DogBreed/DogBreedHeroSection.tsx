import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Picker } from "@react-native-picker/picker";

export default function DogBreedHeroSection() {
  const router = useRouter();

  const [selectedPet, setSelectedPet] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");

  // Sample breed data
  const breeds = {
    Dogs: [
      "Labrador Retriever",
      "German Shepherd",
      "Golden Retriever",
      "Pug",
      "Bulldog",
      "Beagle",
    ],
    Cats: ["Persian", "Maine Coon", "Siamese", "Bengal", "Ragdoll", "Sphynx"],
  };

  type PetType = keyof typeof breeds;

  const handleSearch = () => {
    if (!selectedPet) {
      Alert.alert("Missing Info", "Please select a pet type first!");
      return;
    }
    if (!selectedBreed) {
      Alert.alert("Missing Info", "Please select a breed!");
      return;
    }

    // make breed url friendly
    const breedSlug = selectedBreed.toLowerCase().replace(/\s+/g, "-");

    const route =
      selectedPet === "Dogs"
        ? `/dog-breed/${breedSlug}`
        : selectedPet === "Cats"
        ? `/cat-breed/${breedSlug}`
        : "/";

    router.push(route as any);
  };

  return (
    <LinearGradient
      colors={["#0EA5B7", "#0891B2"]} // replace with your --gradient-hero colors
      style={styles.section}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Pets Complete Your Family</Text>

        {/* Search row */}
        <View style={styles.searchRow}>
          {/* Select Pet Type */}
          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={selectedPet}
              onValueChange={(value) => {
                setSelectedPet(value);
                setSelectedBreed(""); // reset breed when pet type changes
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select Pet Type" value="" />
              <Picker.Item label="Dogs" value="Dogs" />
              <Picker.Item label="Cats" value="Cats" />
            </Picker>
          </View>

          {/* Select Breed */}
          <View
            style={[
              styles.pickerWrap,
              !selectedPet && styles.pickerWrapDisabled,
            ]}
          >
            <Picker
              selectedValue={selectedBreed}
              onValueChange={(value) => setSelectedBreed(value)}
              enabled={!!selectedPet}
              style={styles.picker}
            >
              <Picker.Item label="Select Breed" value="" />
              {selectedPet &&
                breeds[selectedPet as PetType].map((breed) => (
                  <Picker.Item key={breed} label={breed} value={breed} />
                ))}
            </Picker>
          </View>

          {/* Search Button */}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Search</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  section: {
    minHeight: 280, // ~40vh equivalent, fixed for mobile
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 60,
  },
  content: {
    width: "100%",
    maxWidth: 1100,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  searchRow: {
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    gap: 10,
  },
  pickerWrap: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
  },
  pickerWrapDisabled: {
    backgroundColor: "#E5E7EB",
  },
  picker: {
    width: "100%",
    color: "#374151",
  },
  searchBtn: {
    backgroundColor: "#FACC15", // replace with your --color-primary
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 40,
    width: "100%",
    alignItems: "center",
  },
  searchBtnText: {
    color: "#000",
    fontWeight: "500",
    fontSize: 15,
  },
});