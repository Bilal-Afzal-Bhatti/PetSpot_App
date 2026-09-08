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
import BlogSidebar from "../BlogSidebar";
import { BlogStore } from "../../../../Store/BlogStore";

const { width } = Dimensions.get("window");

export default function DogsCareMainSection() {
  const router = useRouter();
  const { blogsDogs, fetchBlogs, page, setPage, totalPages, loading, error } =
    BlogStore();
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Dog Care blogs from API using the exact database category key
  useEffect(() => {
    fetchBlogs("dog-care", page);
  }, [page]);

  // Reset slider index if blogs list changes or shrinks
  useEffect(() => {
    setIndex(0);
  }, [blogsDogs.length]);

  const nextSlide = () => {
    if (blogsDogs.length === 0) return;
    setIndex((prev) => (prev + 1) % blogsDogs.length);
  };

  const prevSlide = () => {
    if (blogsDogs.length === 0) return;
    setIndex((prev) => (prev - 1 + blogsDogs.length) % blogsDogs.length);
  };

  const goToBlog = (slug: string) => {
    router.push(`/blog/${slug}` as any);
  };

  // Get current slide blog dynamically from DB data
  const currentFeaturedBlog = blogsDogs[index];

  return (
    <ScrollView contentContainerStyle={styles.section}>
      {/* MAIN BLOG AREA */}
      <View style={styles.mainColumn}>
        {/* Featured blog slider using DB data */}
        {blogsDogs.length > 0 && currentFeaturedBlog && (
          <View style={styles.featuredWrapper}>
            <View style={styles.featuredImageBox}>
              {blogsDogs.length > 1 && (
                <TouchableOpacity
                  onPress={prevSlide}
                  style={[styles.arrowButton, styles.arrowLeft]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="arrow-back" size={18} color="#374151" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => goToBlog(currentFeaturedBlog.slug)}
                style={styles.featuredImageTouch}
              >
                <Image
                  source={{
                    uri:
                      currentFeaturedBlog.coverImage ||
                      currentFeaturedBlog.image ||
                      "https://images.unsplash.com/photo-1552053831-71594a27632d",
                  }}
                  style={styles.featuredImage}
                  resizeMode="cover"
                />
              </TouchableOpacity>

              {blogsDogs.length > 1 && (
                <TouchableOpacity
                  onPress={nextSlide}
                  style={[styles.arrowButton, styles.arrowRight]}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="arrow-forward" size={18} color="#374151" />
                </TouchableOpacity>
              )}

              {/* Overlay text from DB */}
              <View style={styles.overlay} pointerEvents="box-none">
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {(currentFeaturedBlog.category || "Dog Care").toUpperCase()}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => goToBlog(currentFeaturedBlog.slug)}
                >
                  <Text style={styles.overlayTitle} numberOfLines={2}>
                    {currentFeaturedBlog.title}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.overlayMeta}>
                  By {currentFeaturedBlog.author || "Admin"} |{" "}
                  {isMounted && currentFeaturedBlog.createdAt
                    ? new Date(
                        currentFeaturedBlog.createdAt
                      ).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "Recent"}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.dogCareBadge}>
          <Text style={styles.dogCareBadgeText}>Dog Care</Text>
        </View>

        {/* Loading */}
        {loading && (
          <ActivityIndicator
            size="small"
            color="#018F98"
            style={styles.loader}
          />
        )}

        {/* Error */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Blog Grid */}
        {!loading && !error && blogsDogs.length === 0 ? (
          <Text style={styles.emptyText}>No dog care blogs found.</Text>
        ) : (
          <View style={styles.grid}>
            {blogsDogs.map((blog: any) => (
              <TouchableOpacity
                key={blog._id}
                onPress={() => goToBlog(blog.slug)}
                activeOpacity={0.85}
                style={styles.card}
              >
                <Image
                  source={{
                    uri:
                      blog.coverImage ||
                      blog.image ||
                      "https://images.unsplash.com/photo-1552053831-71594a27632d",
                  }}
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
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <View style={styles.paginationRow}>
            <TouchableOpacity
              onPress={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={[
                styles.pageButton,
                page === 1 ? styles.pageButtonDisabled : styles.pageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  page === 1
                    ? styles.pageButtonTextDisabled
                    : styles.pageButtonTextActive,
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>

            <Text style={styles.pageIndicatorText}>
              Page {page} of {totalPages}
            </Text>

            <TouchableOpacity
              onPress={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              style={[
                styles.pageButton,
                page >= totalPages
                  ? styles.pageButtonDisabled
                  : styles.pageButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  page >= totalPages
                    ? styles.pageButtonTextDisabled
                    : styles.pageButtonTextActive,
                ]}
              >
                Next
              </Text>
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

const CARD_WIDTH = (width - 16 * 2 - 12 * 2) / 3;

const styles = StyleSheet.create({
  section: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  mainColumn: {
    width: "100%",
  },
  sidebarColumn: {
    width: "100%",
    marginTop: 24,
  },
  featuredWrapper: {
    marginBottom: 20,
  },
  featuredImageBox: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  featuredImageTouch: {
    width: "100%",
    height: "100%",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -18,
    zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 10,
    borderRadius: 6,
  },
  arrowLeft: { left: 8 },
  arrowRight: { right: 8 },
  overlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAB308",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 8,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  overlayMeta: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 4,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  dogCareBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#018F98",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 20,
  },
  dogCareBadgeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  loader: {
    marginVertical: 12,
  },
  errorText: {
    color: "#DC2626",
    paddingVertical: 8,
  },
  emptyText: {
    color: "#6B7280",
    paddingVertical: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
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
    height: 100,
  },
  cardBody: {
    padding: 8,
    flex: 1,
  },
  cardCategory: {
    fontSize: 10,
    fontWeight: "500",
    color: "#018F98",
    textTransform: "capitalize",
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 4,
  },
  cardExcerpt: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 4,
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 28,
  },
  pageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  pageButtonActive: {
    backgroundColor: "#E0F7F8",
  },
  pageButtonDisabled: {
    backgroundColor: "#F3F4F6",
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  pageButtonTextActive: {
    color: "#018F98",
  },
  pageButtonTextDisabled: {
    color: "#9CA3AF",
  },
  pageIndicatorText: {
    fontSize: 13,
    color: "#374151",
  },
});