import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { api } from "../lib/axios"; // Centralized API instance

// React Native compatible UUID generator fallback
const getRandomUUID = () => {
  if (typeof Crypto !== "undefined" && Crypto.randomUUID) {
    return Crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: "ONLINE" | "COD";
}

interface BuyState {
  selectedPet: any | null;
  idempotencyKey: string | null;
  checkoutDetails: CheckoutDetails;
  loading: boolean;
  error: string | null;

  setSelectedPet: (pet: any, userEmail?: string) => void;
  setCheckoutDetails: (details: Partial<CheckoutDetails>) => void;
  clearCheckout: () => void;
  generateIdempotencyKey: () => string;
  processCheckout: (method?: "ONLINE" | "COD") => Promise<string | null>;
}

export const useBuyStore = create<BuyState>()(
  persist(
    (set, get) => ({
      selectedPet: null,
      idempotencyKey: null,
      checkoutDetails: {
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        paymentMethod: "ONLINE",
      },
      loading: false,
      error: null,

      setSelectedPet: (pet, userEmail) => {
        const newKey = get().idempotencyKey || getRandomUUID();
        set((state) => ({
          selectedPet: pet,
          idempotencyKey: newKey,
          checkoutDetails: {
            ...state.checkoutDetails,
            email: userEmail || state.checkoutDetails.email,
          },
        }));
      },

      setCheckoutDetails: (details) =>
        set((state) => ({
          checkoutDetails: { ...state.checkoutDetails, ...details },
        })),

      clearCheckout: () =>
        set({
          selectedPet: null,
          idempotencyKey: null,
          error: null,
          checkoutDetails: {
            fullName: "",
            email: "",
            phone: "",
            address: "",
            city: "",
            postalCode: "",
            paymentMethod: "ONLINE",
          },
        }),

      generateIdempotencyKey: () => {
        const key = getRandomUUID();
        set({ idempotencyKey: key });
        return key;
      },

      processCheckout: async (method) => {
        const { selectedPet, checkoutDetails, idempotencyKey } = get();
        if (!selectedPet) throw new Error("No pet selected for purchase.");

        const finalPaymentMethod = method || checkoutDetails.paymentMethod;
        const finalCheckoutDetails = {
          ...checkoutDetails,
          paymentMethod: finalPaymentMethod,
        };

        set({ loading: true, error: null, checkoutDetails: finalCheckoutDetails });
        const currentKey = idempotencyKey || get().generateIdempotencyKey();

        const extractedImage =
          selectedPet.images?.[0] ||
          selectedPet.image ||
          selectedPet.imageUrl ||
          selectedPet.petImage ||
          "";

        try {
          const response = await api.post(
            `/api/orders/checkout`,
            {
              petId: selectedPet._id || selectedPet.id,
              title: selectedPet.name || selectedPet.title || selectedPet.breed,
              price: selectedPet.price,
              petImage: extractedImage,
              customerInfo: finalCheckoutDetails,
            },
            {
              headers: {
                "Idempotency-Key": currentKey,
              },
            }
          );

          set({ loading: false });

          if (finalPaymentMethod === "ONLINE") {
            const redirectUrl = response.data?.url;
            if (!redirectUrl || typeof redirectUrl !== "string" || !redirectUrl.startsWith("http")) {
              throw new Error("Invalid payment gateway redirect URL received from server.");
            }
            return redirectUrl;
          }

          const codSuccessUrl =
            typeof response.data?.successUrl === "string" && response.data.successUrl.length > 0
              ? response.data.successUrl
              : "/orders/success?type=cod";

          return codSuccessUrl;
        } catch (err: any) {
          if (!err.response) {
            console.error("Axios Network Error / CORS Block detected:", {
              message: err.message,
              code: err.code,
            });
          }

          const errorMsg =
            err.response?.data?.message ||
            (err.message === "Network Error"
              ? "Network Error: Please check if backend server is running and allows custom headers (CORS)."
              : null) ||
            err.message ||
            "Checkout failed.";

          set({ error: errorMsg, loading: false });
          throw new Error(errorMsg);
        }
      },
    }),
    {
      name: "pet-buy-storage",
      storage: createJSONStorage(() => AsyncStorage), // Native persistence engine
    }
  )
);