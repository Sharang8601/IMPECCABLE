import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark } from "react-icons/hi2";
import CartContent from "./CartContent";

const CartDrawer = ({ open, onClose }) => {
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
            className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-dark-card border-l border-white/5 z-[70] flex flex-col p-5"
          >
            {/* Close button at top-right */}
            <div className="flex justify-end mb-2">
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center hover:bg-dark-700 transition-colors border border-white/5"
              >
                <HiOutlineXMark className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Cart Content wrapper */}
            <div className="flex-1 overflow-y-auto">
              <CartContent onClose={onClose} isSidebar={false} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;