import axios from "axios";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  // Dynamically require store inside the function to break the module load cycle
  const { useAuthStore } = require("@/../Store/authStore");
  const token = useAuthStore.getState().token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const { useAuthStore } = require("@/../Store/authStore");
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);