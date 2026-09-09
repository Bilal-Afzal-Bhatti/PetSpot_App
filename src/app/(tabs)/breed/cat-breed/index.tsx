import CatBreedListing from '@/components/breeds/CatBreed/CatBreedListing';
import DogBreedHeroSection from '@/components/breeds/DogBreed/DogBreedHeroSection';
import { ScrollView, StyleSheet } from 'react-native';

export default function catBreed() {
  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <DogBreedHeroSection />
      <CatBreedListing />
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