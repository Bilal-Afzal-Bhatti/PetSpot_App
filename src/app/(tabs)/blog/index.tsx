import React from "react";
import { View, StyleSheet } from "react-native";
import HeroSection from "../../../components/Blogs/blogHeroSection";
import BlogsNavbar from "../../../components/Blogs/BlogsNavbar";
import BlogSection from "../../../components/Blogs/BlogSection";

export default function BlogIndexScreen() {
  return (
    <View style={styles.container}>
      <HeroSection />
      <BlogsNavbar />
      <BlogSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});