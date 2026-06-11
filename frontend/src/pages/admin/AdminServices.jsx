import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { serviceApi, categoryApi, subCategoryApi } from "../../api/services";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import toast from "react-hot-toast";

const INIT_FORM = { title: "", description: "", price: "", duration: "", imageUrl: "", category: "", subCategory: "" };

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(INIT_FORM);
  const [imageFile, setImageFile] = useState(null);

  const fetchData = () => {
    Promise.all([
      serviceApi.listAdmin(),
      categoryApi.listAdmin(),
      subCategoryApi.listAdmin(),
    ])
      .then(([srvRes, catRes, subRes]) => {
        setServices(srvRes.data.data);
        setCategories(catRes.data.data);
        setSubCategories(subRes.data.data);
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const filteredSubs = subCategories.filter((sub) => sub.category?._id === form.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.category || !form.subCategory) {
      return toast.error("Fill required fields");
    }

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("duration", form.duration);
      fd.append("category", form.category);
      fd.append("subCategory", form.subCategory);
      if (form.imageUrl) fd.append("imageUrl", form.imageUrl);
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
      title: service.title,
      description: service.description,
      price: service.price,
      duration: service.duration,
      imageUrl: "",
      category: service.category?._id || "",
      subCategory: service.subCategory?._id || "",
    });
  };

  const handleToggle = async (id) => {
    try {
      await serviceApi.toggle(id);
      toast.success("Toggled");
      fetchData();
    } catch (err) {
      toast.error("Toggle failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await serviceApi.remove(id);
      toast.success("Deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" /></div>;

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
          <input type="text" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-dark" />
          <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-dark resize-none" rows={2} />
          <div className="grid grid-cols-2 gap-4">
            <input type="number" placeholder="Price (₹)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-dark" />
            <input type="text" placeholder="Duration (e.g. 30 min)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="input-dark" />
          </div>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value, subCategory: "" })} className="input-dark">
            <option value="">Select Category</option>
            {categories.map((cat) => (<option key={cat._id} value={cat._id}>{cat.name}</option>))}
          </select>
          <select value={form.subCategory} onChange={(e) => setForm({ ...form, subCategory: e.target.value })} className="input-dark">
            <option value="">Select Sub Category</option>
            {filteredSubs.map((sub) => (<option key={sub._id} value={sub._id}>{sub.name}</option>))}
          </select>
          <input type="text" placeholder="Image URL (optional, if no file upload)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="input-dark" />
          <div>
            <label className="block text-xs text-text-secondary mb-1">Or upload image:</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs text-text-secondary file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-gold/10 file:text-gold hover:file:bg-gold/20" />
          </div>
          <div className="flex gap-3">
            <button type="submit" className="btn-gold text-sm py-2.5 flex-1">{editing ? "Update" : "Create"}</button>
            {editing && (
              <button type="button" onClick={() => { setEditing(null); setForm(INIT_FORM); setImageFile(null); }} className="btn-dark text-sm py-2.5">Cancel</button>
            )}
          </div>
        </div>
      </motion.form>

      <div className="grid gap-4">
        {services.map((service) => (
          <motion.div key={service._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-premium p-5 flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <img src={getImageUrl(service.image)} alt={service.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-text-primary">{service.title}</h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${service.isActive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {service.isActive ? "Active" : "Disabled"}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-0.5">{service.category?.name} / {service.subCategory?.name} · {service.duration} · {formatPrice(service.price)}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => handleToggle(service._id)} className="text-xs text-gold hover:text-gold-hover px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10 transition-colors">
                {service.isActive ? "Disable" : "Enable"}
              </button>
              <button onClick={() => handleEdit(service)} className="text-xs text-gold hover:text-gold-hover px-3 py-1.5 rounded-lg bg-gold/5 hover:bg-gold/10 transition-colors">Edit</button>
              <button onClick={() => handleDelete(service._id)} className="text-xs text-red-400/70 hover:text-red-400 px-3 py-1.5 rounded-lg bg-red-400/5 hover:bg-red-400/10 transition-colors">Delete</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;