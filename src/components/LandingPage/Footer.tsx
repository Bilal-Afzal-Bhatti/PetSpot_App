import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons, FontAwesome, FontAwesome5 } from "@expo/vector-icons";

export default function Footer() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const links = [
    { name: "About us", href: "/about-us" },
    { name: "Contact us", href: "/contact-us" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Term of Use", href: "/term-of-use" },
    { name: "Refund Policy", href: "/return-and-refund-policy" },
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Grievance Policy", href: "/grievance-redressal-policy" },
  ];

  const services = [
    "Dog Hostel",
    "Dog Training",
    "Dog Walking",
    "Grooming",
    "Veterinary",
    "Pet Mating",
    "Blog",
  ];

  const handleSubscribe = () => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter a valid email address.");
      return;
    }
    Alert.alert("Subscribed!", "Thank you for subscribing to our newsletter.");
    setEmail("");
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.content}>
        {/* Company Info Section */}
        <View style={styles.section}>
          <Image
            source={require("@/../assets/app_images/petLogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.description}>
            A house is not home without paw prints. We are one-stop destination
            for all your pet care needs.
          </Text>

          <View style={styles.contactDetails}>
            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL("tel:+92333333333")}
            >
              <FontAwesome5 name="phone-alt" size={14} color="#D1D5DB" />
              <Text style={styles.contactText}>+92-333333333</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactRow}
              onPress={() => Linking.openURL("mailto:hello@petscorner.com")}
            >
              <Ionicons name="mail" size={16} color="#D1D5DB" />
              <Text style={styles.contactText}>hello@petscorner.com</Text>
            </TouchableOpacity>

            <View style={styles.contactRow}>
              <Ionicons
                name="location-sharp"
                size={16}
                color="#D1D5DB"
                style={{ marginTop: 2 }}
              />
              <Text style={[styles.contactText, { flex: 1 }]}>
                123, Pet Street, Animal City, Country - 123456
              </Text>
            </View>
          </View>
        </View>

        {/* Our Company Links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Company</Text>
          {links.map((item) => (
            <TouchableOpacity
              key={item.name}
              style={styles.linkItem}
              onPress={() => router.push(item.href as any)}
            >
              <Text style={styles.linkText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Our Services */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          {services.map((service) => (
            <View key={service} style={styles.linkItem}>
              <Text style={styles.linkText}>{service}</Text>
            </View>
          ))}
        </View>

        {/* Newsletter & Socials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Newsletter</Text>
          <Text style={styles.description}>
            Subscribe to our newsletter & get all the latest news
          </Text>

          <View style={styles.newsletterForm}>
            <TextInput
              style={styles.input}
              placeholder="Enter Email ID"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubscribe}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>Go</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="facebook" size={18} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome5 name="times" size={18} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="whatsapp" size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIcon}>
              <FontAwesome name="instagram" size={18} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Copyright */}
        <View style={styles.copyrightContainer}>
          <Text style={styles.copyrightText}>
            © 2018-2026 Wanderlust Pet Services Private Limited. All Rights
            Reserved.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#1F2937",
    borderTopWidth: 1,
    borderTopColor: "rgba(229, 231, 235, 0.2)",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 20,
    width: "100%",
  },
  content: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  section: {
    marginBottom: 28,
  },
  logo: {
    height: 40,
    width: 140,
    marginBottom: 12,
  },
  description: {
    color: "#E5E7EB",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  contactDetails: {
    gap: 10,
    marginTop: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  contactText: {
    color: "#E5E7EB",
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFAC0D",
    marginBottom: 12,
  },
  linkItem: {
    paddingVertical: 4,
  },
  linkText: {
    color: "#FFFFFF",
    fontSize: 13,
  },
  newsletterForm: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    color: "#111827",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
    fontSize: 13,
    height: 40,
  },
  submitButton: {
    backgroundColor: "#55C5D0",
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
    height: 40,
  },
  submitButtonText: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 13,
  },
  socialRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#55C5D0",
    justifyContent: "center",
    alignItems: "center",
  },
  copyrightContainer: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
    paddingTop: 16,
    marginTop: 12,
    alignItems: "center",
  },
  copyrightText: {
    color: "#E5E7EB",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
  },
});