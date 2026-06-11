import { useSelector } from "react-redux";
import { selectCartCount } from "../../redux/slices/cartSlice";
import { HiOutlineShoppingBag, HiOutlineScissors } from "react-icons/hi2";
import Logo from "../ui/Logo";

const Navbar = ({ onCartClick }) => {
  const cartCount = useSelector(selectCartCount);

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12">
              <Logo />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display text-lg lg:text-xl gold-text font-semibold">
                Impeccable
              </h1>
              <p className="text-[10px] text-text-secondary tracking-widest uppercase hidden lg:block">
                Unisex Salon
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-sm text-text-secondary hover:text-gold transition-colors">
              Home
            </a>
            <a href="#services" className="text-sm text-text-secondary hover:text-gold transition-colors">
              Services
            </a>
            <a href="#about" className="text-sm text-text-secondary hover:text-gold transition-colors">
              About Us
            </a>
            <a href="#contact" className="text-sm text-text-secondary hover:text-gold transition-colors">
              Contact
            </a>
          </div>

          <button
            onClick={onCartClick}
            className="btn-gold-outline flex items-center gap-2 px-4 py-2 text-sm relative"
          >
            <HiOutlineShoppingBag className="w-5 h-5" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="gold-gradient text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;