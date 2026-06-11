import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../../api/services";
import { HiOutlineSparkles, HiOutlineTag, HiOutlineClipboardDocumentList, HiOutlineClock } from "react-icons/hi2";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="card-premium p-6"
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
    <p className="text-2xl lg:text-3xl font-bold text-text-primary mb-1">{value ?? 0}</p>
    <p className="text-text-secondary text-sm">{label}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.dashboard()
      .then((res) => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cards = [
    { icon: HiOutlineSparkles, label: "Total Services", value: stats?.totalServices, color: "bg-blue-500/10 text-blue-400" },
    { icon: HiOutlineTag, label: "Total Categories", value: stats?.totalCategories, color: "bg-purple-500/10 text-purple-400" },
    { icon: HiOutlineClipboardDocumentList, label: "Total Orders", value: stats?.totalOrders, color: "bg-green-500/10 text-green-400" },
    { icon: HiOutlineClock, label: "Pending Orders", value: stats?.pendingOrders, color: "bg-gold/10 text-gold" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl gold-text font-semibold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;