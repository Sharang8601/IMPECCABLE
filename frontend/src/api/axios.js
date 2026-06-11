import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("impeccable_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("impeccable_token");
      if (!window.location.pathname.startsWith("/admin") && window.location.pathname !== "/menu/impeccable-unisex-salon") {
        if (window.location.pathname !== "/auth/success") {
          window.location.href = "/menu/impeccable-unisex-salon";
        }
      }
    }
    return Promise.reject(error);
  },
);

export default api;