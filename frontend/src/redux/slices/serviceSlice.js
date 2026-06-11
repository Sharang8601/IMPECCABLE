import { createSlice } from "@reduxjs/toolkit";

const serviceSlice = createSlice({
  name: "services",
  initialState: {
    categories: [],
    subCategories: [],
    services: [],
    selectedCategory: null,
    selectedSubCategory: null,
    loading: false,
  },
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setSubCategories: (state, action) => {
      state.subCategories = action.payload;
    },
    setServices: (state, action) => {
      state.services = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.selectedSubCategory = null;
    },
    setSelectedSubCategory: (state, action) => {
      state.selectedSubCategory = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setCategories,
  setSubCategories,
  setServices,
  setSelectedCategory,
  setSelectedSubCategory,
  setLoading,
} = serviceSlice.actions;

export const selectCategories = (state) => state.services.categories;
export const selectSubCategories = (state) => state.services.subCategories;
export const selectServices = (state) => state.services.services;
export const selectSelectedCategory = (state) => state.services.selectedCategory;
export const selectSelectedSubCategory = (state) => state.services.selectedSubCategory;
export const selectServicesLoading = (state) => state.services.loading;

export default serviceSlice.reducer;