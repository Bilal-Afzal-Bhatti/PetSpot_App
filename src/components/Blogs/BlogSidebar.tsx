import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BlogStore } from "../../../Store/BlogStore";

const adImage = require("../../../assets/Blog/walking_ad.jpg");

interface BlogSidebarProps {
  category?: string;
}

export default function BlogSidebar({ category = "" }: BlogSidebarProps) {
  const router = useRouter();
  const { sidebarBlogs, fetchSidebarBlogs, loading, error } = BlogStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch sidebar blogs from store when category changes
  useEffect(() => {
    fetchSidebarBlogs(category);
  }, [category, fetchSidebarBlogs]);

  const categories = [
    { name: "Dog Care", slug: "dog-care", count: 285 },
    { name: "Cat Care", slug: "cat-care", count: 46 },
  ];

  return (
    <View style={styles.aside}>
      {/* Categories */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Categories</Text>
        <View style={styles.categoryList}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.name}
              onPress={() => router.push(`/blog/${cat.slug}` as any)}
              style={styles.categoryRow}
              activeOpacity={0.7}
            >
              <Text style={styles.categoryName}>{cat.name}</Text>
              <Text style={styles.categoryCount}>({cat.count})</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ads */}
      <View style={styles.adWrapper}>
        <Image source={adImage} style={styles.adImage} resizeMode="cover" />
      </View>

      {/* Other Blogs */}
      <View style={styles.block}>
        <Text style={styles.blockTitle}>Other Blogs</Text>

        {loading && (
          <ActivityIndicator size="small" color="#D86B35" style={styles.loader} />
        )}
        {error && <Text style={styles.errorText}>{error}</Text>}
        {!loading && sidebarBlogs.length === 0 && (
          <Text style={styles.emptyText}>No other blogs found.</Text>
        )}

        <View style={styles.blogList}>
          {sidebarBlogs.map((blog: any) => (
            <TouchableOpacity
              key={blog._id}
              onPress={() => router.push(`/blog/${blog.slug}` as any)}
              style={styles.blogRow}
              activeOpacity={0.7}
            >
              <Image
                source={{
                  uri:
                    blog.coverImage ||
                    blog.image ||
                    "https://images.unsplash.com/photo-1574158622682-e40e69881006",
                }}
                style={styles.blogThumb}
                resizeMode="cover"
              />
              <View style={styles.blogInfo}>
                <Text style={styles.blogTitle} numberOfLines={2}>
                  {blog.title}
                </Text>
                <View style={styles.dateRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color="#6B7280"
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.dateText}>
                    {isMounted && blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString()
                      : "Recent"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  aside: {
    width: "100%",
    paddingHorizontal: 16,
  },
  block: {
    marginBottom: 32,
  },
  blockTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  categoryList: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 4,
  },
  categoryName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },
  categoryCount: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "400",
  },
  adWrapper: {
    width: "100%",
    height: 200,
    marginBottom: 24,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#F3F4F6",
  },
  adImage: {
    width: "100%",
    height: "100%",
  },
  loader: {
    marginVertical: 8,
  },
  errorText: {
    fontSize: 13,
    color: "#DC2626",
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
  },
  blogList: {
    gap: 16,
  },
  blogRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
  },
  blogThumb: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
  },
  blogInfo: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1F2937",
    lineHeight: 18,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  dateText: {
    fontSize: 11,
    color: "#6B7280",
  },
});