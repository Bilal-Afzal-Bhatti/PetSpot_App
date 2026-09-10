import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import CatsCareHeroSection from "@/components/Blogs/Cats-care/CatsCareHeroSection";
import CatsCareMainSection from "@/components/Blogs/Cats-care/CatsCareMainSection";
import PetsNavbar from "@/components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "@/components/Blogs/LastSection";

export default function BlogIndexScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <CatsCareHeroSection />
      <PetsNavbar />
      <CatsCareMainSection />
      <GuaranteeBadges />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});


