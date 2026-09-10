import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import AvailablePets from "@/components/cat-for-sale/AvailablePetsNearMe";
import PetListingPage from "@/components/cat-for-sale/catsListingPage";
import PopularCatSearches from "@/components/cat-for-sale/PopularCatSearches";
import ThingsToConsider from "@/components/cat-for-sale/ThingsToConsider";
import WinningFormula from "@/components/cat-for-sale/WinningFormula";
import BlogSection from "@/components/dogs-for-sale/BlogSection";
import HeroSection from "@/components/dogs-for-sale/HeroSection";

export default function DogsForSalePage() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* <Navbar /> */}
      <HeroSection />
      <PetListingPage />
      {/* <NotFoundPets /> */}
      <ThingsToConsider />
      <AvailablePets />
      <WinningFormula />
      {/* <AreYouResponsible /> */}
      <PopularCatSearches />
      {/* <Feedback /> */}
      {/* <FAQSection /> */}
      <BlogSection />
      {/* <Footer /> */}
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