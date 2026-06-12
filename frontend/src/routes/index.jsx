import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, selectAuthLoading } from "../redux/slices/authSlice";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import MenuPage from "../pages/customer/MenuPage";
import AuthSuccess from "../pages/auth/AuthSuccess";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminCategories from "../pages/admin/AdminCategories";

import AdminServices from "../pages/admin/AdminServices";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminCustomers from "../pages/admin/AdminCustomers";

const AppRoutes = () => {
  const dispatch = useDispatch();
  const authLoading = useSelector(selectAuthLoading);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary text-sm">Loading</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/menu/impeccable-unisex-salon" element={<MenuPage />} />
      </Route>

      <Route path="/auth/success" element={<AuthSuccess />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="categories" element={<AdminCategories />} />

        <Route path="services" element={<AdminServices />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="customers" element={<AdminCustomers />} />
      </Route>

      <Route path="*" element={<Navigate to="/menu/impeccable-unisex-salon" replace />} />
    </Routes>
  );
};

export default AppRoutes;