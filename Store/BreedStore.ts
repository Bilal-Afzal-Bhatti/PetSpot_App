import { create } from "zustand";
import { api } from "@/lib/axios";

export interface OverviewPoint {
  title: string;
  description: string;
}

export interface Breed {
  life: string | undefined;
  lifespan: string | undefined;
  id: string;
  _id: string;
  name: string;
  slug: string;
  category: string;
  image?: string;
  images?: string[];
  origin?: string;
  maxlife?: string;
  weight?: string;
  height?: string;
  temperament?: string[];
  suitableFor?: string;
  overviewPoints?: OverviewPoint[];
  breedInfoPoints?: OverviewPoint[];
  commonNicknames?: string;
  trainability?: string;
  shedding?: string;
  grooming?: string;
  breedType?: string;
  size?: string;
  isPopular?: boolean;
  createdAt: string;
}

interface BreedState {
  breeds: Breed[];
  total: number;
  page: number;
  pages: number;
  limit: number;
  loading: boolean;
  error: string | null;
  category: string;
  search: string;

  // Single breed detail (for breed detail page)
  selectedBreed: Breed | null;
  detailLoading: boolean;
  detailError: string | null;

  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  fetchBreeds: () => Promise<void>;
  fetchBreedBySlug: (slug: string) => Promise<void>;
  clearSelectedBreed: () => void;
}

export const useBreedStore = create<BreedState>((set, get) => ({
  breeds: [],
  total: 0,
  page: 1,
  pages: 1,
  limit: 12,
  loading: false,
  error: null,
  category: "all",
  search: "",

  selectedBreed: null,
  detailLoading: false,
  detailError: null,

  setCategory: (category: string) => {
    set({ category, page: 1 });
    get().fetchBreeds();
  },

  setSearch: (search: string) => {
    set({ search, page: 1 });
    get().fetchBreeds();
  },

  setPage: (page: number) => {
    set({ page });
    get().fetchBreeds();
  },

  fetchBreeds: async () => {
    set({ loading: true, error: null });
    try {
      const { category, search, page, limit } = get();

      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("limit", limit.toString());

      if (category && category !== "all") {
        params.append("category", category);
      }
      if (search.trim()) {
        params.append("search", search.trim());
      }

      const response = await api.get(`/api/admin/breeds?${params.toString()}`);
      const data = response.data;

      set({
        breeds: data.breeds || [],
        total: data.total || 0,
        pages: data.pages || 1,
        loading: false,
      });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || err.message || "Failed to fetch breeds",
        loading: false,
      });
    }
  },

  // Public single-breed lookup by slug
  fetchBreedBySlug: async (slug: string) => {
    set({ detailLoading: true, detailError: null, selectedBreed: null });
    try {
      const response = await api.get(`/api/breeds/${encodeURIComponent(slug)}`);
      
      console.log("API Breed Response:", response.data);

      const breedData = response.data?.breed || response.data?.data || response.data;

      if (!breedData || typeof breedData !== "object") {
        throw new Error("Breed data not found in response");
      }

      set({ selectedBreed: breedData, detailLoading: false });
    } catch (err: any) {
      console.error("Error fetching breed:", err);
      set({
        detailError: err.response?.data?.message || err.message || "Breed not found",
        detailLoading: false,
      });
    }
  },

  // Implementation added here:
  clearSelectedBreed: () => set({ selectedBreed: null, detailError: null }),
}));