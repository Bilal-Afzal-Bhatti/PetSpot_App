import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import HeaderMenu from "@/components/HeaderMenu";
import HeroSection from "@/components/dogs-for-sale/HeroSection";
import DogsScreen from "@/components/dogs-for-sale/dogsListingPage";
import AvailablePets from "@/components/dogs-for-sale/AvailablePetsNearMe";
import WinningFormula from "@/components/dogs-for-sale/WinningFormula";
import PopularDogSearches from "@/components/dogs-for-sale/PopularDogSearches";
import BlogSection from "@/components/dogs-for-sale/BlogSection";

export default function DogsForSalePage() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled
    >
      <HeaderMenu />
      <HeroSection />
      <DogsScreen scrollEnabled={false} />
      <AvailablePets />
      <WinningFormula />
      <PopularDogSearches />
      <BlogSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
});