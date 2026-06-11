import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { adminApi } from "../../api/services";
import toast from "react-hot-toast";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.customers()
      .then((res) => setCustomers(res.data.data))
      .catch(() => toast.error("Failed to load customers"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl gold-text font-semibold mb-8">Customers</h1>

      <div className="grid gap-4">
        {customers.map((customer) => (
          <motion.div
            key={customer._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-5 flex items-center gap-4"
          >
            {customer.avatar && (
              <img src={customer.avatar} alt="" className="w-10 h-10 rounded-full" />
            )}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-text-primary">{customer.name}</h3>
              <p className="text-xs text-text-secondary">{customer.email}</p>
            </div>
            <span className="text-[10px] text-text-secondary">{new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          </motion.div>
        ))}
        {customers.length === 0 && (
          <p className="text-text-secondary text-sm text-center py-10">No customers yet.</p>
        )}
      </div>
    </div>
  );
};

export default AdminCustomers;