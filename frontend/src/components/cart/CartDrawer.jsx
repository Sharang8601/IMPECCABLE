import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark, HiOutlineTrash, HiOutlineMinus, HiOutlinePlus } from "react-icons/hi2";
import { selectCartItems, selectCartTotal, removeLocalItem, clearLocalCart, addLocalItem } from "../../redux/slices/cartSlice";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";
import { formatPrice, getImageUrl, getGoogleLoginUrl } from "../../utils/helpers";
import toast from "react-hot-toast";
import { orderApi } from "../../api/services";

const CartDrawer = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      dispatch(removeLocalItem(item.service?._id || item.service));
      return;
    }
    if (newQty > 20) return;
    dispatch(addLocalItem({
      serviceId: item.service?._id || item.service,
      service: item.service,
      quantity: delta,
    }));
  };

  const handleRemove = (serviceId) => {
    dispatch(removeLocalItem(serviceId));
    toast.success("Item removed from cart");
  };

  const handleSubmitRequest = async () => {
    if (!isAuthenticated) {
      window.location.href = getGoogleLoginUrl(window.location.pathname);
      return;
    }

    try {
      const payload = {
        items: items.map((item) => ({
          serviceId: item.service?._id || item.service,
          quantity: item.quantity,
        })),
      };

      await orderApi.create(payload);
      dispatch(clearLocalCart());
      toast.success("Service request submitted successfully!");
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-dark-card border-l border-white/5 z-[70] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-white/5">
              <div>
                <h2 className="font-display text-xl gold-text font-semibold">Your Cart</h2>
                <p className="text-text-secondary text-xs">{items.length} items</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center hover:bg-dark-700 transition-colors"
              >
                <HiOutlineXMark className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 opacity-30">
                    <svg viewBox="0 0 64 64" fill="none">
                      <rect width="64" height="64" rx="12" fill="#D4AF37" opacity="0.2"/>
                      <path d="M32 10c-6 0-10 4-10 9v5h-3c-2 0-4 2-4 4v20c0 3 2 5 4 5h26c2 0 4-2 4-5V28c0-2-2-4-4-4h-3v-5c0-5-4-9-10-9zm-6 14h-2v-5c0-3 2-5 4-5s4 2 4 5v5h-6zm12 0h-2v-5c0-3 2-5 4-5s4 2 4 5v5h-6z" fill="#D4AF37"/>
                    </svg>
                  </div>
                  <p className="text-text-secondary text-sm">Your cart is empty</p>
                  <p className="text-text-secondary/50 text-xs mt-1">Add some premium services to get started</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.service?._id || item.service} className="card-premium p-4 flex gap-4">
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={getImageUrl(item.service?.image) || (typeof item.image === 'string' ? item.image : '')}
                        alt={item.title || item.service?.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-text-primary truncate">
                        {item.title || item.service?.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">{item.service?.duration || item.duration}</p>
                      <p className="text-sm gold-text font-bold mt-1">
                        {formatPrice(item.service?.price || item.price)}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <button
                          onClick={() => handleQuantityChange(item, -1)}
                          className="w-7 h-7 rounded-full bg-dark-800 flex items-center justify-center hover:bg-dark-700 transition-colors"
                        >
                          <HiOutlineMinus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item, 1)}
                          className="w-7 h-7 rounded-full bg-dark-800 flex items-center justify-center hover:bg-dark-700 transition-colors"
                        >
                          <HiOutlinePlus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemove(item.service?._id || item.service)}
                          className="ml-auto text-red-400/70 hover:text-red-400 transition-colors"
                        >
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-white/5 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Total Amount</span>
                  <span className="font-display text-2xl gold-text font-bold">{formatPrice(total)}</span>
                </div>

                <button
                  onClick={handleSubmitRequest}
                  className="w-full btn-gold py-3.5 text-base flex items-center justify-center gap-2"
                >
                  {isAuthenticated ? (
                    "Submit Service Request"
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Login with Google to Submit
                    </>
                  )}
                </button>
                <p className="text-text-secondary/50 text-xs text-center">
                  {!isAuthenticated && "Only login is required at the time of submission."}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;