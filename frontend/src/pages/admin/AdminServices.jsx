import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { serviceApi, categoryApi } from "../../api/services";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import toast from "react-hot-toast";

const INIT_FORM = { 
  name: "", 
  description: "", 
  price: "", 
  mrp: "", 
  duration: "", 
  imageUrl: "", 
  gender: "Male", 
  category: "", 
  isActive: true 
};

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INIT_FORM);
  const [imageFile, setImageFile] = useState(null);

  const fetchData = () => {
    Promise.all([
      serviceApi.listAdmin(),
      categoryApi.listAdmin(),
    ])
      .then(([srvRes, catRes]) => {
        setServices(srvRes.data.data);
        setCategories(catRes.data.data);
      })
      .catch(() => toast.error("Failed to load catalog data"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchData(); 
  }, []);

  // Filter category options based on currently selected Gender
  const filteredCategories = categories.filter((cat) => cat.gender === form.gender);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.category) {
      return toast.error("Name, price, and category are required");
    }

    try {
      const fd = new FormData();
      fd.append("name", form.name.trim());
      fd.append("title", form.name.trim()); // back-compatibility sync
      fd.append("description", form.description.trim());
      fd.append("price", form.price);
      fd.append("mrp", form.mrp || form.price);
      fd.append("duration", form.duration);
      fd.append("gender", form.gender);
      fd.append("categoryId", form.category);
      fd.append("category", form.category); // back-compatibility sync
      fd.append("isActive", form.isActive);
      if (form.imageUrl) fd.append("imageUrl", form.imageUrl.trim());
      if (imageFile) fd.append("image", imageFile);

      if (editing) {
        await serviceApi.update(editing._id, fd);
        toast.success("Service updated");
      } else {
        await serviceApi.create(fd);
        toast.success("Service created");
      }
      setForm(INIT_FORM);
      setEditing(null);
      setImageFile(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (service) => {
    setEditing(service);
    setForm({
      name: service.name || service.title,
      description: service.description || "",
      price: service.price || "",
      mrp: service.mrp || "",
      duration: service.duration || "",
      imageUrl: "",
      gender: service.gender || "Male",
      category: service.categoryId?._id || service.category?._id || "",
      isActive: service.isActive !== false,
    });
    setImageFile(null);
  };

  const handleToggle = async (id) => {
    try {
      await serviceApi.toggle(id);
      toast.success("Service status updated");
      fetchData();
    } catch (err) {
      toast.error("Status toggle failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await serviceApi.remove(id);
      toast.success("Service deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
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
      <h1 className="font-display text-2xl gold-text font-semibold mb-8">Services</h1>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-premium p-6 mb-8 max-w-xl"
      >
        <h2 className="text-sm font-semibold text-text-primary mb-4">
          {editing ? "Edit Service" : "Create Service"}
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1">Service Name</label>
            <input 
              type="text" 
              placeholder="e.g. Premium Hair Cut" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              className="input-dark" 
            />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Description</label>
            <textarea 
              placeholder="Provide service highlights..." 
              value={form.description} 
              onChange={(e) => setForm({ ...form, description: e.target.value })} 
              className="input-dark resize-none" 
              rows={2.5} 
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Price (₹)</label>
              <input 
                type="number" 
                placeholder="299" 
                value={form.price} 
                onChange={(e) => setForm({ ...form, price: e.target.value })} 
                className="input-dark" 
              />
            </div>
            
            <div>
              <label className="block text-xs text-text-secondary mb-1">MRP (₹)</label>
              <input 
                type="number" 
                placeholder="399" 
                value={form.mrp} 
                onChange={(e) => setForm({ ...form, mrp: e.target.value })} 
                className="input-dark" 
              />
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Duration</label>
              <input 
                type="text" 
                placeholder="e.g. 30 min" 
                value={form.duration} 
                onChange={(e) => setForm({ ...form, duration: e.target.value })} 
                className="input-dark" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1">Gender Selector</label>
              <select 
                value={form.gender} 
                onChange={(e) => setForm({ ...form, gender: e.target.value, category: "" })} 
                className="input-dark"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-text-secondary mb-1">Service Category</label>
              <select 
                value={form.category} 
                onChange={(e) => setForm({ ...form, category: e.target.value })} 
                className="input-dark"
              >
                <option value="">Select Category</option>
                {filteredCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Service Image URL (Optional)</label>
            <input 
              type="text" 
              placeholder="https://example.com/service.jpg" 
              value={form.imageUrl} 
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} 
              className="input-dark" 
            />
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1">Or Upload Image File</label>
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
              id="serviceIsActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 rounded border-white/10 bg-dark-800 text-gold focus:ring-gold focus:ring-offset-dark-900"
            />
            <label htmlFor="serviceIsActive" className="text-xs text-text-primary select-none cursor-pointer">
              Active (Visible in client catalog)
            </label>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn-gold text-sm py-2.5 flex-1">
              {editing ? "Update Service" : "Create Service"}
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
        {services.map((service) => {
          const catName = service.categoryId?.name || service.category?.name || "Uncategorized";
          const sName = service.name || service.title;
          
          return (
            <motion.div 
              key={service._id} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="card-premium p-5 flex items-center gap-4"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-dark-800 border border-white/10">
                <img 
                  src={getImageUrl(service.image)} 
                  alt={sName} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=100&q=80";
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-text-primary truncate">{sName}</h3>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${service.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {service.isActive ? "Active" : "Disabled"}
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Gender: <span className="text-gold font-semibold">{service.gender}</span> · Category: {catName} · Duration: {service.duration} 
                  <span className="ml-2.5 font-bold text-text-primary">{formatPrice(service.price)}</span>
                  {service.mrp && service.mrp > service.price && (
                    <span className="ml-1.5 line-through text-[10px] text-text-secondary">{formatPrice(service.mrp)}</span>
                  )}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleToggle(service._id)} 
                  className="text-xs text-gold hover:text-gold-hover px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10 transition-colors"
                >
                  {service.isActive ? "Disable" : "Enable"}
                </button>
                <button 
                  onClick={() => handleEdit(service)} 
                  className="text-xs text-gold hover:text-gold-hover px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10 transition-colors"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(service._id)} 
                  className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-lg bg-red-400/5 hover:bg-red-400/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminServices;