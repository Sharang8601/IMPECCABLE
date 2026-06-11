import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { serviceApi, categoryApi, subCategoryApi } from "../../api/services";
import {
  setCategories,
  setSubCategories,
  setServices,
  setSelectedCategory,
  setSelectedSubCategory,
  selectCategories,
  selectSubCategories,
  selectServices,
  selectSelectedCategory,
  selectSelectedSubCategory,
} from "../../redux/slices/serviceSlice";
import { addLocalItem } from "../../redux/slices/cartSlice";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import toast from "react-hot-toast";
import HeroSection from "../../components/customer/HeroSection";

const MenuPage = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);
  const services = useSelector(selectServices);
  const selectedCategory = useSelector(selectSelectedCategory);
  const selectedSubCategory = useSelector(selectSelectedSubCategory);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, servRes] = await Promise.all([
          categoryApi.list(),
          serviceApi.list(),
        ]);
        dispatch(setCategories(catRes.data.data));
        dispatch(setServices(servRes.data.data));
        if (catRes.data.data.length > 0) {
          dispatch(setSelectedCategory(catRes.data.data[0].slug));
        }
      } catch (err) {
        toast.error("Failed to load services");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  useEffect(() => {
    if (selectedCategory) {
      subCategoryApi.list({ category: selectedCategory }).then((res) => {
        dispatch(setSubCategories(res.data.data));
      }).catch(() => {});
    }
  }, [selectedCategory, dispatch]);

  const filteredServices = services.filter((s) => {
    const catMatch = selectedCategory ? s.category?.slug === selectedCategory : true;
    const subMatch = selectedSubCategory ? s.subCategory?.slug === selectedSubCategory : true;
    return catMatch && subMatch;
  });

  const handleAddToCart = (service) => {
    dispatch(addLocalItem({
      serviceId: service._id,
      service: {
        _id: service._id,
        title: service.title,
        price: service.price,
        duration: service.duration,
        image: service.image,
      },
      quantity: 1,
    }));
    toast.success(`${service.title} added to cart`);
  };

  return (
    <main>
      <HeroSection />

      <section id="services" className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl lg:text-4xl gold-text mb-4">
              Our Premium Services
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Discover our curated menu of luxury grooming and beauty services crafted for the modern individual.
            </p>
          </motion.div>

          {/* Gender Toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-dark-800 rounded-full p-1 border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => dispatch(setSelectedCategory(cat.slug))}
                  className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat.slug
                      ? "gold-gradient text-black shadow-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {subCategories.map((sub) => (
              <button
                key={sub.slug}
                onClick={() => dispatch(setSelectedSubCategory(selectedSubCategory === sub.slug ? null : sub.slug))}
                className={`px-5 py-2 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedSubCategory === sub.slug
                    ? "bg-gold/20 text-gold border border-gold/40"
                    : "bg-dark-800 text-text-secondary border border-white/5 hover:border-white/20"
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>

          {/* Service Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card-premium overflow-hidden group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImageUrl(service.image)}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-semibold text-text-primary mb-1.5">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-xs leading-relaxed mb-4 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-text-secondary text-xs">{service.duration}</span>
                      <span className="font-display text-xl gold-text font-bold">
                        {formatPrice(service.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(service)}
                      className="w-full btn-gold text-sm py-2.5"
                    >
                      Add To Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!loading && filteredServices.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-secondary">No services found for this selection.</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl lg:text-4xl gold-text mb-6">
                About Impeccable
              </h2>
              <p className="text-text-secondary leading-relaxed mb-6">
                At Impeccable Unisex Salon, we blend precision, artistry, and luxury into every service we offer. 
                Our expert stylists and therapists are dedicated to delivering a premium experience that leaves 
                you looking and feeling your absolute best.
              </p>
              <p className="text-text-secondary leading-relaxed">
                From sharp grooming rituals for men to indulgent beauty therapies for women, every visit 
                to Impeccable is designed to elevate your confidence and redefine your personal style.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury salon interior"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 gold-gradient rounded-xl opacity-20 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 lg:py-24 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl lg:text-4xl gold-text mb-6">
              Get In Touch
            </h2>
            <p className="text-text-secondary mb-8 max-w-xl mx-auto">
              Want to know more about our services or book a personalized consultation? 
              We'd love to hear from you.
            </p>
            <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto text-left">
              <div className="card-premium p-6">
                <h3 className="text-sm font-semibold text-gold mb-2">Visit Us</h3>
                <p className="text-text-secondary text-sm">123 Luxury Avenue,<br />Mumbai, India</p>
              </div>
              <div className="card-premium p-6">
                <h3 className="text-sm font-semibold text-gold mb-2">Contact</h3>
                <p className="text-text-secondary text-sm">+91 98765 43210<br />hello@impeccable.in</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Impeccable Unisex Salon. All rights reserved.
          </p>
          <p className="text-text-secondary/50 text-xs mt-1">
            Style that defines you. Confidence that stays with you.
          </p>
        </div>
      </footer>
    </main>
  );
};

export default MenuPage;