import Logo from "../ui/Logo";
import salonInterior from "../../assets/salon_interior_enhanced.png";

// Custom inline silhouette SVGs for Gender Selector
const MaleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FemaleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4a4 4 0 014 4c0 1.5-.7 2.8-1.8 3.5.8.7 1.3 1.8 1.3 3v4H8.5v-4c0-1.2.5-2.3 1.3-3C8.7 10.8 8 9.5 8 8a4 4 0 014-4z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 8c0 3 1 5 1 5M16 8c0 3-1 5-1 5" />
  </svg>
);

const HeroSection = ({ selectedGender, onGenderChange }) => {
  const genders = [
    { slug: "Male", name: "Men" },
    { slug: "Female", name: "Women" }
  ];

  return (
    <section id="home" className="relative min-h-[450px] flex items-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#0F0F0F] to-black py-12 px-6 sm:px-12 z-10 shadow-2xl scroll-mt-24">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-[140px] pointer-events-none z-0" />
      
      <div className="relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Content (Text, Button, and Gender Tabs) */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
            <div className="flex items-center gap-4">
              {/* Logo Branding */}
              <div className="w-14 h-14 shrink-0 bg-black/40 p-1 rounded-xl border border-gold/30 shadow-md">
                <Logo />
              </div>
              <div className="flex flex-col">
                <h1 className="font-display text-2xl font-bold tracking-widest text-gold leading-none">
                  IMPECCABLE
                </h1>
                <span className="text-[10px] text-gold/80 tracking-widest mt-1 uppercase font-bold">
                  Unisex Salon
                </span>
              </div>
            </div>

            {/* Elegant Divider Accent Line */}
            <div className="w-24 h-[1px] bg-gradient-to-r from-gold via-gold/50 to-transparent" />

            {/* Tagline */}
            <div className="space-y-3">
              <p className="text-text-primary text-xl sm:text-2xl font-semibold tracking-wide font-display italic">
                Style that defines you.
              </p>
              <p className="text-gold/80 text-sm sm:text-base font-medium tracking-wide">
                Confidence that stays with you.
              </p>
            </div>
            
            {/* Explore Button */}
            <div className="pt-2">
              <a 
                href="#services" 
                className="btn-gold text-xs px-6 py-3 font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-gold-lg hover:scale-105 active:scale-95 whitespace-nowrap inline-block"
              >
                Explore Services
              </a>
            </div>

            {/* Gender Switcher Tabs inside the Left Side of the Hero */}
            <div className="pt-2">
              <div className="inline-flex bg-[#0A0A0A] backdrop-blur-md rounded-full p-1 border border-white/10 gap-1 shadow-lg">
                {genders.map((g) => {
                  const isActive = selectedGender === g.slug;
                  const isMen = g.slug === "Male";
                  return (
                    <button
                      key={g.slug}
                      onClick={() => onGenderChange(g.slug)}
                      className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                        isActive
                          ? "gold-gradient text-black shadow-md shadow-gold/25"
                          : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                      }`}
                    >
                      {isMen ? <MaleIcon className="w-3.5 h-3.5 shrink-0" /> : <FemaleIcon className="w-3.5 h-3.5 shrink-0" />}
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Enhanced Salon Interior Image */}
          <div className="lg:col-span-6 relative w-full flex justify-center items-center">
            {/* Gold Accent Glow behind image */}
            <div className="absolute -inset-1 bg-gradient-to-r from-gold/30 to-gold/0 rounded-[2.5rem] opacity-35 blur-xl pointer-events-none" />
            
            {/* Main Image Container */}
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl w-full max-w-full aspect-[4/3] lg:aspect-[1.4/1] bg-dark-card group">
              {/* Image dark gradient overlay - 40% to 60% opacity gradient */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/30 to-black/10 z-10 transition-opacity duration-300 group-hover:opacity-40" />
              
              <img
                src={salonInterior}
                alt="Impeccable Salon Interior"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                draggable="false"
              />
              
              {/* Luxury gold accent line framing the inside of the image */}
              <div className="absolute inset-4 border border-gold/20 rounded-[1.5rem] pointer-events-none z-20 transition-all duration-300 group-hover:border-gold/40" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;