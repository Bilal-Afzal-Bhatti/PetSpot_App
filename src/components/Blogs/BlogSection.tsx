

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import BlogSidebar from "./BlogSidebar";
import {  BlogStore} from "../../../Store/BlogStore";

const { width } = Dimensions.get("window");

const bannerImage = require("../../../assets/Blog/blogadd.jpg");


  const sliderImages = [
    "/customers/dog1.webp",
    "/customers/dog2.webp",
    "/customers/dog4.webp",
  ];
export default function BlogSection() {
  const router = useRouter();
  const { blogsAll, loading, error, page, totalPages, fetchBlogs, setPage } =
    BlogStore();

  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % sliderImages.length);
  const prevSlide = () =>
    setIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);

  // Fetch blogs from Zustand
  useEffect(() => {
    fetchBlogs("", page); // "" = all blogs
  }, [page]);

  const goToBlog = (slug: string) => {
    router.push(`/blog/${slug}` as any);
  };

  return (
    <ScrollView contentContainerStyle={styles.section}>
      {/* LEFT / MAIN COLUMN */}
      <View style={styles.mainColumn}>
        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <TouchableOpacity
            onPress={prevSlide}
            style={[styles.arrowButton, styles.arrowLeft]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-back" size={18} color="#1F2937" />
          </TouchableOpacity>

          <Image
            source={{ uri: sliderImages[index] }}
            style={styles.sliderImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={nextSlide}
            style={[styles.arrowButton, styles.arrowRight]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="arrow-forward" size={18} color="#1F2937" />
          </TouchableOpacity>
        </View>

        <Image source={bannerImage} style={styles.banner} resizeMode="cover" />

        {/* Loading */}
        {loading && (
          <ActivityIndicator size="small" color="#D86B35" style={styles.loader} />
        )}

        {/* Error */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* All Blogs */}
        <View style={styles.grid}>
          {blogsAll.map((blog: any) => (
            <TouchableOpacity
              key={blog._id}
              onPress={() => goToBlog(blog.slug)}
              activeOpacity={0.85}
              style={styles.card}
            >
              <Image
                source={{ uri: blog.image }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardBody}>
                <Text style={styles.cardCategory}>{blog.category}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {blog.title}
                </Text>
                <Text style={styles.cardExcerpt} numberOfLines={2}>
                  {blog.excerpt}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationRow}>
            <TouchableOpacity
              disabled={page === 1}
              onPress={() => setPage(page - 1)}
              style={[styles.pageButton, page === 1 && styles.pageButtonDisabled]}
            >
              <Text style={styles.pageButtonText}>Prev</Text>
            </TouchableOpacity>

            <View style={styles.pageIndicator}>
              <Text style={styles.pageIndicatorText}>
                Page {page} / {totalPages}
              </Text>
            </View>

            <TouchableOpacity
              disabled={page === totalPages}
              onPress={() => setPage(page + 1)}
              style={[
                styles.pageButton,
                page === totalPages && styles.pageButtonDisabled,
              ]}
            >
              <Text style={styles.pageButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SIDEBAR */}
      <View style={styles.sidebarColumn}>
        <BlogSidebar />
      </View>
    </ScrollView>
  );
}

const CARD_WIDTH = (width - 16 * 2 - 12) / 2; // 2-column grid with padding + gap

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    flexDirection: "column",
    gap: 24,
  },
  mainColumn: {
    width: "100%",
  },
  sidebarColumn: {
    width: "100%",
    marginTop: 24,
  },
  sliderWrapper: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#E5E7EB",
  },
  sliderImage: {
    width: "100%",
    height: "100%",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -18,
    zIndex: 10,
    backgroundColor: "#E5E7EB",
    padding: 10,
    borderRadius: 6,
  },
  arrowLeft: { left: 8 },
  arrowRight: { right: 8 },
  banner: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    marginBottom: 20,
  },
  loader: {
    marginVertical: 12,
  },
  errorText: {
    color: "#DC2626",
    marginVertical: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 16,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImage: {
    width: "100%",
    height: 120,
  },
  cardBody: {
    padding: 10,
  },
  cardCategory: {
    fontSize: 11,
    fontWeight: "600",
    color: "#018F98",
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 2,
  },
  cardExcerpt: {
    fontSize: 11,
    color: "#6B7280",
    marginTop: 4,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginTop: 28,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 6,
  },
  pageButtonDisabled: {
    opacity: 0.5,
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1F2937",
  },
  pageIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 6,
  },
  pageIndicatorText: {
    fontSize: 13,
    color: "#374151",
  },
});