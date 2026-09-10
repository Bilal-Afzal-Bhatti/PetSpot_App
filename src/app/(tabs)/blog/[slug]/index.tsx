// app/(tabs)/blog/[slug]/index.tsx

import React from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import CatsCareHeroSection from "../../../../components/Blogs/Cats-care/CatsCareHeroSection";
import PetsNavbar from "@/components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "../../../../components/Blogs/LastSection";
import SingleBlog from "../../../../components/Blogs/singleBlog";

export default function SingleBlogScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <CatsCareHeroSection />
      <PetsNavbar />
      <SingleBlog slug={slug} />
      <GuaranteeBadges />
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
    paddingBottom: 40, // Ensures space at the bottom for scrolling past badges
  },
});