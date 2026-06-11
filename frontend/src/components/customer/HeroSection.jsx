import { motion } from "framer-motion";
import Logo from "../ui/Logo";

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-[85vh] lg:min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 animated-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="w-20 h-20 lg:w-24 lg:h-24">
                <Logo />
              </div>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold mb-4">
              <span className="gold-text">Impeccable</span>
              <br />
              <span className="text-text-primary">Unisex Salon</span>
            </h1>
            <p className="text-text-secondary text-lg lg:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
              Style that defines you. Confidence that stays with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#services" className="btn-gold text-center text-base px-8 py-4">
                Explore Services
              </a>
              <a href="#about" className="btn-dark text-center text-base px-8 py-4">
                Learn More
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1634449571010-02389ed0c9b0?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury salon experience"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-dark via-dark/50 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="glass-effect rounded-xl p-5">
                  <div className="flex items-center gap-3">
                    <div className="gold-gradient w-10 h-10 rounded-full flex items-center justify-center">
                      <span className="text-black font-bold text-lg">✦</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-primary">Premium Experience</p>
                      <p className="text-xs text-text-secondary">Since 2024</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Glow behind image */}
            <div className="absolute -top-4 -right-4 w-72 h-72 gold-gradient rounded-full opacity-10 blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;