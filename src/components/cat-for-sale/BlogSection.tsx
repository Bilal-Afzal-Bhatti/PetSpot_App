import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NewsBlog() {
  const blogs = [
    {
      id: 1,
      title: "For Dogs That Get Cold Feet At The G...",
      date: "October 5, 2024",
      desc: "Introducing pet and kids to each other, the pros of getting a pet, pet behavioural training, basic training, professional training.",
      // In React Native, local images can be required or handled via URIs. 
      // If using remote URLs or assets, adjust accordingly:
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1", 
      link: "https://example.com/blog-1",
    },
    {
      id: 2,
      title: "5 Accessories That Are a Must-Have f...",
      date: "February 27, 2024",
      desc: "Pet buying is an irreversible decision. Consider all the important things beforehand, especially when it comes to...",
      image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e",
      link: "https://example.com/blog-2",
    },
    {
      id: 3,
      title: "The Best Dog Crates for Every Pup, A...",
      date: "January 4, 2024",
      desc: "New to pet parenting? Explore the top 10 dog breeds for first-time owners in India...",
      image: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8",
      link: "https://example.com/blog-3",
    },
  ];

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.subtitle}>Our Blogs & Tips</Text>
        <Text style={styles.title}>News & Blog</Text>
      </View>

      {/* Blogs List */}
      <View style={styles.blogGrid}>
        {blogs.map((blog) => (
          <View key={blog.id} style={styles.card}>
            <View style={styles.imageContainer}>
              <Image source={{ uri: blog.image }} style={styles.image} resizeMode="cover" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.blogTitle} numberOfLines={2}>
                {blog.title}
              </Text>
              <Text style={styles.blogDate}>{blog.date}</Text>
              <Text style={styles.blogDesc} numberOfLines={3}>
                {blog.desc}
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(blog.link)}
                style={styles.readMoreContainer}
                activeOpacity={0.7}
              >
                <Text style={styles.linkText}>Read More</Text>
                <Ionicons name="chevron-forward" size={14} color="#8b5cf6" style={styles.linkIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* View All Blogs Link */}
      <View style={styles.viewAllContainer}>
        <TouchableOpacity
          onPress={() => Linking.openURL("https://example.com/blogs")}
          style={styles.readMoreContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>View All Blogs</Text>
          <Ionicons name="chevron-forward" size={14} color="#8b5cf6" style={styles.linkIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#ffffff",
    paddingVertical: 40,
    paddingHorizontal: 16,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#374151",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#111827",
  },
  blogGrid: {
    gap: 20,
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#f3f4f6",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 16,
  },
  imageContainer: {
    width: "100%",
    height: 200,
    backgroundColor: "#e5e7eb",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    padding: 16,
    flex: 1,
    justifyContent: "space-between",
  },
  blogTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: "#000000",
    lineHeight: 24,
    marginBottom: 6,
  },
  blogDate: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  blogDesc: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
    marginBottom: 16,
  },
  readMoreContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkText: {
    color: "#8b5cf6",
    fontSize: 14,
    fontWeight: "500",
  },
  linkIcon: {
    marginLeft: 4,
  },
  viewAllContainer: {
    alignItems: "flex-end",
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
    marginTop: 12,
    paddingHorizontal: 4,
  },
});