import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartApi } from "../../api/services";

export const fetchCart = createAsyncThunk("cart/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.get();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch cart");
  }
});

export const addToCart = createAsyncThunk("cart/add", async ({ serviceId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.add({ serviceId, quantity });
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to add to cart");
  }
});

export const removeFromCart = createAsyncThunk("cart/remove", async (serviceId, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.remove(serviceId);
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to remove from cart");
  }
});

export const clearCart = createAsyncThunk("cart/clear", async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.clear();
    return data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to clear cart");
  }
});

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalAmount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    setLocalCart: (state, action) => {
      state.items = action.payload;
      state.totalAmount = action.payload.reduce((sum, item) => sum + item.price * item.quantity, 0);
    },
    addLocalItem: (state, action) => {
      const { serviceId, service, quantity = 1 } = action.payload;
      const existing = state.items.find((item) =>
        item.service?._id === serviceId || item.service === serviceId
      );
      if (existing) {
        existing.quantity = Math.min(20, existing.quantity + quantity);
      } else {
        state.items.push({ service: serviceId, ...service, quantity });
      }
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    },
    removeLocalItem: (state, action) => {
      state.items = state.items.filter((item) =>
        item.service?._id !== action.payload && item.service !== action.payload
      );
      state.totalAmount = state.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    },
    clearLocalCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.totalAmount = state.items.reduce((sum, item) => sum + (item.service?.price || 0) * item.quantity, 0);
        state.loading = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.totalAmount = state.items.reduce((sum, item) => sum + (item.service?.price || 0) * item.quantity, 0);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload?.items || [];
        state.totalAmount = state.items.reduce((sum, item) => sum + (item.service?.price || 0) * item.quantity, 0);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totalAmount = 0;
      });
  },
});

export const { setLocalCart, addLocalItem, removeLocalItem, clearLocalCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.totalAmount;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;