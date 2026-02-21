import axios, { AxiosError } from "axios";
import { API_URL } from "@/utils/constant";

const AUTH_EXCLUDED_ROUTES = [
  "/auth/refresh",
  "/auth/me",
  "/auth/login",
  "/invite",
];

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const path = originalRequest.url?.split("?")[0];
    const isExcludedRoute = AUTH_EXCLUDED_ROUTES.includes(path!);

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isExcludedRoute
    ) {
      originalRequest._retry = true;
      try {
        await api.post("/auth/refresh");
        return api(originalRequest);
      } catch (refreshError) {
        if (refreshError instanceof AxiosError) {
          console.error(
            "Token refresh failed:",
            refreshError.response?.data || refreshError.message,
          );
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
