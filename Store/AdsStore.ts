import { create } from "zustand";
import axios from "axios";
import { api } from "@/lib/axios"; // Centralized API instance

const toast = {
  success: (message?: string) => console.log(message),
  error: (message?: string) => console.error(message),
};

// Export Base_URL for backward compatibility if other files import it from here
export const Base_URL = api.defaults.baseURL;

const getImageUrl = (imagePath?: string) => {
  if (!imagePath) return "/default-pet.jpg";
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
  getApprovedDogAds: (page?: number, limit?: number) => Promise<any>;
  getApprovedDogAdById: (id: string) => Promise<any>;
  getApprovedCatAds: (page?: number, limit?: number) => Promise<any>;
  getApprovedCatAdById: (id: string) => Promise<any>;
}

export const useAdStore = create<AdState>((set) => ({
  isPosting: false,
  isDeleting: false,
  isUpdating: false,
  isLoading: false,

  postAd: async (formData: FormData) => {
    set({ isPosting: true });
    try {
      const res = await api.post('/api/ads', formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success(res.data.message || "Ad posted successfully");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to post ad");
      } else {
        toast.error("Failed to post ad");
      }
      return false;
    } finally {
      set({ isPosting: false });
    }
  },

  deleteAd: async (adId) => {
    set({ isDeleting: true });
    try {
      const res = await api.delete(`/api/ads/${adId}`);
      toast.success(res.data.message || "Ad deleted successfully");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to delete ad");
      } else {
        toast.error("Failed to delete ad");
      }
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
      toast.success(res.data.message || "Ad updated successfully");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update ad");
      } else {
        toast.error("Failed to update ad");
      }
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  getUserAds: async () => {
    try {
      const res = await api.get('/api/ads/my-ads');
      return res.data.ads.map((ad: any) => ({
        ...ad,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        weight: ad.weight?.toString() || "",
        height: ad.height?.toString() || "",
        maxLife: ad.maxLife?.toString() || "",
        contactNumber: ad.contactNumber || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor.join(", ") : ad.suitableFor || "",
        isApproved: ad.isApproved || "pending",
      })) || [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch ads");
      } else {
        toast.error("Failed to fetch ads");
      }
      return [];
    }
  },

  getApprovedDogAds: async (page = 1, limit = 12) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/ads/approved/dogs?page=${page}&limit=${limit}`);
      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        price: ad.price || 0,
        city: ad.city || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(", ") : []),
        isApproved: ad.isApproved || "pending",
      }));

      return { ads: mappedAds, pagination: res.data.pagination };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch approved dog ads");
      } else {
        toast.error("Failed to fetch approved dog ads");
      }
      return { ads: [], pagination: { currentPage: 1, totalPages: 1, totalAds: 0 } };
    } finally {
      set({ isLoading: false });
    }
  },

  getApprovedDogAdById: async (slugOrId: string) => {
    try {
      let targetId = slugOrId;
      if (typeof window !== "undefined") {
        const savedData = sessionStorage.getItem("selectedPetData");
        if (savedData) {
          const parsed = JSON.parse(savedData);
          if (parsed._id || parsed.id) {
            targetId = parsed._id || parsed.id;
          }
        }
      }

      const res = await api.get(`/api/ads/approved/dogs/${targetId}`);
      const ad = res.data;
      return {
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        price: ad.price || 0,
        city: ad.city || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(", ") : []),
        isApproved: ad.isApproved || "pending",
        user: ad.user ? {
          name: ad.user.name,
          email: ad.user.email,
          avatar: ad.user.avatar ? getImageUrl(ad.user.avatar) : null
        } : null,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch ad");
      } else {
        toast.error("Failed to fetch ad");
      }
      return null;
    }
  },

  getApprovedCatAds: async (page = 1, limit = 12) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/api/ads/approved/cats?page=${page}&limit=${limit}`);
      const mappedAds = res.data.ads.map((ad: any) => ({
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        price: ad.price || 0,
        city: ad.city || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(", ") : []),
        isApproved: ad.isApproved || "pending",
      }));

      return { ads: mappedAds, pagination: res.data.pagination };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch approved cat ads");
      } else {
        toast.error("Failed to fetch approved cat ads");
      }
      return { ads: [], pagination: { currentPage: 1, totalPages: 1, totalAds: 0 } };
    } finally {
      set({ isLoading: false });
    }
  },

  getApprovedCatAdById: async (slugOrId: string) => {
    try {
      let idToFetch = slugOrId;
      if (typeof window !== "undefined") {
        const storedId = sessionStorage.getItem("currentPetId");
        if (storedId && (slugOrId.includes("-") || slugOrId.length !== 24)) {
          idToFetch = storedId;
        }
      }

      const res = await api.get(`/api/ads/approved/cats/${idToFetch}`);
      const ad = res.data;
      return {
        ...ad,
        id: ad._id,
        name: ad.name || ad.title,
        title: ad.name || ad.title,
        location: ad.city || ad.location,
        category: ad.type || ad.category,
        img: getImageUrl(ad.images?.[0]),
        breed: ad.breed || "",
        age: ad.age?.toString() || "",
        gender: ad.gender || "",
        price: ad.price || 0,
        city: ad.city || "",
        vaccinated: ad.vaccinated || false,
        kcpRegistered: ad.kcpRegistered || false,
        suitableFor: Array.isArray(ad.suitableFor) ? ad.suitableFor : (ad.suitableFor ? ad.suitableFor.split(", ") : []),
        isApproved: ad.isApproved || "pending",
        user: ad.user ? {
          name: ad.user.name,
          email: ad.user.email,
          avatar: ad.user.avatar ? getImageUrl(ad.user.avatar) : null
        } : null,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to fetch cat ad");
      } else {
        toast.error("Failed to fetch cat ad");
      }
      return null;
    }
  }
}));