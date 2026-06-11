import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { orderApi } from "../../api/services";
import { formatPrice } from "../../utils/helpers";
import toast from "react-hot-toast";

const statusColors = {
  Pending: "bg-gold/10 text-gold",
  Contacted: "bg-blue-500/10 text-blue-400",
  Completed: "bg-green-500/10 text-green-400",
  Cancelled: "bg-red-500/10 text-red-400",
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    orderApi.listAdmin()
      .then((res) => setOrders(res.data.data))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await orderApi.updateStatus(id, status);
      toast.success("Status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl gold-text font-semibold mb-8">Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div key={order._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-5">
            <div className="flex flex-col lg:flex-row lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {order.customerAvatar && (
                    <img src={order.customerAvatar} alt="" className="w-8 h-8 rounded-full" />
                  )}
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{order.customerName}</h3>
                    <p className="text-xs text-text-secondary">{order.customerEmail}</p>
                  </div>
                </div>
                <div className="text-xs text-text-secondary space-y-0.5">
                  {order.services?.map((item, idx) => (
                    <p key={idx}>{item.title} × {item.quantity} — {formatPrice(item.lineTotal)}</p>
                  ))}
                </div>
                <p className="text-sm font-semibold gold-text mt-2">Total: {formatPrice(order.totalAmount)}</p>
                <p className="text-[10px] text-text-secondary mt-1">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[10px] px-3 py-1 rounded-full font-medium ${statusColors[order.status] || statusColors.Pending}`}>
                  {order.status}
                </span>
                <select
                  value=""
                  onChange={(e) => { if (e.target.value) handleStatusChange(order._id, e.target.value); }}
                  className="bg-dark-800 border border-white/10 rounded-lg text-xs text-text-secondary px-3 py-1.5 focus:outline-none focus:border-gold/40"
                >
                  <option value="">Change</option>
                  <option value="Pending">Pending</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </motion.div>
        ))}
        {orders.length === 0 && !loading && (
          <p className="text-text-secondary text-sm text-center py-10">No orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;