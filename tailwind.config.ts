import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FFF8F3",
          50: "#FFFDFB",
          100: "#FFF8F3",
          200: "#FDF0E6",
        },
        peach: {
          DEFAULT: "#FFD9C7",
          50: "#FFF6F1",
          100: "#FFECE2",
          200: "#FFD9C7",
          300: "#FFC2A6",
          400: "#FFA883",
        },
        blush: {
          DEFAULT: "#F7C6D0",
          50: "#FDF4F6",
          100: "#FBE6EC",
          200: "#F7C6D0",
          300: "#F1A3B3",
          400: "#E47E93",
        },
        sage: {
          DEFAULT: "#A8C3A0",
          50: "#F3F7F2",
          100: "#E3ECE1",
          200: "#C7DCC4",
          300: "#A8C3A0",
          400: "#8EA986",
          500: "#6E8966",
          600: "#546D4D",
          700: "#3E5238",
          800: "#2C3B28",
        },
        plum: {
          DEFAULT: "#4A2C40",
          50: "#F8F4F7",
          100: "#ECE1E8",
          200: "#DAC3D2",
          300: "#B896AD",
          400: "#8A5E7D",
          500: "#663B57",
          600: "#4A2C40",
          700: "#381F30",
          800: "#271421",
          900: "#180B14",
        },
        warm: {
          50: "#FAF7F5",
          100: "#F3EDE8",
          200: "#E4DAD2",
          300: "#D1C3B8",
          400: "#A89487",
          500: "#7E6B5F",
          600: "#5D4C42",
          700: "#4A2C40",
          800: "#36202E",
          900: "#24131E",
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", "Georgia", "serif"],
        serif: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'Poppins'", "Inter", "-apple-system", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "18px",
        "3xl": "24px",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(74, 44, 64, 0.06)",
        "soft-md": "0 8px 30px -4px rgba(74, 44, 64, 0.08)",
        "soft-lg": "0 14px 40px -6px rgba(74, 44, 64, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
