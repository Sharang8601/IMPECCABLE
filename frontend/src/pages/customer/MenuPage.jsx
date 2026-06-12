import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { serviceApi, categoryApi } from "../../api/services";
import {
  setCategories,
  setServices,
  setSelectedCategory,
  selectCategories,
  selectServices,
  selectSelectedCategory,
} from "../../redux/slices/serviceSlice";
import { addLocalItem, selectCartCount, selectCartTotal } from "../../redux/slices/cartSlice";
import { formatPrice, getImageUrl } from "../../utils/helpers";
import toast from "react-hot-toast";
import HeroSection from "../../components/customer/HeroSection";
import CartContent from "../../components/cart/CartContent";
import Logo from "../../components/ui/Logo";
import salonInterior from "../../assets/salon_interior_enhanced.png";
import { 
  HiOutlineClock, 
  HiOutlineShoppingCart,
  HiOutlineSparkles,
  HiOutlineScissors,
  HiOutlineUserGroup,
  HiOutlineHeart
} from "react-icons/hi2";

// Custom inline SVGs for Categories to match reference icons
const ScissorsIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="6" r="3" />
    <circle cx="6" cy="18" r="3" />
    <line x1="8.5" y1="8.5" x2="19" y2="19" />
    <line x1="8.5" y1="15.5" x2="19" y2="5" />
  </svg>
);

const RazorIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M12 7v10m-3 0h6" />
  </svg>
);

const FaceMaskIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11h.01M16 11h.01M9 16c1.5 2 4.5 2 6 0" />
  </svg>
);

const SpaIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 c-1.2 2 -3 3.5 -5 4 c3.5 0 5.5 1.5 5.5 4.5 s-2 3.5 -5.5 3.5 c2.5 0 4.5 1 5.5 3 c1 -2 3 -3 5.5 -3 c-3.5 0 -5.5 -0.5 -5.5 -3.5 s2 -4.5 5.5 -4.5 c-2 -0.5 -3.8 -2 -5 -4 z" />
  </svg>
);

const MakeupIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 4l2 2m-2-2l-8 8M10 10l-4 4m4-4l2 2m-2-2h4v4h-4z" />
  </svg>
);

const BridalIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9V3M9 3h6" />
  </svg>
);

const CrownIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path d="M12 4l3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1 3-6z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Map category names to custom icons
const getCategoryIcon = (name) => {
  const norm = name.toLowerCase();
  if (norm.includes("hair")) return ScissorsIcon;
  if (norm.includes("beard")) return RazorIcon;
  if (norm.includes("facial")) return FaceMaskIcon;
  if (norm.includes("massage") || norm.includes("spa") || norm.includes("waxing")) return SpaIcon;
  if (norm.includes("makeup") || norm.includes("nail")) return MakeupIcon;
  if (norm.includes("bridal")) return BridalIcon;
  return CrownIcon; // fallback
};

