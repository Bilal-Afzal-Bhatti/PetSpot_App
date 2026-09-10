import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import CatsCareHeroSection from "@/components/Blogs/Cats-care/CatsCareHeroSection";
import CatsCareMainSection from "@/components/Blogs/Cats-care/CatsCareMainSection";
import PetsNavbar from "@/components/Blogs/Cats-care/PetsNavbar";
import GuaranteeBadges from "@/components/Blogs/LastSection";

export default function BlogIndexScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <CatsCareHeroSection />
      <PetsNavbar />
      <CatsCareMainSection />
      <GuaranteeBadges />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});












// import React from "react";
// import { View, StyleSheet } from "react-native";
// import HeroSection from "../../../components/Blogs/blogHeroSection";
// import BlogsNavbar from "../../../components/Blogs/BlogsNavbar";
// import BlogSection from "../../../components/Blogs/BlogSection";

// export default function BlogIndexScreen() {
//   return (
//     <View style={styles.container}>
//       <HeroSection />
//       <BlogsNavbar />
//       <BlogSection />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",
//   },
// });