import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../api/services";

export const fetchCurrentUser = createAsyncThunk("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("impeccable_token");
    if (!token) return null;
    const { data } = await authApi.me();
    return data.data;
  } catch (error) {
    localStorage.removeItem("impeccable_token");
    return rejectWithValue(error.response?.data?.message || "Auth failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("impeccable_token");
      authApi.logout();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      });
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;

export default authSlice.reducer;