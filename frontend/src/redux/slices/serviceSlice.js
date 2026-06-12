import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "services",
  initialState: {
    categories: [],
    services: [],
    selectedCategory: null,
    loading: false,
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCategories,
  setServices,
  setSelectedCategory,
  setLoading,
} = serviceSlice.actions;

export const selectCategories = (state) => state.services.categories;
export const selectServices = (state) => state.services.services;
export const selectSelectedCategory = (state) => state.services.selectedCategory;
export const selectServicesLoading = (state) => state.services.loading;

export default serviceSlice.reducer;