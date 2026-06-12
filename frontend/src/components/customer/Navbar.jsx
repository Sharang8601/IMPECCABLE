import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { selectCartCount } from "../../redux/slices/cartSlice";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import Logo from "../ui/Logo";

const Navbar = ({ onCartClick }) => {
  const cartCount = useSelector(selectCartCount);
  const [activeHash, setActiveHash] = useState(window.location.hash || "#services");

  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || "#services");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#services", label: "Services" },
    { href: "#about", label: "About Us" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-effect border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 lg:w-11 lg:h-11 shrink-0">
              <Logo mode="symbol" />
            </div>
            <div>
              <h1 className="font-display text-sm lg:text-base font-bold tracking-wide text-gold leading-none">
                Impeccable
              </h1>
              <p className="text-[12px] text-gold/80 font-normal mt-0.5" style={{ fontFamily: "'Great Vibes', cursive" }}>
                Unisex Salon
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = activeHash === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-all relative py-1 ${
                    isActive ? "text-gold" : "text-text-secondary hover:text-gold"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold rounded-full" />
                  )}
                </a>
              );
            })}
          </div>

          {/* Cart Outline Button */}
          <button
            onClick={onCartClick}
            className="border border-gold text-gold hover:bg-gold hover:text-black rounded-full px-5 py-2 text-xs font-semibold flex items-center gap-2 transition-all duration-300 active:scale-95 shadow-md hover:shadow-gold/15"
          >
            <HiOutlineShoppingBag className="w-4 h-4" />
            <span>Cart ({cartCount})</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;