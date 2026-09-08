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

export default function CatsCareMainSection() {
  const router = useRouter();
  const { blogsCats, fetchBlogs, page, setPage, totalPages, loading, error } =
    BlogStore();
  const [index, setIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch Cats blogs from API on page change
  useEffect(() => {
    fetchBlogs("cat-care", page);
  }, [page]);

  const goToBlog = (slug: string) => {
    router.push(`/blog/${slug}` as any);
  };

  // Get the featured blog and remaining blogs dynamically from state
  const featuredBlog = blogsCats[index] || blogsCats[0];
  const gridBlogs = blogsCats;

  const nextSlide = () => {
    if (blogsCats.length === 0) return;
    setIndex((prev) => (prev + 1) % Math.min(blogsCats.length, 3));
  };

  const prevSlide = () => {
    if (blogsCats.length === 0) return;
    setIndex(
      (prev) =>
        (prev - 1 + Math.min(blogsCats.length, 3)) %
        Math.min(blogsCats.length, 3)
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.section}>
      {/* MAIN BLOG AREA */}
      <View style={styles.mainColumn}>
        {/* Featured blog slider */}
        {featuredBlog && (
          <TouchableOpacity
            style={styles.featuredWrapper}
            activeOpacity={0.9}
            onPress={() => goToBlog(featuredBlog.slug)}
          >
            <View style={styles.featuredImageBox}>
              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                style={[styles.arrowButton, styles.arrowLeft]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="arrow-back" size={18} color="#374151" />
              </TouchableOpacity>

              <Image
                source={{
                  uri:
                    featuredBlog.coverImage ||
                    featuredBlog.image ||
                    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
                }}
                style={styles.featuredImage}
                resizeMode="cover"
              />

              <TouchableOpacity
                onPress={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                style={[styles.arrowButton, styles.arrowRight]}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="arrow-forward" size={18} color="#374151" />
              </TouchableOpacity>

              {/* Overlay dynamic text */}
              <View style={styles.overlay} pointerEvents="box-none">
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>
                    {(featuredBlog.category || "Cat Care").toUpperCase()}
                  </Text>
                </View>
                <Text style={styles.overlayTitle} numberOfLines={2}>
                  {featuredBlog.title}
                </Text>
                <Text style={styles.overlayMeta}>
                  {featuredBlog.author ? `By ${featuredBlog.author} | ` : ""}
                  {isMounted && featuredBlog.createdAt
                    ? new Date(featuredBlog.createdAt).toLocaleDateString(
                        "en-US",
                        { month: "long", year: "numeric" }
                      )
                    : "Recent"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.catCareBadge}>
          <Text style={styles.catCareBadgeText}>Cat Care</Text>
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
        {!loading && !error && blogsCats.length === 0 ? (
          <Text style={styles.emptyText}>No cat care blogs found.</Text>
        ) : (
          <View style={styles.grid}>
            {gridBlogs.map((blog: any) => (
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
                      "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
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

const CARD_WIDTH = (width - 16 * 2 - 12 * 2) / 3; // 3-column grid with padding + gaps

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
  catCareBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#018F98",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 20,
  },
  catCareBadgeText: {
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