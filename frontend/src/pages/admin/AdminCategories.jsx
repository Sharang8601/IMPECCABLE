import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { categoryApi } from "../../api/services";
import { getImageUrl } from "../../utils/helpers";
import toast from "react-hot-toast";

const INIT_FORM = { name: "", gender: "Male", displayOrder: "0", imageUrl: "", isActive: true };

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INIT_FORM);
  const [imageFile, setImageFile] = useState(null);

  const fetchCategories = () => {
    categoryApi.listAdmin()
      .then((res) => {
        setCategories(res.data.data);
      })
      .catch(() => toast.error("Failed to load categories"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return toast.error("Category name is required");

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("gender", form.gender);
      fd.append("displayOrder", form.displayOrder);
      fd.append("isActive", form.isActive);
      if (form.imageUrl) fd.append("imageUrl", form.imageUrl.trim());
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await categoryApi.update(editing._id, fd);
        toast.success("Category updated");
      } else {
        await categoryApi.create(fd);
        toast.success("Category created");
      }
      setForm(INIT_FORM);
      setImageFile(null);
      setEditing(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (cat) => {
    setEditing(cat);
    setForm({
      name: cat.name,
      gender: cat.gender || "Male",
      displayOrder: String(cat.displayOrder ?? 0),
      imageUrl: "",
      isActive: cat.isActive !== false,
    });
    setImageFile(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category? Services belonging to it may not render properly.")) return;
    try {
      await categoryApi.remove(id);
      toast.success("Category deleted");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl gold-text font-semibold">Categories</h1>
      </div>

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
          <div>
            <label className="block text-xs text-text-secondary mb-1">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Hair, Beard, Facial"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="input-dark"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Gender Group</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="input-dark"
              >
                <option value="Male">Men (Male)</option>
                <option value="Female">Women (Female)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Display Order</label>
              <input
                type="number"
                placeholder="0"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
                className="input-dark"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Category Image URL (Optional)</label>
            <input
              type="text"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="input-dark"
            />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Or Upload File</label>
            <input 
              type="file" 
              accept="image/*" 
              onChange={(e) => setImageFile(e.target.files[0])} 
              className="text-xs text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gold/10 file:text-gold hover:file:bg-gold/20" 
            />
          </div>

          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-dark-800 text-gold focus:ring-gold focus:ring-offset-dark-900"
            />
            <label htmlFor="isActive" className="text-xs text-text-primary select-none cursor-pointer">
              Active (Visible in client catalog)
            </label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="btn-gold text-sm py-2.5 flex-1">
              {editing ? "Update Category" : "Create Category"}
            </button>
            {editing && (
              <button 
                type="button" 
                onClick={() => { setEditing(null); setForm(INIT_FORM); setImageFile(null); }} 
                className="btn-dark text-sm py-2.5"
              >
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
            className="card-premium p-5 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-dark-800 flex items-center justify-center">
                <img 
                  src={getImageUrl(cat.image)} 
                  alt="" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=100&q=80";
                  }}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text-primary">{cat.name}</h3>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${cat.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {cat.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary mt-1">
                  Gender: <span className="text-gold font-semibold">{cat.gender}</span> · Order: {cat.displayOrder ?? 0}
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
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