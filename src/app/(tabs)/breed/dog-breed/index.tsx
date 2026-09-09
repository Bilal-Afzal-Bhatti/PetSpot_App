import BreedListing from "@/components/breeds/DogBreed/BreedListing";
import DogBreedHeroSection from "@/components/breeds/DogBreed/DogBreedHeroSection";
import { ScrollView, StyleSheet } from 'react-native';

export default function DogsPage() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <DogBreedHeroSection />
      <BreedListing />
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