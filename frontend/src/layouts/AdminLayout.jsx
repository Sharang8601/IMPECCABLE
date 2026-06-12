import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineHome, 
  HiOutlineTag, 
  HiOutlineRectangleStack, 
  HiOutlineSparkles, 
  HiOutlineClipboardDocumentList, 
  HiOutlineUsers, 
  HiOutlineCog6Tooth, 
  HiOutlineArrowRightOnRectangle, 
  HiOutlineBars3, 
  HiOutlineXMark 
} from "react-icons/hi2";
import Logo from "../components/ui/Logo";
import { selectUser, logout } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const sidebarLinks = [
  { to: "/admin", label: "Dashboard", icon: HiOutlineHome, end: true },
  { to: "/admin/categories", label: "Categories", icon: HiOutlineTag },
  { to: "/admin/services", label: "Services", icon: HiOutlineSparkles },
  { to: "/admin/orders", label: "Orders", icon: HiOutlineClipboardDocumentList },
  { to: "/admin/customers", label: "Customers", icon: HiOutlineUsers },
  { to: "#settings", label: "Settings", icon: HiOutlineCog6Tooth },
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
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-white/5 transform transition-transform duration-300 lg:transform-none flex-shrink-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        <div className="flex flex-col h-full bg-[#0A0A0A]">
          {/* Logo */}
          <div className="flex items-center justify-between p-5 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0">
                <Logo />
              </div>
              <div>
                <h2 className="font-display text-sm gold-text font-semibold leading-none">Impeccable</h2>
                <p className="text-[11px] text-gold/80 font-normal mt-0.5" style={{ fontFamily: "'Great Vibes', cursive" }}>Unisex Salon</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <HiOutlineXMark className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              if (link.to.startsWith("#")) {
                return (
                  <button
                    key={link.label}
                    onClick={() => {
                      toast.success(`${link.label} clicked`);
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-dark-800 border border-transparent w-full text-left transition-all duration-200"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </button>
                );
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-gold/10 text-gold border border-gold/20 font-medium"
                        : "text-text-secondary hover:text-text-primary hover:bg-dark-800 border border-transparent"
                    }`
                  }
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </NavLink>
              );
            })}

            {/* Logout button embedded in the sidebar list to match reference image */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-400/80 hover:text-red-400 hover:bg-red-400/5 transition-all w-full text-left border border-transparent"
            >
              <HiOutlineArrowRightOnRectangle className="w-5 h-5" />
              Logout
            </button>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen flex flex-col overflow-hidden bg-dark">
        {/* Desktop & Mobile Navigation Header */}
        <header className="bg-dark-card border-b border-white/5 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <HiOutlineBars3 className="w-6 h-6 text-text-primary" />
            </button>
            <h1 className="font-display text-lg lg:text-xl gold-text font-semibold">Admin Panel</h1>
          </div>
          
          {/* Owner details on the right */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold">Owner</p>
              <p className="text-xs text-text-primary hidden sm:block">{user?.name || "Administrator"}</p>
            </div>
            <div className="w-9 h-9 rounded-full overflow-hidden border border-gold/30 shadow-md">
              <img 
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"} 
                alt="Owner Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
          </div>
        </header>

        {/* Content Outlet scroll area */}
        <div className="p-6 lg:p-8 flex-1 overflow-y-auto scrollbar-thin">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;