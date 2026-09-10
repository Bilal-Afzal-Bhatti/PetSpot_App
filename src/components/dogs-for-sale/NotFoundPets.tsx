/**
 * NotFoundPetsScreen.tsx
 * React Native conversion of the NotFoundPets lead-capture form component.
 *
 * Notes on conversion:
 *  - `next/image` -> RN `Image` (local asset via `require`, update the path).
 *  - CSS `var(--gradient-hero)` -> `react-native-linear-gradient`
 *    (placeholder purple stops — swap in your real gradient colors).
 *  - HTML `<select>` dropdowns -> a small reusable `DropdownField` built with
 *    `Modal` + `FlatList`, since RN has no native `<select>`.
 *  - `<textarea>` -> `TextInput` with `multiline`.
 *  - Underline-only inputs recreated with `borderBottomWidth`.
 *  - Form wrapped in a `ScrollView` since RN has no native form scrolling
 *    behavior and the content is taller than one screen on most devices.
 *
 * Required packages:
 *   react-native-linear-gradient (or expo-linear-gradient on Expo)
 *   react-native-vector-icons (only if you want a chevron on the dropdowns)
 */

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
// Use a dependency-free fallback when the optional gradient package is not installed.
function LinearGradient({ children }: React.PropsWithChildren<{}>) {
  return <View style={styles.gradientFallback}>{children}</View>;
}

const PURPLE = "#8E5AF7";
const PURPLE_HOVER = "#7A47DF";

// ---------- Reusable dropdown field (stand-in for <select>) ----------
function DropdownField({
  placeholder,
  value,
  options,
  onSelect,
}: {
  placeholder: string;
  value: string;
  options: string[];
  onSelect: (val: string) => void;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.fieldUnderline} onPress={() => setVisible(true)}>
        <Text style={[styles.fieldText, { color: value ? "#fff" : "rgba(255,255,255,0.6)" }]}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              style={{ maxHeight: 300 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    onSelect(item);
                    setVisible(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text style={styles.modalItemText}>No options available</Text>
              }
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setVisible(false)}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function NotFoundPetsScreen() {
  const [name, setName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [dogOrCat, setDogOrCat] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [isPetParent, setIsPetParent] = useState("");
  const [planToPurchase, setPlanToPurchase] = useState("");
  const [scheduleCall, setScheduleCall] = useState("");
  const [location, setLocation] = useState("");
  const [remark, setRemark] = useState("");

  const handleSubmit = () => {
    // Wire this up to your API / AdStore submission logic.
    console.log({
      name,
      contactNo,
      email,
      dogOrCat,
      breed,
      gender,
      isPetParent,
      planToPurchase,
      scheduleCall,
      location,
      remark,
    });
  };

  return (
    <LinearGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Image */}
        <View style={styles.imageWrapper}>
          <Image
            source={require("../assets/listing-form.webp")}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        {/* Form */}
        <View style={styles.formWrapper}>
          <Text style={styles.heading}>
            Hey! Still not found what you are looking for?
          </Text>
          <Text style={styles.paragraph}>
            No worries!! Let our pet experts come to your rescue. Fill in your
            details and we will give you a call. Our MMP experts have
            successfully helped in completing 4000+ families by finding and
            connecting them to their lovable furbabies across India.
          </Text>

          <View style={styles.formGrid}>
            <TextInput
              placeholder="Your Name"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={name}
              onChangeText={setName}
              style={styles.fieldUnderline}
            />
            <TextInput
              placeholder="Contact No"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={contactNo}
              onChangeText={setContactNo}
              keyboardType="phone-pad"
              style={styles.fieldUnderline}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.fieldUnderline}
            />

            <DropdownField
              placeholder="Dogs / Cats"
              value={dogOrCat}
              options={["Dogs", "Cats"]}
              onSelect={setDogOrCat}
            />
            <DropdownField
              placeholder="Breed"
              value={breed}
              options={["Labrador Retriever", "German Shepherd", "Persian", "Siamese", "Beagle"]}
              onSelect={setBreed}
            />
            <DropdownField
              placeholder="Gender"
              value={gender}
              options={["Male", "Female"]}
              onSelect={setGender}
            />
            <DropdownField
              placeholder="Are you a Pet Parent?"
              value={isPetParent}
              options={["Yes", "No"]}
              onSelect={setIsPetParent}
            />
            <DropdownField
              placeholder="Plan to Purchase"
              value={planToPurchase}
              options={["Within a week", "Within a month", "Just exploring"]}
              onSelect={setPlanToPurchase}
            />

            <TextInput
              placeholder="Schedule a call"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={scheduleCall}
              onChangeText={setScheduleCall}
              style={styles.fieldUnderline}
            />
            <TextInput
              placeholder="Location"
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={location}
              onChangeText={setLocation}
              style={styles.fieldUnderline}
            />

            <TextInput
              placeholder="Remark..."
              placeholderTextColor="rgba(255,255,255,0.6)"
              value={remark}
              onChangeText={setRemark}
              multiline
              numberOfLines={3}
              style={[styles.fieldUnderline, styles.textArea, { width: "100%" }]}
            />
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.85}>
            <Text style={styles.submitBtnText}>Let's Roll</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientFallback: {
    flex: 1,
    backgroundColor: "#8E5AF7",
  },
  container: {
    paddingHorizontal: 24,
    paddingVertical: 48,
  },

  imageWrapper: {
    alignItems: "center",
    marginBottom: 32,
  },
  image: {
    width: 260,
    height: 260,
    borderRadius: 16,
  },

  formWrapper: {},
  heading: {
    fontSize: 19,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 13,
    color: "#fff",
    lineHeight: 20,
    marginBottom: 28,
  },

  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 20,
  },

  fieldUnderline: {
    width: "48%",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.5)",
    paddingVertical: 8,
    color: "#fff",
    fontSize: 14,
  },
  fieldText: { fontSize: 14 },

  textArea: {
    textAlignVertical: "top",
    minHeight: 70,
  },

  submitBtn: {
    alignSelf: "flex-end",
    backgroundColor: PURPLE,
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 16,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  // Dropdown modal
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
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalItemText: { fontSize: 14, color: "#1f2937" },
  modalCloseBtn: {
    marginTop: 12,
    backgroundColor: PURPLE_HOVER,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
});