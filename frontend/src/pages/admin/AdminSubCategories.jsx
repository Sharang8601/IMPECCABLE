import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { subCategoryApi, categoryApi } from "../../api/services";
import toast from "react-hot-toast";

const AdminSubCategories = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", category: "" });

  const fetchData = () => {
    Promise.all([
      subCategoryApi.listAdmin(),
      categoryApi.listAdmin(),
    ])
      .then(([subRes, catRes]) => {
        setItems(subRes.data.data);
        setCategories(catRes.data.data);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category) return toast.error("Name and category are required");

    try {
      if (editing) {
        await subCategoryApi.update(editing._id, form);
        toast.success("Sub category updated");
      } else {
        await subCategoryApi.create(form);
        toast.success("Sub category created");
      }
      setForm({ name: "", description: "", category: "" });
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setForm({ name: item.name, description: item.description || "", category: item.category?._id || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this sub category?")) return;
    try {
      await subCategoryApi.remove(id);
      toast.success("Deleted");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl gold-text font-semibold mb-8">Sub Categories</h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6 mb-8 max-w-xl"
      >
        <h2 className="text-sm font-semibold text-text-primary mb-4">
          {editing ? "Edit Sub Category" : "Create Sub Category"}
        </h2>
        <div className="space-y-4">
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="input-dark"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Sub Category Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input-dark"
          />
          <textarea
            placeholder="Description (optional)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input-dark resize-none"
            rows={2}
          />
          <div className="flex gap-3">
            <button type="submit" className="btn-gold text-sm py-2.5 flex-1">
              {editing ? "Update" : "Create"}
            </button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm({ name: "", description: "", category: "" }); }} className="btn-dark text-sm py-2.5">
                Cancel
              </button>
            )}
          </div>
        </div>
      </motion.form>

      <div className="grid gap-4">
        {items.map((item) => (
          <motion.div key={item._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{item.name}</h3>
              <p className="text-xs text-text-secondary mt-0.5">{item.category?.name} {item.description && `- ${item.description}`}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(item)} className="text-xs text-gold hover:text-gold-hover px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10 transition-colors">Edit</button>
              <button onClick={() => handleDelete(item._id)} className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-lg bg-red-400/5 hover:bg-red-400/10 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminSubCategories;