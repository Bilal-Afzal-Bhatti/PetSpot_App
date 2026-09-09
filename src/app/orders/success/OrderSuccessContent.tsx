import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useBuyStore } from "@/../Store/buyStore";
import { api } from "@/../lib/axios";

export default function OrderSuccessContent() {
  const router = useRouter();
  const searchParams = useLocalSearchParams();

  const type = searchParams.type as string | undefined;
  const sessionId = searchParams.session_id as string | undefined;

  const clearCheckout = useBuyStore((state: any) => state.clearCheckout);

  const [verifying, setVerifying] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const verifyOnlinePayment = async () => {
      // 1. Handle Cash on Delivery — already confirmed server-side at checkout
      if (type === "cod") {
        clearCheckout();
        return;
      }

      // 2. Handle Online Payment via Stripe Session ID
      if (sessionId) {
        setVerifying(true);
        try {
          const response = await api.get(
            `/api/orders/verify-payment?session_id=${sessionId}`
          );

          if (isMounted) {
            if (response.data?.success) {
              setVerificationStatus(
                response.data.message || "Payment verified & status updated to PAID!"
              );
              setIsSuccess(true);
            } else {
              setVerificationStatus("Verification pending or failed. Please contact support.");
              setIsSuccess(false);
            }
          }
        } catch (err: any) {
          console.error("Payment verification call failed:", err);
          if (isMounted) {
            const apiMessage = err.response?.data?.message;
            if (apiMessage?.includes("already verified")) {
              setVerificationStatus("Payment already verified!");
              setIsSuccess(true);
            } else {
              setVerificationStatus(apiMessage || "Failed to verify payment with server.");
              setIsSuccess(false);
            }
          }
        } finally {
          if (isMounted) {
            setVerifying(false);
            clearCheckout();
          }
        }
      } else {
        // Fallback if accessed without query params
        clearCheckout();
      }
    };

    verifyOnlinePayment();

    return () => {
      isMounted = false;
    };
  }, [sessionId, type]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View
            style={[
              styles.iconContainer,
              !isSuccess && !verifying && styles.errorIconContainer,
            ]}
          >
            {verifying ? (
              <ActivityIndicator size="large" color="#16A34A" />
            ) : (
              <Ionicons
                name={isSuccess ? "checkmark-circle" : "alert-circle"}
                size={64}
                color={isSuccess ? "#16A34A" : "#EF4444"}
              />
            )}
          </View>

          <Text style={styles.title}>
            {verifying
              ? "Verifying Payment..."
              : isSuccess
              ? "Order Placed Successfully!"
              : "Verification Issue"}
          </Text>

          <Text style={styles.description}>
            {type === "cod"
              ? "Your Cash on Delivery order has been placed. Our team will contact you shortly."
              : verificationStatus ||
                "Thank you! Your payment was processed successfully through Stripe."}
          </Text>

          <TouchableOpacity
            style={[styles.homeButton, verifying && styles.disabledButton]}
            disabled={verifying}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Ionicons name="home-outline" size={18} color="#ffffff" />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    width: "100%",
    maxWidth: 360,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  iconContainer: {
    marginBottom: 16,
  },
  errorIconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 20,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#111827",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  homeButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 15,
  },
});