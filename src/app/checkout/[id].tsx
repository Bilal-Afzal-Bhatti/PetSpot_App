import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import HeaderMenu from "@/components/HeaderMenu";

// Relative Store Imports (Keep single clean imports)
import { useAuthStore } from "@/../Store/authStore";
import { useBuyStore } from "@/../Store/buyStore";

// Fallback storage setup
const memoryStorage: Record<string, string> = {};
const checkoutStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (typeof globalThis.localStorage !== "undefined") {
        return globalThis.localStorage.getItem(key);
      }
    } catch {
      // Fallback
    }
    return memoryStorage[key] ?? null;
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof globalThis.localStorage !== "undefined") {
        globalThis.localStorage.setItem(key, value);
        return;
      }
    } catch {
      // Fallback
    }
    memoryStorage[key] = value;
  },
};

export default function CheckoutScreen() {
  const router = useRouter();

  const {
    selectedPet,
    setSelectedPet,
    checkoutDetails,
    setCheckoutDetails,
    processCheckout,
    clearCheckout,
    loading,
    error,
  } = useBuyStore() as any;

  const authState = useAuthStore() as any;

  // Debugging user extraction across various common Zustand auth structures
  const activeUser = authState?.user || authState?.authUser || authState?.currentUser;
  const userEmail =
    activeUser?.email ||
    activeUser?.user?.email ||
    checkoutDetails?.email ||
    "";

  const [formError, setFormError] = useState("");
  const [isInitializing, setIsInitializing] = useState(true);

  // Debug log to inspect Auth Store data structure in your console
  useEffect(() => {
    console.log("--- DEBUG AUTH STORE ---");
    console.log("Raw Auth State:", authState);
    console.log("Resolved Active User:", activeUser);
    console.log("Resolved Email:", userEmail);
    console.log("------------------------");
  }, [authState, activeUser, userEmail]);

  useEffect(() => {
    const initCheckout = async () => {
      try {
        const storedPetId = await checkoutStorage.getItem("currentPetId");

        if (storedPetId) {
          const namespacedPet = await checkoutStorage.getItem(`selectedPetData_${storedPetId}`);

          if (namespacedPet) {
            try {
              const parsedPet = JSON.parse(namespacedPet);
              useBuyStore.setState({ selectedPet: parsedPet });
            } catch (e) {
              console.error("Failed to parse namespaced pet data", e);
            }
          } else {
            const storedPet = await checkoutStorage.getItem("selectedPetData");
            if (storedPet) {
              try {
                const parsedPet = JSON.parse(storedPet);
                useBuyStore.setState({ selectedPet: parsedPet });
              } catch (e) {
                console.error("Failed to parse stored pet data", e);
              }
            } else {
              await setSelectedPet(storedPetId);
            }
          }
        }
      } catch (err) {
        console.error("AsyncStorage error during init:", err);
      }

      setIsInitializing(false);
    };

    initCheckout();
  }, []);

  // Update checkoutDetails email automatically when user profile becomes available
  useEffect(() => {
    if (userEmail && checkoutDetails?.email !== userEmail) {
      setCheckoutDetails({ email: userEmail });
    }
  }, [userEmail]);
  const handleInputChange = (field: string, value: string) => {
    setCheckoutDetails({ [field]: value });
    if (formError) setFormError("");
  };

  const validateShippingFields = () => {
    if (
      !checkoutDetails.fullName ||
      !userEmail ||
      !checkoutDetails.phone ||
      !checkoutDetails.address ||
      !checkoutDetails.city
    ) {
      setFormError("Please fill out all required shipping and contact fields.");
      return null;
    }

    return userEmail;
  };

  const handleOnlinePayment = async () => {
    setFormError("");
    const currentEmail = validateShippingFields();
    if (!currentEmail) return;

    setCheckoutDetails({ paymentMethod: "ONLINE", email: currentEmail });

    try {
      const redirectUrl = await processCheckout("ONLINE");
      await checkoutStorage.setItem("lastOrderType", "ONLINE");

      if (redirectUrl) {
        const result = await WebBrowser.openBrowserAsync(redirectUrl);
        if (result.type === "dismiss") {
          Alert.alert("Checkout", "Payment session was closed.");
        }
      } else {
        throw new Error("Stripe redirect URL not received from server.");
      }
    } catch (err: any) {
      console.error("Online checkout error:", err);
      setFormError(err?.message || "Something went wrong starting your payment. Please try again.");
    }
  };

  const handleCodPayment = async () => {
    setFormError("");
    const currentEmail = validateShippingFields();
    if (!currentEmail) return;

    setCheckoutDetails({ paymentMethod: "COD", email: currentEmail });

    try {
      await processCheckout("COD");
      await checkoutStorage.setItem("lastOrderType", "COD");

      clearCheckout();
      Alert.alert("Success", "Your Cash on Delivery order has been placed!");
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.error("COD checkout error:", err);
      setFormError(err?.message || "Something went wrong placing your order. Please try again.");
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#EA580C" />
        <Text style={styles.loadingText}>Loading checkout...</Text>
      </View>
    );
  }

  if (!selectedPet) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyTitle}>No Pet Selected</Text>
          <Text style={styles.emptySub}>Please choose a pet from the marketplace first.</Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)/home")}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>Go to Marketplace</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const petImage =
    selectedPet?.images?.[0] ||
    selectedPet?.image ||
    selectedPet?.petImage ||
    "https://via.placeholder.com/200";

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderMenu />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
          <Text style={styles.backButtonText}>Back to Details</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Secure Checkout</Text>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Image source={{ uri: petImage }} style={styles.petImage} resizeMode="cover" />
            <View style={styles.petInfo}>
              <Text style={styles.petName}>
                {selectedPet.name || selectedPet.title || selectedPet.breed}
              </Text>
              <Text style={styles.petCategory}>
                {selectedPet.category || selectedPet.breed}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>PKR {selectedPet.price}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Shipping Inspection</Text>
            <Text style={styles.freeText}>FREE</Text>
          </View>

          <View style={[styles.priceRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>PKR {selectedPet.price}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>1. Shipping & Contact Information</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={checkoutDetails?.fullName || ""}
              onChangeText={(text) => handleInputChange("fullName", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>EMAIL ADDRESS (LINKED TO ACCOUNT)</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              editable={false}
              value={userEmail}
              placeholder="No email found"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>PHONE NUMBER</Text>
            <TextInput
              style={styles.input}
              placeholder="+92 300 1234567"
              keyboardType="phone-pad"
              value={checkoutDetails?.phone || ""}
              onChangeText={(text) => handleInputChange("phone", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CITY</Text>
            <TextInput
              style={styles.input}
              placeholder="Islamabad"
              value={checkoutDetails?.city || ""}
              onChangeText={(text) => handleInputChange("city", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>STREET ADDRESS</Text>
            <TextInput
              style={styles.input}
              placeholder="House #123, Street Name"
              value={checkoutDetails?.address || ""}
              onChangeText={(text) => handleInputChange("address", text)}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>POSTAL CODE</Text>
            <TextInput
              style={styles.input}
              placeholder="44000"
              keyboardType="numeric"
              value={checkoutDetails?.postalCode || ""}
              onChangeText={(text) => handleInputChange("postalCode", text)}
            />
          </View>

          {formError || error ? (
            <Text style={styles.errorText}>{formError || error}</Text>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionHeader}>2. Choose Payment & Complete Order</Text>

          <TouchableOpacity
            style={[styles.paymentBtn, styles.onlineBtn]}
            disabled={loading}
            onPress={handleOnlinePayment}
          >
            {loading && checkoutDetails?.paymentMethod === "ONLINE" ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <View style={styles.btnContent}>
                <Ionicons name="card" size={18} color="#FB923C" />
                <Text style={styles.onlineBtnText}>
                  Pay Online with Stripe (PKR {selectedPet.price})
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentBtn, styles.codBtn]}
            disabled={loading}
            onPress={handleCodPayment}
          >
            {loading && checkoutDetails?.paymentMethod === "COD" ? (
              <ActivityIndicator color="#000000" />
            ) : (
              <View style={styles.btnContent}>
                <FontAwesome5 name="money-bill-wave" size={16} color="#000000" />
                <Text style={styles.codBtnText}>
                  Confirm Cash on Delivery (PKR {selectedPet.price})
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.securityBadge}>
            <Ionicons name="shield-checkmark" size={16} color="#10B981" />
            <Text style={styles.securityText}>Secured with encryption & local storage.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#191C33",
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#191C33",
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: "#ffffff",
    fontWeight: "600",
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    width: "100%",
    maxWidth: 340,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 16,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  backButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  petImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  petInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111827",
  },
  petCategory: {
    fontSize: 13,
    color: "#6B7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#4B5563",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  freeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#16A34A",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#EA580C",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    color: "#4B5563",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FAFAFA",
  },
  disabledInput: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  paymentBtn: {
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  onlineBtn: {
    backgroundColor: "#111827",
  },
  onlineBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  codBtn: {
    backgroundColor: "#F59E0B",
  },
  codBtnText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 14,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  primaryButton: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 6,
  },
  securityText: {
    fontSize: 12,
    color: "#9CA3AF",
  },
});