import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "@/lib/axios"; // Centralized API instance

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
  // Returns a redirect/success URL for BOTH payment methods now.
  // ONLINE -> Stripe hosted checkout URL
  // COD    -> backend-provided clean success URL (e.g. /orders/success?type=cod)
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
        const newKey = get().idempotencyKey || crypto.randomUUID();
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
        const key = crypto.randomUUID();
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

          // COD: use the clean, backend-provided success URL instead of
          // silently discarding it. Falls back to a sane default just in
          // case an older backend response doesn't include successUrl.
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
    }
  )
);