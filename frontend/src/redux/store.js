import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import serviceReducer from "./slices/serviceSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    services: serviceReducer,
  },
});