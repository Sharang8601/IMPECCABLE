import { useSelector, useDispatch } from "react-redux";
import { HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineShieldCheck } from "react-icons/hi2";
import { selectCartItems, selectCartTotal, removeLocalItem, clearLocalCart, addLocalItem } from "../../redux/slices/cartSlice";
import { selectIsAuthenticated } from "../../redux/slices/authSlice";
import { formatPrice, getImageUrl, getGoogleLoginUrl } from "../../utils/helpers";
import toast from "react-hot-toast";
import { orderApi } from "../../api/services";

const CartContent = ({ onClose, isSidebar = false }) => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const total = useSelector(selectCartTotal);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      dispatch(removeLocalItem(item.service?._id || item.service));
      return;
    }
    if (newQty > 20) return;
    dispatch(addLocalItem({
      serviceId: item.service?._id || item.service,
      service: item.service || item,
      quantity: delta,
    }));
  };

  const handleRemove = (serviceId) => {
    dispatch(removeLocalItem(serviceId));
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    dispatch(clearLocalCart());
    toast.success("Cart cleared");
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
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit request");
    }
  };

  return (
    <div className={`flex flex-col h-full bg-dark-card rounded-2xl border border-white/5 overflow-hidden ${isSidebar ? 'p-6' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
        <h2 className="font-display text-lg lg:text-xl text-text-primary font-semibold">
          Your Cart ({cartCount})
        </h2>
        {items.length > 0 && (
          <button
            onClick={handleClearCart}
            title="Clear Cart"
            className="p-2 rounded-full hover:bg-dark-800 text-text-secondary hover:text-red-400 transition-colors"
          >
            <HiOutlineTrash className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 min-h-[200px] max-h-[400px] lg:max-h-none scrollbar-thin">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 opacity-20">
              <svg viewBox="0 0 64 64" fill="none">
                <rect width="64" height="64" rx="12" fill="#D4AF37" opacity="0.2"/>
                <path d="M32 10c-6 0-10 4-10 9v5h-3c-2 0-4 2-4 4v20c0 3 2 5 4 5h26c2 0 4-2 4-5V28c0-2-2-4-4-4h-3v-5c0-5-4-9-10-9zm-6 14h-2v-5c0-3 2-5 4-5s4 2 4 5v5h-6zm12 0h-2v-5c0-3 2-5 4-5s4 2 4 5v5h-6z" fill="#D4AF37"/>
              </svg>
            </div>
            <p className="text-text-secondary text-sm">Your cart is empty</p>
            <p className="text-text-secondary/40 text-xs mt-1">Add some services to get started</p>
          </div>
        ) : (
          items.map((item) => {
            const serviceId = item.service?._id || item.service;
            const title = item.title || item.service?.title;
            const price = item.price || item.service?.price;
            const duration = item.duration || item.service?.duration;
            const imgSource = getImageUrl(item.service?.image || item.image) || item.image;

            return (
              <div key={serviceId} className="bg-black/40 rounded-xl p-3.5 border border-white/5 flex gap-4 transition-all hover:border-gold/20">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-dark-800 border border-white/5">
                  <img
                    src={imgSource}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1622288432450-277d0fef5ed6?auto=format&fit=crop&w=900&q=80";
                    }}
                  />
                </div>
                {/* Product Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-semibold text-text-primary truncate">
                      {title}
                    </h3>
                    <span className="text-sm font-bold text-gold shrink-0">
                      {formatPrice(price)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold/60"></span>
                    {duration}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="w-6 h-6 rounded-md bg-dark-800 flex items-center justify-center hover:bg-dark-700 text-text-primary transition-colors border border-white/5"
                      >
                        <HiOutlineMinus className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-xs font-semibold text-text-primary w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="w-6 h-6 rounded-md bg-dark-800 flex items-center justify-center hover:bg-dark-700 text-text-primary transition-colors border border-white/5"
                      >
                        <HiOutlinePlus className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(serviceId)}
                      className="text-text-secondary hover:text-red-400 p-1 transition-colors"
                      title="Remove Item"
                    >
                      <HiOutlineTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Cart Summary & Action */}
      {items.length > 0 && (
        <div className="pt-4 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-text-secondary text-sm font-medium">Total Amount</span>
            <span className="font-display text-2xl text-gold font-bold">{formatPrice(total)}</span>
          </div>

          <button
            onClick={handleSubmitRequest}
            className="w-full btn-gold py-3.5 text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-gold/20"
          >
            {isAuthenticated ? (
              "Submit Request"
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Login to Submit Request
              </>
            )}
          </button>

          <p className="text-text-secondary/40 text-[10px] text-center flex items-center justify-center gap-1">
            <HiOutlineShieldCheck className="w-3.5 h-3.5 text-gold/60 shrink-0" />
            Your details are safe with us
          </p>
        </div>
      )}
    </div>
  );
};

export default CartContent;
