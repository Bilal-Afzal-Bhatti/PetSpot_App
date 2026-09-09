import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Picker } from "@react-native-picker/picker";

export default function BreedInfoSidebar() {
  const params = useLocalSearchParams();
  const breedParam = params?.breed;
  const breed =
    typeof breedParam === "string"
      ? breedParam
      : Array.isArray(breedParam)
      ? breedParam[0]
      : "";

  const router = useRouter();
  const [selectedBreed, setSelectedBreed] = useState("");

  const dogs = [
    "Labrador Retriever",
    "German Shepherd",
    "Golden Retriever",
    "Pug",
    "Bulldog",
    "Beagle",
  ];

  // When user selects a breed → navigate
  const handleBreedChange = (value: string) => {
    setSelectedBreed(value);

    if (value) {
      const slug = value.toLowerCase().replace(/\s+/g, "-");
      router.push(`/dog-breed/${slug}` as any);
    }
  };

  // Navigate to sale page
  const handleViewClick = () => {
    if (breed) {
      const slug = breed.toLowerCase().replace(/\s+/g, "-");
      router.push(`/dogs/${slug}/for-sale` as any);
    } else {
      router.push(`/dogs` as any);
    }
  };

  return (
    <View style={styles.sidebar}>
      <Text style={styles.heading}>Choose Your Breed</Text>

      <View style={styles.pickerWrap}>
        <Picker
          selectedValue={selectedBreed}
          onValueChange={handleBreedChange}
          style={styles.picker}
        >
          <Picker.Item label="Select a Dog Breed" value="" />
          {dogs.map((d) => (
            <Picker.Item key={d} label={d} value={d} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.viewBtn} onPress={handleViewClick}>
        <Text style={styles.viewBtnText}>
          View {breed ? `${breed} Puppies` : "All Dogs"}
        </Text>
      </TouchableOpacity>

      <Text style={styles.subHeading}>Why Choose Pets Corner?</Text>

      {/* === Why Choose MMP Section === */}
      <View style={styles.infoList}>
        <View>
          <Text style={styles.infoTitle}>Healthy Pet</Text>
          <Text style={styles.infoText}>
            Being pet lovers ourselves, we understand the importance of a
            pet's health. All our puppies are at least eight weeks old when
            they are sent to you. Before your bundle of joy reaches you, they
            undergo a complete health checkup by a licensed veterinarian.
          </Text>
        </View>

        <View>
          <Text style={styles.infoTitle}>Vaccinated & Insured Pet</Text>
          <Text style={styles.infoText}>
            To make your first experience with your furry family member
            smooth and worry-free, we ensure that all our puppies are
            up-to-date on their vaccinations and are fully insured.
          </Text>
        </View>

        <View>
          <Text style={styles.infoTitle}>Responsible Breeders</Text>
          <Text style={styles.infoText}>
            All our puppies are raised by responsible breeders who prioritize
            their pet's health above all. We strictly oppose puppy mills —
            every breeder we work with is a genuine pet lover committed to
            finding the best homes for their fur babies.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: "100%",
    paddingHorizontal: 16,
  },
  heading: {
    fontWeight: "600",
    fontSize: 16,
    color: "#027B82", // 🔁 replace with your --color-primary-hover
    marginBottom: 12,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    color: "#374151",
  },
  viewBtn: {
    width: "100%",
    backgroundColor: "#0891B2", // 🔁 replace with --gradient-hero color, swap to LinearGradient once installed
    borderRadius: 6,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginVertical: 20,
    alignItems: "center",
  },
  viewBtnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 14,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 22,
    fontWeight: "600",
    color: "#027B82", // 🔁 replace with your --color-primary-hover
    marginBottom: 12,
  },
  infoList: {
    gap: 20,
  },
  infoTitle: {
    fontWeight: "600",
    fontSize: 17,
    color: "#111827",
  },
  infoText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 20,
    marginTop: 4,
  },
});