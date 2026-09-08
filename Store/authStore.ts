import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-toast-message";
import { api } from "../lib/axios";
console.log("Auth store loaded",api.defaults.baseURL); // Log the base URL to verify it's set correctly 
// Secure storage adapter for Expo SecureStore
const secureStorage = {
  getItem: async (name: string) => {
    return (await SecureStore.getItemAsync(name)) ?? null;
  },
  setItem: async (name: string, value: string) => {
    await SecureStore.setItemAsync(name, value);
  },
  removeItem: async (name: string) => {
    await SecureStore.deleteItemAsync(name);
  },
};

interface AuthState {
  token: string | null;
  authUser: any | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  isVerifyingOtp: boolean;
  isHydrated: boolean;
  pendingEmail: string | null;

  signup: (data: any) => Promise<any>;
  verifyOtp: (otp: string) => Promise<boolean>;
  login: (formData: any) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  updateUser: (formData: FormData) => Promise<boolean>;
  changePassword: (data: { oldPassword: string; newPassword: string }) => Promise<boolean>;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (data: { otp: string; newPassword: string }) => Promise<boolean>;
  setHydrated: (status: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isUpdatingProfile: false,
      isCheckingAuth: false,
      isVerifyingOtp: false,
      isHydrated: false,
      pendingEmail: null,

      setHydrated: (status: boolean) => set({ isHydrated: status }),

      signup: async (data: any) => {
        set({ isSigningUp: true });
        try {
          const res = await api.post("/api/users/register", data);
          const email = res.data?.email || data.email;
          set({ pendingEmail: email });
          Toast.show({ type: "success", text1: res.data?.message || "OTP sent to your email!" });
          return res.data;
        } catch (error: any) {
          Toast.show({ type: "error", text1: error.response?.data?.message || "Signup failed" });
          throw error;
        } finally {
          set({ isSigningUp: false });
        }
      },

      verifyOtp: async (otp: string) => {
        set({ isVerifyingOtp: true });
        const email = get().pendingEmail;
        if (!email) {
          Toast.show({ type: "error", text1: "No pending email. Please sign up again." });
          set({ isVerifyingOtp: false });
          return false;
        }
        try {
          const res = await api.post("/api/users/verify-otp", { email, otp });
          set({ authUser: res.data.user, token: res.data.token, pendingEmail: null });
          Toast.show({ type: "success", text1: "Email verified successfully!" });
          return true;
        } catch (error: any) {
          Toast.show({ type: "error", text1: error.response?.data?.message || "Invalid or expired OTP" });
          return false;
        } finally {
          set({ isVerifyingOtp: false });
        }
      },

      login: async (formData: any) => {
        set({ isLoggingIn: true });
        try {
          const res = await api.post("/api/users/login", formData);
          set({ authUser: res.data.user, token: res.data.token });
          Toast.show({ type: "success", text1: `Welcome back, ${res.data.user.name}!` });
          console.log("Login successful, token:", res.data.token);

          return true;
        } catch (error: any) {
          Toast.show({ type: "error", text1: error.response?.data?.message || "Login failed" });
          console.error("Login failed:", error);
          return false;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await api.get("/api/users/logout");
        } catch {
          // ignore network error on logout, reset local auth state
        } finally {
          set({ authUser: null, token: null });
          Toast.show({ type: "success", text1: "Logged out successfully" });
        }
      },

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const res = await api.get("/api/users/me");
          set({ authUser: res.data.user });
        } catch {
          set({ authUser: null, token: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      updateUser: async (formData: FormData) => {
        set({ isUpdatingProfile: true });
        try {
          const res = await api.patch("/api/users/profile", formData);
          set({ authUser: res.data.user });
          Toast.show({ type: "success", text1: res.data.message || "Profile updated" });
          return true;
        } catch (error: any) {
          Toast.show({ type: "error", text1: error.response?.data?.message || "Update failed" });
          return false;
        } finally {
          set({ isUpdatingProfile: false });
        }
      },

      changePassword: async (data: { oldPassword: string; newPassword: string }) => {
        try {
          const res = await api.patch("/api/users/change-password", data);
          Toast.show({ type: "success", text1: res.data.message || "Password changed" });
          return true;
        } catch (error: any) {
          Toast.show({ type: "error", text1: error.response?.data?.message || "Password change failed" });
          return false;
        }
      },

      forgotPassword: async (email: string) => {
        try {
          const res = await api.post("/api/users/forgot-password", { email });
          Toast.show({ type: "success", text1: res.data.message || "OTP sent" });
          return true;
        } catch (error: any) {
          Toast.show({ type: "error", text1: error.response?.data?.message || "Failed to send OTP" });
          return false;
        }
      },

      resetPassword: async (data: { otp: string; newPassword: string }) => {
        try {
          const res = await api.post("/api/users/reset-password", data);
          Toast.show({ type: "success", text1: res.data.message || "Password reset" });
          return true;
        } catch (error: any) {
          Toast.show({ type: "error", text1: error.response?.data?.message || "Reset failed" });
          return false;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ token: state.token, authUser: state.authUser }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);