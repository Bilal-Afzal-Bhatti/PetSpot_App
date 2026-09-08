// app/(tabs)/blog/cat-care/index.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import CatsCareHeroSection from "../../../../components/Blogs/Cats-care/CatsCareHeroSection";
import CatsCareMainSection from "../../../../components/Blogs/Cats-care/CatsCareMainSection";
import PetsNavbar from "../../../../components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "../../../../components/Blogs/LastSection";

export default function CatCareScreen() {
  return (
    <View style={styles.container}>
      <CatsCareHeroSection />
      <PetsNavbar />
      <CatsCareMainSection />
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