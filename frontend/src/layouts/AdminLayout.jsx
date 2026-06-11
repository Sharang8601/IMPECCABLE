import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineHome, HiOutlineTag, HiOutlineRectangleStack, HiOutlineSparkles, HiOutlineClipboardDocumentList, HiOutlineUsers, HiOutlineCog6Tooth, HiOutlineArrowRightOnRectangle, HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import Logo from "../components/ui/Logo";
import { selectUser, logout } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const sidebarLinks = [
  { to: "/admin", label: "Dashboard", icon: HiOutlineHome, end: true },
  { to: "/admin/categories", label: "Categories", icon: HiOutlineTag },
  { to: "/admin/subcategories", label: "Sub Categories", icon: HiOutlineRectangleStack },
  { to: "/admin/services", label: "Services", icon: HiOutlineSparkles },
  { to: "/admin/orders", label: "Orders", icon: HiOutlineClipboardDocumentList },
  { to: "/admin/customers", label: "Customers", icon: HiOutlineUsers },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Admin access required");
      navigate("/menu/impeccable-unisex-salon", { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/menu/impeccable-unisex-salon");
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-white/5 transform transition-transform duration-300 lg:transform-none ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10">
                <Logo />
              </div>
              <div>
                <h2 className="font-display text-sm gold-text font-semibold">Admin</h2>
                <p className="text-[10px] text-text-secondary">Impeccable Salon</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <HiOutlineXMark className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-gold/10 text-gold border border-gold/20"
                      : "text-text-secondary hover:text-text-primary hover:bg-dark-800 border border-transparent"
                  }`
                }
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/5 space-y-2">
            <div className="flex items-center gap-3 px-4 py-2">
              {user?.avatar && (
                <img src={user.avatar} alt="" className="w-8 h-8 rounded-full" />
              )}
              <div className="min-w-0">
                <p className="text-xs font-medium text-text-primary truncate">{user?.name || "Admin"}</p>
                <p className="text-[10px] text-text-secondary truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400/70 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-dark-card border-b border-white/5">
          <button onClick={() => setSidebarOpen(true)}>
            <HiOutlineBars3 className="w-6 h-6 text-text-primary" />
          </button>
          <h1 className="font-display text-sm gold-text font-semibold">Admin Panel</h1>
          <div className="w-6" />
        </div>

        <div className="p-4 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;