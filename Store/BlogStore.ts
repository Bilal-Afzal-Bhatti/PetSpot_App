import { create } from "zustand";
import { api } from "../lib/axios"; // Centralized API instance

interface BlogStoreType {
  blogsAll: any[];
  blogsDogs: any[];
  blogsCats: any[];
  sidebarBlogs: any[];

  page: number;
  totalPages: number;
  loading: boolean;
  error: string | null;

  singleBlog: any | null; // For single blog

  fetchBlogs: (category?: string, page?: number) => Promise<void>;
  fetchSingleBlog: (slug: string) => Promise<void>;
  fetchSidebarBlogs: (category?: string) => Promise<void>;
  setPage: (page: number) => void;
}

export const BlogStore = create<BlogStoreType>((set) => ({
  blogsAll: [],
  blogsDogs: [],
  blogsCats: [],
  sidebarBlogs: [],

  page: 1,
  totalPages: 1,
  loading: false,
  error: null,
  singleBlog: null,

  setPage: (page) => set({ page }),

  fetchBlogs: async (category = "", page = 1) => {
    try {
      set({ loading: true, error: null });

      // Using your backend query parameters: category, page, limit
      const response = await api.get("/api/admin/blogs", {
        params: {
          category: category && category !== "all" ? category : undefined,
          page,
          limit: 10,
        },
      });

      const data = response.data;
      if (!data) {
        return set({ error: "Failed to fetch blogs", loading: false });
      }

      const blogs = data.blogs || [];

      // Categorize state update matching "dog-care" and "cat-care" variants
      if (category === "dogs" || category === "dog-care") {
        set({ blogsDogs: blogs });
      } else if (category === "cats" || category === "cat-care") {
        set({ blogsCats: blogs });
      } else {
        set({ blogsAll: blogs });
      }

      set({
        page: data.page || page,
        totalPages: data.pages || 1,
      });

      console.log("Fetched blogs successfully:", blogs);
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || err.message || "Something went wrong", 
        loading: false 
      });
    } finally {
      set({ loading: false });
    }
  },

  // ✅ Fetch a single blog by slug using custom axios instance
  fetchSingleBlog: async (slug: string) => {
    try {
      set({ loading: true, error: null, singleBlog: null });
      
      const response = await api.get(`/api/admin/blogs/get-single/${slug}`);
      const data = response.data;

      if (!data || (!data.success && !data.blog)) {
        return set({ error: "Failed to fetch the blog", loading: false });
      }

      set({ singleBlog: data.blog || data });
      console.log("Fetched single blog:", data.blog || data);
    } catch (err: any) {
      set({ 
        error: err.response?.data?.message || err.message || "Something went wrong", 
        loading: false 
      });
    } finally {
      set({ loading: false });
    }
  },

  // Add this inside your BlogStore interface and implementation
fetchSidebarBlogs: async (category?: string) => {
  try {
    set({ loading: true, error: null });
    const queryParam = category && category !== "all" ? `?category=${category}&limit=6` : "?limit=6";
    
    // Uses your custom axios instance (api)
    const response = await api.get(`/api/admin/blogs${queryParam}`);
    const data = response.data;

    set({ sidebarBlogs: data.blogs || [], loading: false });
  } catch (err: any) {
    set({ 
      error: err.response?.data?.message || err.message || "Failed to fetch sidebar blogs", 
      loading: false 
    });
  }
},
}));