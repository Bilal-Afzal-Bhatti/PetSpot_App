// app/(tabs)/blog/[slug]/index.tsx

import { View, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import CatsCareHeroSection from "../../../../components/Blogs/Cats-care/CatsCareHeroSection";
import PetsNavbar from "@/components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "../../../../components/Blogs/LastSection";
import SingleBlog from "../../../../components/Blogs/singleBlog";

export default function SingleBlogScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <View style={styles.container}>
      <CatsCareHeroSection />
      <PetsNavbar />
      <SingleBlog slug={slug} />
      <GuaranteeBadges />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});