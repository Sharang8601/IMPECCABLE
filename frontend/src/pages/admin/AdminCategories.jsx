import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { categoryApi } from "../../api/services";
import toast from "react-hot-toast";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchCategories = () => {
    categoryApi.listAdmin()
      .then((res) => setCategories(res.data.data))
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Name is required");

    try {
      if (editing) {
        await categoryApi.update(editing._id, form);
        toast.success("Category updated");
      } else {
        await categoryApi.create(form);
        toast.success("Category created");
      }
      setForm({ name: "", description: "" });
      setEditing(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, description: cat.description || "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await categoryApi.remove(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <h1 className="font-display text-2xl gold-text font-semibold mb-8">Categories</h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6 mb-8 max-w-xl"
      >
        <h2 className="text-sm font-semibold text-text-primary mb-4">
          {editing ? "Edit Category" : "Create Category"}
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Category Name"
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
              <button type="button" onClick={() => { setEditing(null); setForm({ name: "", description: "" }); }} className="btn-dark text-sm py-2.5">
                Cancel
              </button>
            )}
          </div>
        </div>
      </motion.form>

      <div className="grid gap-4">
        {categories.map((cat) => (
          <motion.div
            key={cat._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-premium p-5 flex items-center justify-between"
          >
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{cat.name}</h3>
              {cat.description && <p className="text-xs text-text-secondary mt-0.5">{cat.description}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(cat)} className="text-xs text-gold hover:text-gold-hover px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10 transition-colors">
                Edit
              </button>
              <button onClick={() => handleDelete(cat._id)} className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-lg bg-red-400/5 hover:bg-red-400/10 transition-colors">
                Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminCategories;