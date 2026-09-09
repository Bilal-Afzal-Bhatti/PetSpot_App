import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
//import BreederBanner from "@/components/breeds/DogBreed/BreedInfoPage/BreederBanner";
import BreedInfoMainSection from "@/components/breeds/DogBreed/BreedInfoPage/BreedInfoMainSection";
import BreedInfoPageHeroSection from "@/components/breeds/DogBreed/BreedInfoPage/BreedInfoPageHeroSection";
//import BreedNavbar from "@//breeds/DogBreed/BreedInfoPage/BreedNavbar";
//import BreedWhyMMP from "@/Components/breeds/DogBreed/BreedInfoPage/BreedWhyMMP";

export default function BreedPage() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* <BreedNavbar /> */}
      <BreedInfoPageHeroSection />
      <BreedInfoMainSection />
      {/* <BreederBanner /> */}
      {/* <BreedWhyMMP /> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  contentContainer: {
    flexGrow: 1,
  },
});