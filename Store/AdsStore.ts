import { create } from "zustand";
import axios from "axios";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { api } from "../lib/axios";

export const Base_URL = api.defaults.baseURL;

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "https://via.placeholder.com/600x400.png?text=Pet+Image";
  if (imagePath.startsWith("http")) return imagePath;
  return `${Base_URL || ""}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

interface AdState {
  isPosting: boolean;
  isDeleting: boolean;
  isUpdating: boolean;
  isLoading: boolean;
  postAd: (formData: FormData) => Promise<boolean>;
  deleteAd: (adId: string) => Promise<boolean>;
  updateAd: (adId: string, formData: FormData) => Promise<boolean>;
  getUserAds: () => Promise<any[]>;
  getApprovedAds: (category?: "dogs" | "cats", page?: number, limit?: number) => Promise<any>;
  getAdById: (id: string, category?: string) => Promise<any>;
}

export const useAdStore = create<AdState>((set) => ({
  isPosting: false,
  isDeleting: false,
  isUpdating: false,
  isLoading: false,

  postAd: async (formData: FormData) => {
    set({ isPosting: true });
    try {
      const res = await api.post("/api/ads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Toast.show({
        type: "success",
        text1: res.data.message || "Ad posted successfully",
      });
      return true;
    } catch (error) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to post ad";
      Toast.show({ type: "error", text1: msg || "Failed to post ad" });
      return false;
    } finally {
      set({ isPosting: false });
    }
  },

  deleteAd: async (adId) => {
    set({ isDeleting: true });
    try {
      const res = await api.delete(`/api/ads/${adId}`);
      Toast.show({
        type: "success",
        text1: res.data.message || "Ad deleted successfully",
      });
      return true;
    } catch (error) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to delete ad";
      Toast.show({ type: "error", text1: msg || "Failed to delete ad" });
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  updateAd: async (adId, formData) => {
    set({ isUpdating: true });
    try {
      const res = await api.patch(`/api/ads/${adId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      Toast.show({
        type: "success",
        text1: res.data.message || "Ad updated successfully",
      });
      return true;
    } catch (error) {
      const msg = axios.isAxiosError(error) ? error.response?.data?.message : "Failed to update ad";
      Toast.show({ type: "error", text1: msg || "Failed to update ad" });
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  getUserAds: async () => {
    try {
      const res = await api.get("/api/ads/my-ads");
      return (
        res.data.ads?.map((ad: any) => ({
          ...ad,
          id: ad._id,
          title: ad.name || ad.title,
          location: ad.city || ad.location,
          category: ad.type || ad.category,
          img: getImageUrl(ad.images?.[0]),
        })) || []
      );
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to fetch user ads" });
      return [];
    }
  },

  getApprovedAds: async (category = "dogs", page = 1, limit = 12) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/ads/approved/${category}?page=${page}&limit=${limit}`);
      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
      }));

      return { ads: mappedAds, pagination: res.data.pagination };
    } catch (error) {
      Toast.show({ type: "error", text1: `Failed to fetch approved ${category} ads` });
      return { ads: [], pagination: { currentPage: 1, totalPages: 1, totalAds: 0 } };
    } finally {
      set({ isLoading: false });
    }
  },

  getAdById: async (id: string, category = "dogs") => {
    try {
      let targetId = id;

      // Platform check prevents web storage crashes on native Android/iOS builds
      if (Platform.OS === "web" && typeof window !== "undefined") {
        const savedData = sessionStorage.getItem("selectedPetData");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed._id || parsed.id) targetId = parsed._id || parsed.id;
        }
      }

      // Tries specific route first, falls back to generic /api/ads/:id route
      let res;
      try {
        res = await api.get(`/api/ads/approved/${category}/${targetId}`);
      } catch (err) {
        res = await api.get(`/api/ads/${targetId}`);
      }

      const ad = res.data?.ad || res.data;
      return {
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        user: ad.user
          ? {
              name: ad.user.name,
              email: ad.user.email,
              avatar: ad.user.avatar ? getImageUrl(ad.user.avatar) : null,
            }
          : null,
      };
    } catch (error) {
      Toast.show({ type: "error", text1: "Failed to fetch pet details" });
      return null;
    }
  },
}));