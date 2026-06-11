/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          DEFAULT: "#000000",
          card: "#0F0F0F",
          900: "#0A0A0A",
          800: "#111111",
          700: "#1A1A1A",
        },
        gold: {
          DEFAULT: "#D4AF37",
          hover: "#E6C65C",
          light: "#F0E68C",
          dark: "#B8960F",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#B3B3B3",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        gold: "0 0 20px rgba(212, 175, 55, 0.15)",
        "gold-lg": "0 0 40px rgba(212, 175, 55, 0.25)",
        card: "0 4px 20px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.1)" },
          "50%": { boxShadow: "0 0 40px rgba(212, 175, 55, 0.3)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};