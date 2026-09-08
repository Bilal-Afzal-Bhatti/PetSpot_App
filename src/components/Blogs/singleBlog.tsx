import React, { useEffect, useState } from "react";
import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import RenderHtml from "react-native-render-html";
import { useWindowDimensions } from "react-native";
import BlogSidebar from "./BlogSidebar";
import { BlogStore } from "../../../Store/BlogStore";

interface BlogDetailProps {
  slug: string;
}

export default function SingleBlog({ slug }: BlogDetailProps) {
  const { singleBlog, fetchSingleBlog, loading, error } = BlogStore();
  const [isMounted, setIsMounted] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch single blog by slug
  useEffect(() => {
    if (slug) {
      fetchSingleBlog(slug);
    }
  }, [slug, fetchSingleBlog]);

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="small" color="#018F98" />
        <Text style={styles.centerText}>Loading blog...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!singleBlog) {
    return (
      <View style={styles.centerBox}>
        <Text style={styles.centerText}>No blog found.</Text>
      </View>
    );
  }

  const authorName =
    typeof singleBlog.author === "object"
      ? singleBlog.author?.name
      : singleBlog.author || "Admin";

  return (
    <View style={styles.section}>
      {/* MAIN: Blog Content */}
      <View style={styles.mainColumn}>
        {/* Featured Image */}
        <Image
          source={{
            uri:
              singleBlog.coverImage ||
              singleBlog.image ||
              "https://images.unsplash.com/photo-1574158622682-e40e69881006",
          }}
          style={styles.featuredImage}
          resizeMode="cover"
        />

        {/* Blog Details & Content */}
        <View style={styles.card}>
          <Text style={styles.category}>
            {(singleBlog.category || "General").toUpperCase()}
          </Text>
          <Text style={styles.title}>{singleBlog.title}</Text>
          <Text style={styles.meta}>
            By {authorName} |{" "}
            {isMounted && singleBlog.createdAt
              ? new Date(singleBlog.createdAt).toDateString()
              : "Recent"}
          </Text>

          {/* Rich HTML content */}
          <View style={styles.contentWrapper}>
            <RenderHtml
              contentWidth={width - 64}
              source={{ html: singleBlog.content || "" }}
              baseStyle={styles.htmlBase}
            />
          </View>
        </View>
      </View>

      {/* SIDEBAR */}
      <View style={styles.sidebarColumn}>
        <BlogSidebar />
      </View>
    </View>
  );
}

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
  featuredImage: {
    width: "100%",
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: "#F3F4F6",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: "600",
    color: "#018F98",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginTop: 8,
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 6,
  },
  contentWrapper: {
    marginTop: 20,
  },
  htmlBase: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
  centerBox: {
    paddingVertical: 40,
    alignItems: "center",
  },
  centerText: {
    color: "#6B7280",
    marginTop: 8,
  },
  errorText: {
    color: "#DC2626",
  },
});