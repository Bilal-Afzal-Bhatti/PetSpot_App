import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function NotFoundPets() {
  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    contactNo: "",
    email: "",
    petType: "",
    breed: "",
    gender: "",
    isPetParent: "",
    planToPurchase: "",
    scheduleCall: "",
    location: "",
    remark: "",
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top/Left Side Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require("../../../assets/listing-form.webp")} // Update to your local path
          style={styles.image}
        />
      </View>

      {/* Right Side Form Content */}
      <View style={styles.formContainer}>
        <Text style={styles.title}>
          Hey! Still not found what you are looking for?
        </Text>
        <Text style={styles.subtitle}>
          No worries!! Let our pet experts come to your rescue. Fill in your
          details and we will give you a call. Our MMP experts have successfully
          helped in completing 4000+ families by finding and connecting them to
          their lovable furbabies across Pakistan.
        </Text>

        <View style={styles.formGrid}>
          {/* Name */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Your Name"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => updateField("name", text)}
            />
          </View>

          {/* Contact No */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Contact No"
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              style={styles.input}
              value={formData.contactNo}
              onChangeText={(text) => updateField("contactNo", text)}
            />
          </View>

          {/* Email */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateField("email", text)}
            />
          </View>

          {/* Pet Type Select */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.petType}
              onValueChange={(itemValue) => updateField("petType", itemValue)}
              style={styles.picker}
              dropdownIconColor="#9CA3AF"
            >
              <Picker.Item label="Select Pet Type" value="" color="#9CA3AF" />
              <Picker.Item label="Cats" value="Cats" />
              <Picker.Item label="Dogs" value="Dogs" />
              <Picker.Item label="Small pets" value="Small pets" />
            </Picker>
          </View>

          {/* Breed Select */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.breed}
              onValueChange={(itemValue) => updateField("breed", itemValue)}
              style={styles.picker}
              dropdownIconColor="#9CA3AF"
            >
              <Picker.Item label="Breed" value="" color="#9CA3AF" />
              <Picker.Item label="Persian" value="Persian" />
              <Picker.Item label="Siamese" value="Siamese" />
              <Picker.Item label="Maine Coon" value="Maine Coon" />
            </Picker>
          </View>

          {/* Gender Select */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.gender}
              onValueChange={(itemValue) => updateField("gender", itemValue)}
              style={styles.picker}
              dropdownIconColor="#9CA3AF"
            >
              <Picker.Item label="Gender" value="" color="#9CA3AF" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
            </Picker>
          </View>

          {/* Are you a Pet Parent Select */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.isPetParent}
              onValueChange={(itemValue) => updateField("isPetParent", itemValue)}
              style={styles.picker}
              dropdownIconColor="#9CA3AF"
            >
              <Picker.Item label="Are you a Pet Parent?" value="" color="#9CA3AF" />
              <Picker.Item label="Yes" value="Yes" />
              <Picker.Item label="No" value="No" />
            </Picker>
          </View>

          {/* Plan to Purchase Select */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.planToPurchase}
              onValueChange={(itemValue) => updateField("planToPurchase", itemValue)}
              style={styles.picker}
              dropdownIconColor="#9CA3AF"
            >
              <Picker.Item label="Plan to Purchase" value="" color="#9CA3AF" />
              <Picker.Item label="Immediately" value="Immediately" />
              <Picker.Item label="Within a week" value="Within a week" />
              <Picker.Item label="Just Exploring" value="Just Exploring" />
            </Picker>
          </View>

          {/* Schedule a call */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Schedule a call"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={formData.scheduleCall}
              onChangeText={(text) => updateField("scheduleCall", text)}
            />
          </View>

          {/* Location */}
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Location (e.g. Lahore, Karachi)"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => updateField("location", text)}
            />
          </View>

          {/* Remark (Full Width) */}
          <View style={[styles.inputWrapper, styles.fullWidth]}>
            <TextInput
              placeholder="Remark..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              style={[styles.input, styles.textArea]}
              value={formData.remark}
              onChangeText={(text) => updateField("remark", text)}
            />
          </View>

          {/* Button (Full Width / Right Aligned) */}
          <View style={[styles.fullWidth, styles.buttonContainer]}>
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
              <Text style={styles.buttonText}>Let&apos;s Roll</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 32,
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 16,
    resizeMode: "cover",
  },
  formContainer: {
    width: "100%",
    maxWidth: 600,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 24,
  },
  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  inputWrapper: {
    width: "100%",
    marginBottom: 20,
  },
  fullWidth: {
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    fontSize: 14,
    color: "#1F2937",
    paddingVertical: 8,
  },
  pickerWrapper: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    marginBottom: 20,
  },
  picker: {
    height: 45,
    width: "100%",
    color: "#1F2937",
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  buttonContainer: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  button: {
    backgroundColor: "#8E5AF7",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    fontSize: 16,
  },
});