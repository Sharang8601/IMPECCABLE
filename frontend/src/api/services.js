import api from "./axios";

export const serviceApi = {
  list: (params) => api.get("/services", { params }),
  listAdmin: (params) => api.get("/services/admin", { params }),
  create: (data) => api.post("/services", data),
  update: (id, data) => api.patch(`/services/${id}`, data),
  toggle: (id) => api.patch(`/services/${id}/toggle`),
  remove: (id) => api.delete(`/services/${id}`),
};

export const categoryApi = {
  list: () => api.get("/categories"),
  listAdmin: () => api.get("/categories/admin"),
  create: (data) => api.post("/categories", data),
  update: (id, data) => api.patch(`/categories/${id}`, data),
  remove: (id) => api.delete(`/categories/${id}`),
};

export const authApi = {
  me: () => api.get("/auth/me"),
  logout: () => api.post("/auth/logout"),
  getGoogleUrl: (redirect) => {
    const params = redirect ? `?redirect=${encodeURIComponent(redirect)}` : "";
    return `${import.meta.env.VITE_API_URL || "/api"}/auth/google${params}`;
  },
};

export const cartApi = {
  get: () => api.get("/cart"),
  add: (data) => api.post("/cart/items", data),
  remove: (serviceId) => api.delete(`/cart/items/${serviceId}`),
  clear: () => api.delete("/cart"),
  replace: (data) => api.put("/cart", data),
};

export const orderApi = {
  create: (data) => api.post("/orders", data),
  myOrders: () => api.get("/orders/my"),
  listAdmin: () => api.get("/orders/admin"),
  updateStatus: (id, status) => api.patch(`/orders/admin/${id}/status`, { status }),
};

export const adminApi = {
  dashboard: () => api.get("/admin/dashboard"),
  customers: () => api.get("/admin/customers"),
};