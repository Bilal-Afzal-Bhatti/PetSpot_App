import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import Feather from "react-native-vector-icons/Feather";

export default function NewsBlog() {
  const blogs = [
    {
      id: 1,
      title: "For Dogs That Get Cold Feet At The G...",
      date: "October 5, 2024",
      desc: "Introducing pet and kids to each other, the pros of getting a pet, pet behavioural training, basic training, professional training.",
      image: require("../../../assets/Blog/DogImage.jpg"),
    },
    {
      id: 2,
      title: "5 Accessories That Are a Must-Have f...",
      date: "February 27, 2024",
      desc: "Pet buying is an irreversible decision. Consider all the important things beforehand, especially when it comes to...",
      image: require("../../../assets/Blog/DogImage2.jpg"),
    },
    {
      id: 3,
      title: "The Best Dog Crates for Every Pup, A...",
      date: "January 4, 2024",
      desc: "New to pet parenting? Explore the top 10 dog breeds for first-time owners...",
      image: require("../../../assets/Blog/DogImage3.jpg"),
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.section}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.subtitle}>Our Blogs & Tips</Text>
        <Text style={styles.title}>News & Blog</Text>
      </View>

      {/* Blog Cards List */}
      <View style={styles.cardsContainer}>
        {blogs.map((blog) => (
          <View key={blog.id} style={styles.card}>
            <Image source={blog.image} style={styles.cardImage} />
            
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {blog.title}
              </Text>
              <Text style={styles.dateText}>{blog.date}</Text>
              <Text style={styles.descText} numberOfLines={3}>
                {blog.desc}
              </Text>

              {/* Read More Link */}
              <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
                <Text style={styles.linkText}>Read More</Text>
                <Feather name="chevron-right" size={16} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* View All Blogs Link */}
      <View style={styles.viewAllContainer}>
        <TouchableOpacity style={styles.linkRow} activeOpacity={0.7}>
          <Text style={styles.linkText}>View All Blogs</Text>
          <Feather name="chevron-right" size={16} color="#8B5CF6" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 32,
    paddingHorizontal: 20,
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
    fontSize: 26,
    fontWeight: "600",
    color: "#000000",
  },
  cardsContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    gap: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    overflow: "hidden",
    padding: 16,
    // Cross-platform shadows
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 180,
    borderRadius: 6,
    resizeMode: "cover",
    marginBottom: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    lineHeight: 22,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  descText: {
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 16,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  linkText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#8B5CF6",
  },
  viewAllContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    alignItems: "flex-end",
    marginTop: 20,
    paddingRight: 4,
  },
});