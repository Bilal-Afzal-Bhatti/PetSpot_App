import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function BreedInfoNotFound() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [dog, setDog] = useState("");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("");
  const [petParent, setPetParent] = useState("");
  const [planToPurchase, setPlanToPurchase] = useState("");
  const [scheduleCall, setScheduleCall] = useState("");
  const [location, setLocation] = useState("");
  const [remark, setRemark] = useState("");

  const handleSubmit = () => {
    // 🔁 wire this up to your actual submit/API logic
    console.log({
      name,
      contact,
      email,
      dog,
      breed,
      gender,
      petParent,
      planToPurchase,
      scheduleCall,
      location,
      remark,
    });
  };

  return (
    <View style={styles.container}>
      {/* Top Image */}
      <View style={styles.imageWrap}>
        <Image
          source={require("@/assets/Breed/listing-form.webp")} // 🔁 adjust path to your assets
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Form */}
      <View style={styles.formSection}>
        <Text style={styles.heading}>
          Hey! Still not found what you are looking for?
        </Text>
        <Text style={styles.subtext}>
          No worries!! Let our pet experts come to your rescue. Fill in your
          details and we will give you a call. Our MMP experts have
          successfully helped in completing 4000+ families by finding and
          connecting them to their lovable furbabies across India.
        </Text>

        <View style={styles.form}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Your Name"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            value={contact}
            onChangeText={setContact}
            placeholder="Contact No"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
            style={styles.input}
          />

          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <View style={styles.pickerWrap}>
            <Picker selectedValue={dog} onValueChange={setDog} style={styles.picker}>
              <Picker.Item label="Dogs" value="" color="#9CA3AF" />
            </Picker>
          </View>

          <View style={styles.pickerWrap}>
            <Picker selectedValue={breed} onValueChange={setBreed} style={styles.picker}>
              <Picker.Item label="Breed" value="" color="#9CA3AF" />
            </Picker>
          </View>

          <View style={styles.pickerWrap}>
            <Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}>
              <Picker.Item label="Gender" value="" color="#9CA3AF" />
            </Picker>
          </View>

          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={petParent}
              onValueChange={setPetParent}
              style={styles.picker}
            >
              <Picker.Item label="Are you a Pet Parent?" value="" color="#9CA3AF" />
            </Picker>
          </View>

          <View style={styles.pickerWrap}>
            <Picker
              selectedValue={planToPurchase}
              onValueChange={setPlanToPurchase}
              style={styles.picker}
            >
              <Picker.Item label="Plan to Purchase" value="" color="#9CA3AF" />
            </Picker>
          </View>

          <TextInput
            value={scheduleCall}
            onChangeText={setScheduleCall}
            placeholder="Schedule a call"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            placeholderTextColor="#9CA3AF"
            style={styles.input}
          />

          <TextInput
            value={remark}
            onChangeText={setRemark}
            placeholder="Remark..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            style={[styles.input, styles.textarea]}
          />

          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>Let's Roll</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 24,
  },
  imageWrap: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 16,
  },
  formSection: {
    width: "100%",
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 19,
    fontWeight: "500",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 21,
    marginBottom: 24,
  },
  form: {
    gap: 18,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
    fontSize: 14,
    paddingVertical: 8,
    color: "#111827",
  },
  textarea: {
    textAlignVertical: "top",
    minHeight: 70,
  },
  pickerWrap: {
    borderBottomWidth: 1,
    borderBottomColor: "#D1D5DB",
  },
  picker: {
    color: "#6B7280",
  },
  submitBtn: {
    backgroundColor: "#8E5AF7",
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignItems: "center",
    alignSelf: "flex-end",
    marginTop: 8,
  },
  submitBtnText: {
    color: "#fff",
    fontWeight: "500",
    fontSize: 15,
  },
});