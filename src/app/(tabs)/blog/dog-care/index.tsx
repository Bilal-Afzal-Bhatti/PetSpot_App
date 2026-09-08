// app/(tabs)/blog/dog-care/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import PetsNavbar from "../../../../components/Blogs/Cats-care/PetsNavbar";
import DogsCareMainSection from "../../../../components/Blogs/Dogs-care/DogsCareMainSection";
import DogsCareHeroSection from "../../../../components/Blogs/Dogs-care/DogsCareHeroSection";
import GuaranteeBadges from "../../../../components/Blogs/LastSection";

export default function DogCareScreen() {
  return (
    <View style={styles.container}>
      <DogsCareHeroSection />
      <PetsNavbar />
      <DogsCareMainSection />
      <GuaranteeBadges />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});