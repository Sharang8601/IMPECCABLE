import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { adminApi, orderApi } from "../../api/services";
import { formatPrice } from "../../utils/helpers";
import { 
  HiOutlineSparkles, 
  HiOutlineTag, 
  HiOutlineClipboardDocumentList, 
  HiOutlineClock 
} from "react-icons/hi2";

const StatCard = ({ icon: Icon, label, value, colorClass, borderClass }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-[#0F0F0F] rounded-xl p-5 border ${borderClass} flex items-center justify-between shadow-md`}
  >
    <div>
      <p className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold mb-1">{label}</p>
      <p className="text-2xl lg:text-3xl font-bold text-text-primary font-display">{value ?? 0}</p>
    </div>
    <div className={`p-3 rounded-xl ${colorClass} shrink-0 shadow-sm border border-white/5`}>
      <Icon className="w-6 h-6" />
    </div>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          adminApi.dashboard(),
          orderApi.listAdmin(),
        ]);
        setStats(statsRes.data.data);
        // Take the 5 most recent orders
        setOrders((ordersRes.data.data || []).slice(0, 5));
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { 
      icon: HiOutlineSparkles, 
      label: "Total Services", 
      value: stats?.totalServices, 
      colorClass: "bg-blue-500/10 text-blue-400", 
      borderClass: "border-blue-500/20" 
    },
    { 
      icon: HiOutlineTag, 
      label: "Total Categories", 
      value: stats?.totalCategories, 
      colorClass: "bg-purple-500/10 text-purple-400", 
      borderClass: "border-purple-500/20" 
    },
    { 
      icon: HiOutlineClipboardDocumentList, 
      label: "Total Orders", 
      value: stats?.totalOrders, 
      colorClass: "bg-green-500/10 text-green-400", 
      borderClass: "border-green-500/20" 
    },
    { 
      icon: HiOutlineClock, 
      label: "Pending Orders", 
      value: stats?.pendingOrders, 
      colorClass: "bg-gold/10 text-gold", 
      borderClass: "border-gold/25" 
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return "bg-gold/10 text-gold border border-gold/20";
      case "Contacted":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      case "Completed":
        return "bg-green-500/10 text-green-400 border border-green-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border border-red-500/20";
      default:
        return "bg-dark-800 text-text-secondary border border-white/5";
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Recent Orders Section */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0F0F0F] border border-white/5 rounded-2xl p-6 shadow-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg text-text-primary font-semibold">
            Recent Orders
          </h2>
          <Link 
            to="/admin/orders" 
            className="text-xs text-gold hover:text-gold-hover transition-colors font-medium flex items-center gap-1"
          >
            View All &gt;
          </Link>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 pb-3">
                <th className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold pb-3">Customer</th>
                <th className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold pb-3">Services</th>
                <th className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold pb-3">Amount</th>
                <th className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold pb-3">Status</th>
                <th className="text-[10px] text-text-secondary uppercase tracking-wider font-semibold pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const serviceNames = (order.services || []).map(s => s.title).join(", ");
                const formattedDate = new Date(order.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                });

                return (
                  <tr 
                    key={order._id} 
                    className="border-b border-white/5 hover:bg-white/[0.01] transition-colors"
                  >
                    {/* Customer Info */}
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2.5">
                        {order.customerAvatar ? (
                          <img 
                            src={order.customerAvatar} 
                            alt="" 
                            className="w-7 h-7 rounded-full border border-white/10" 
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center text-[10px] text-text-secondary font-bold">
                            {order.customerName?.charAt(0) || "U"}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-semibold text-text-primary">{order.customerName}</p>
                          <p className="text-[9px] text-text-secondary truncate max-w-[150px]">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>

                    {/* Services */}
                    <td className="py-4 pr-4">
                      <p className="text-xs text-text-secondary truncate max-w-[200px]" title={serviceNames}>
                        {serviceNames || "—"}
                      </p>
                    </td>

                    {/* Amount */}
                    <td className="py-4 pr-4">
                      <span className="text-xs font-bold text-text-primary">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 pr-4">
                      <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-4">
                      <span className="text-[10px] text-text-secondary">
                        {formattedDate}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-xs text-text-secondary">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;