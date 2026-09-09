import CatBreedInfoHeroSection from "@/components/breeds/CatBreed/CatBreedInfoPage/CatBreedInfoHeroSection";
import BreederBanner from "@/components/breeds/DogBreed/BreedInfoPage/BreederBanner";
import BreedInfoMainSection from "@/components/breeds/DogBreed/BreedInfoPage/BreedInfoMainSection";
import BreedNavbar from "@/components/breeds/DogBreed/BreedInfoPage/BreedNavbar";
import BreedWhyMMP from "@/components/breeds/DogBreed/BreedInfoPage/BreedWhyMMP";
import { useRef } from 'react';
import { Animated, ScrollView, StyleSheet } from 'react-native';

export default function BreedPage() {
  const scrollY = useRef(new Animated.Value(0)).current;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <BreedNavbar scrollY={scrollY} />
      <CatBreedInfoHeroSection />
      <BreedInfoMainSection />
      <BreederBanner />
      <BreedWhyMMP />
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