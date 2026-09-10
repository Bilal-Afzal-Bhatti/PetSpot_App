import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import AvailablePets from "@/components/dogs-for-sale/AvailablePetsNearMe";
import PetListingPage from "@/components/dogs-for-sale/dogsListingPage";
import PopularCatSearches from "@/components/dogs-for-sale/PopularDogSearches";
import ThingsToConsider from "@/components/dogs-for-sale/ThingsToConsider";
import WinningFormula from "@/components/dogs-for-sale/WinningFormula";
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