import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { api } from "../lib/axios";

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

interface DeepLinkOptions {
  successUrl?: string;
  cancelUrl?: string;
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
  processCheckout: (
    method?: "ONLINE" | "COD",
    options?: DeepLinkOptions
  ) => Promise<string | null>;
}

const initialCheckoutDetails: CheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  paymentMethod: "ONLINE",
};

export const useBuyStore = create<BuyState>()(
  persist(
    (set, get) => ({
      selectedPet: null,
      idempotencyKey: null,
      checkoutDetails: initialCheckoutDetails,
      loading: false,
      error: null,

      // FIX: Always generate a NEW idempotency key when selecting a new pet
      setSelectedPet: (pet, userEmail) => {
        const freshKey = getRandomUUID();
        set((state) => ({
          selectedPet: pet,
          idempotencyKey: freshKey,
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
          checkoutDetails: initialCheckoutDetails,
        }),

      generateIdempotencyKey: () => {
        const key = getRandomUUID();
        set({ idempotencyKey: key });
        return key;
      },

      processCheckout: async (method, options) => {
        const { selectedPet, checkoutDetails, idempotencyKey } = get();
        if (!selectedPet) throw new Error("No pet selected for purchase.");

        const finalPaymentMethod = method || checkoutDetails.paymentMethod;
        const finalCheckoutDetails = {
          ...checkoutDetails,
          paymentMethod: finalPaymentMethod,
        };

        set({ loading: true, error: null, checkoutDetails: finalCheckoutDetails });
        
        // Ensure key exists
        const currentKey = idempotencyKey || get().generateIdempotencyKey();

        const extractedImage =
          selectedPet.images?.[0] ||
          selectedPet.image ||
          selectedPet.imageUrl ||
          selectedPet.petImage ||
          "";

        try {
          const response = await api.post(
            `/api/orders/checkout/mobile`,
            {
              petId: selectedPet._id || selectedPet.id,
              title: selectedPet.name || selectedPet.title || selectedPet.breed,
              price: selectedPet.price,
              petImage: extractedImage,
              customerInfo: finalCheckoutDetails,
              successUrl: options?.successUrl,
              cancelUrl: options?.cancelUrl,
            },
            {
              headers: {
                // FIX: Match lowercase header name expected by Node/Express
                "idempotency-key": currentKey,
              },
            }
          );

          set({ loading: false });

          if (finalPaymentMethod === "ONLINE") {
            const redirectUrl = response.data?.url;
            if (
              !redirectUrl ||
              typeof redirectUrl !== "string" ||
              !redirectUrl.startsWith("http")
            ) {
              throw new Error("Invalid payment gateway redirect URL received from server.");
            }
            return redirectUrl;
          }

          const codSuccessUrl =
            typeof response.data?.successUrl === "string" &&
            response.data.successUrl.length > 0
              ? response.data.successUrl
              : "/orders/success?type=cod";

          return codSuccessUrl;
        } catch (err: any) {
          const errorMsg =
            err.response?.data?.message ||
            (err.message === "Network Error"
              ? "Network Error: Please check backend connectivity."
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
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);