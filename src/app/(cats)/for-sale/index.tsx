import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import HeaderMenu from "@/components/HeaderMenu"; // Adjust path if your header component is located elsewhere
import AvailablePets from "@/components/cat-for-sale/AvailablePetsNearMe";
import PetListingPage from "@/components/cat-for-sale/catsListingPage";
import PopularCatSearches from "@/components/cat-for-sale/PopularCatSearches";

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
      <HeaderMenu />
      {/* <Navbar /> */}
      <HeroSection />
      <PetListingPage />
      {/* <NotFoundPets /> */}
   
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