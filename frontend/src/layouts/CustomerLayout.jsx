import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/customer/Navbar";
import CartDrawer from "../components/cart/CartDrawer";

const CustomerLayout = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark">
      <Navbar onCartClick={() => setCartOpen(true)} />
      <Outlet />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default CustomerLayout;