const MenuPage = () => {
  const dispatch = useDispatch();
  const { setCartOpen } = useOutletContext();
  const categories = useSelector(selectCategories);
  const services = useSelector(selectServices);
  const selectedCategory = useSelector(selectSelectedCategory);
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);
  
  const [selectedGender, setSelectedGender] = useState("Male");
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
      } catch (err) {
        toast.error("Failed to load salon catalog");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch]);

  // Dynamic categories filtered by current gender
  const activeCategoriesForGender = categories.filter(
    (cat) => cat.gender === selectedGender && cat.isActive
  );

  // Automatically select first category when gender or categories list updates
  useEffect(() => {
    if (activeCategoriesForGender.length > 0) {
      const isStillActive = activeCategoriesForGender.some(
        (cat) => cat._id === selectedCategory
      );
      if (!isStillActive) {
        dispatch(setSelectedCategory(activeCategoriesForGender[0]._id));
      }
    } else {
      dispatch(setSelectedCategory(null));
    }
  }, [selectedGender, categories, dispatch]);

  // Filter services dynamically by gender and categoryId
  const filteredServices = services.filter((s) => {
    if (!s.isActive) return false;
    
    const genderMatch = s.gender === selectedGender;
    const sCatId = s.categoryId?._id || s.categoryId || s.category?._id || s.category;
    const categoryMatch = selectedCategory ? sCatId === selectedCategory : true;
    
    return genderMatch && categoryMatch;
  });

  const handleAddToCart = (service) => {
    dispatch(addLocalItem({
      serviceId: service._id,
      service: {
        _id: service._id,
        title: service.name || service.title,
        price: service.price,
        mrp: service.mrp,
        duration: service.duration,
        image: service.image?.url || service.image,
      },
      quantity: 1,
    }));
    toast.success(`${service.name || service.title} added to cart`);
  };

  return (
    <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left main content block */}
        <div className="lg:col-span-8 space-y-12">
          
          <HeroSection 
            selectedGender={selectedGender}
            onGenderChange={(gender) => {
              setSelectedGender(gender);
            }}
          />

          <section id="services" className="py-6 scroll-mt-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-8"
            >
              <h2 className="font-display text-2xl lg:text-3xl gold-text mb-3">
                Our Premium Services
              </h2>
              <p className="text-text-secondary text-sm max-w-xl mx-auto">
                Discover our curated menu of luxury grooming and beauty services crafted for the modern individual.
              </p>
            </motion.div>

            {/* Dynamic Category Filters */}
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              {activeCategoriesForGender.map((cat) => {
                const isActive = selectedCategory === cat._id;
                const IconComponent = getCategoryIcon(cat.name);

                return (
                  <button
                    key={cat._id}
                    onClick={() => dispatch(setSelectedCategory(cat._id))}
                    className={`px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 border ${
                      isActive
                        ? "border-gold text-gold bg-gold/10 shadow-sm"
                        : "bg-dark-800 text-text-secondary border-white/5 hover:border-white/20 hover:text-text-primary"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Service Grid */}
            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => {
                  const hasMrp = service.mrp && service.mrp > service.price;
                  const mrpVal = hasMrp ? service.mrp : Math.ceil(service.price * 1.25);
                  const discountPercent = Math.round(((mrpVal - service.price) / mrpVal) * 100);
                  const sName = service.name || service.title;

                  return (
                    <motion.div
                      key={service._id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="card-premium overflow-hidden group border border-white/5 rounded-2xl flex flex-col justify-between relative"
                    >
                      {/* Discount Badge */}
                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-1 rounded-md shadow-md">
                          {discountPercent}% OFF
                        </span>
                      </div>

                      <div className="relative h-44 overflow-hidden rounded-t-2xl">
                        <img
                          src={getImageUrl(service.image)}
                          alt={sName}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=900&q=80";
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-transparent to-transparent" />
                      </div>
                      
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-display text-base font-semibold text-text-primary mb-1">
                            {sName}
                          </h3>
                          <p className="text-text-secondary text-xs leading-relaxed mb-4 line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary text-xs flex items-center gap-1.5">
                              <HiOutlineClock className="w-3.5 h-3.5" />
                              {service.duration}
                            </span>
                            <div className="text-right">
                              <p className="line-through text-text-secondary text-[10px] leading-none mb-0.5">
                                {formatPrice(mrpVal)}
                              </p>
                              <p className="font-display text-lg gold-text font-bold leading-none">
                                {formatPrice(service.price)}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAddToCart(service)}
                            className="w-full border border-gold text-gold hover:bg-gold hover:text-black rounded-lg py-2.5 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2"
                          >
                            <HiOutlineShoppingCart className="w-4 h-4" />
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {!loading && filteredServices.length === 0 && (
              <div className="text-center py-20">
                <p className="text-text-secondary text-sm">No services found for this selection.</p>
              </div>
            )}
          </section>

          {/* Features Highlights footer block */}
          <section className="py-10 border-t border-white/5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 mb-3">
                  <HiOutlineHeart className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-xs font-bold text-text-primary tracking-wide mb-1">Premium Products</h4>
                <p className="text-[10px] text-text-secondary leading-normal max-w-[150px]">We use top quality products for the best results.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 mb-3">
                  <HiOutlineScissors className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-xs font-bold text-text-primary tracking-wide mb-1">Expert Stylists</h4>
                <p className="text-[10px] text-text-secondary leading-normal max-w-[150px]">Trained professionals who understand your style.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 mb-3">
                  <HiOutlineSparkles className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-xs font-bold text-text-primary tracking-wide mb-1">Hygienic & Safe</h4>
                <p className="text-[10px] text-text-secondary leading-normal max-w-[150px]">Clean, sanitized & safe environment always.</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="w-12 h-12 rounded-full bg-gold/5 flex items-center justify-center border border-gold/20 mb-3">
                  <HiOutlineUserGroup className="w-5 h-5 text-gold" />
                </div>
                <h4 className="text-xs font-bold text-text-primary tracking-wide mb-1">Unisex Salon</h4>
                <p className="text-[10px] text-text-secondary leading-normal max-w-[150px]">Perfect grooming experience for both Men & Women.</p>
              </div>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="py-12 border-t border-white/5 scroll-mt-24">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl lg:text-3xl gold-text mb-5">
                  About Impeccable
                </h2>
                <p className="text-text-secondary text-sm leading-relaxed mb-4">
                  At Impeccable Unisex Salon, we blend precision, artistry, and luxury into every service we offer. 
                  Our expert stylists and therapists are dedicated to delivering a premium experience that leaves 
                  you looking and feeling your absolute best.
                </p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  From sharp grooming rituals for men to indulgent beauty therapies for women, every visit 
                  to Impeccable is designed to elevate your confidence and redefine your personal style.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                  <img
                    src={salonInterior}
                    alt="Impeccable Salon Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-12 border-t border-white/5 scroll-mt-24">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="font-display text-2xl lg:text-3xl gold-text mb-4">
                  Get In Touch
                </h2>
                <p className="text-text-secondary text-sm mb-8 max-w-lg mx-auto">
                  Want to know more about our services or book a personalized consultation? 
                  We'd love to hear from you.
                </p>
                <div className="grid sm:grid-cols-2 gap-6 text-left">
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Visit Us</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">123 Luxury Avenue,<br />Mumbai, India</p>
                  </div>
                  <div className="bg-dark-card border border-white/5 rounded-2xl p-6">
                    <h3 className="text-xs font-bold text-gold uppercase tracking-wider mb-2">Contact</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">+91 98765 43210<br />hello@impeccable.in</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-white/5 py-10 text-center flex flex-col items-center gap-4">
            {/* Footer logo */}
            <div className="w-20 h-20 select-none opacity-85 hover:opacity-100 transition-opacity">
              <Logo />
            </div>
            <p className="text-text-secondary text-xs">
              &copy; {new Date().getFullYear()} Impeccable Unisex Salon. All rights reserved.
            </p>
          </footer>
        </div>

        {/* Right Column: Persistent Cart Sidebar on Desktop */}
        <div className="hidden lg:block lg:col-span-4 sticky top-24 self-start">
          <CartContent isSidebar={true} />
        </div>
      </div>

      {/* Floating Sticky Bottom Cart Banner for Mobile/Tablet */}
      {cartCount > 0 && (
        <div className="lg:hidden fixed bottom-6 left-6 right-6 z-40">
          <button
            onClick={() => setCartOpen(true)}
            className="w-full gold-gradient text-black rounded-full font-bold px-6 py-4 flex justify-between items-center shadow-2xl transition-transform active:scale-95 animate-fade-in hover:scale-105"
          >
            <span className="flex items-center gap-2">
              <HiOutlineShoppingCart className="w-5 h-5" />
              <span className="text-sm">View Cart ({cartCount})</span>
            </span>
            <span className="text-sm font-extrabold">{formatPrice(cartTotal)}</span>
          </button>
        </div>
      )}
    </main>
  );
};

export default MenuPage;