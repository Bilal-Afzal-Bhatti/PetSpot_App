import React from "react";
import { ScrollView, StyleSheet } from "react-native";

// Import your custom components (adjust paths based on your folder structure)
import HeroSection from "@/components/dogs-for-sale/HeroSection";
//import DogsCatchAllPage from "@/components/ForSale/DogsCatchAllPage";
import NotFoundPets from "@/components/cat-for-sale/NotFoundPets";
import BlogSection from "@/components/dogs-for-sale/BlogSection";

// Note: In React Native, <Navbar /> and <Footer /> are usually handled 
// globally inside layouts/navigators instead of rendering inline like this.

export default function DogSegmentsPage() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* <Navbar /> */}

      <HeroSection />
      {/* <DogsCatchAllPage /> */}
      <NotFoundPets />
      <BlogSection />
      
      {/* <Footer /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff", // Adjust to match your app background theme
  },
  contentContainer: {
    paddingBottom: 24, // Adds spacing at the very bottom of the scroll list
  },
});