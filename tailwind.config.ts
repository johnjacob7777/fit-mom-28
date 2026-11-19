import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft warm peach tones
        peach: {
          50: "#FFF8F3",
          100: "#FFE8D6",
          200: "#FFDAB9",
          300: "#FFC999",
          400: "#FFB07A",
          500: "#FF9A5C",
          600: "#E8824A",
        },
        // Cream / warm white
        cream: {
          50: "#FFFDF9",
          100: "#FFF8F0",
          200: "#FFF3E6",
        },
        // Soft sage green
        sage: {
          50: "#F0F7F2",
          100: "#D4EDDA",
          200: "#A8D5BA",
          300: "#7DC49E",
          400: "#5CB385",
          500: "#3D9A6A",
          600: "#2E7D52",
        },
        // Warm brown for text
        warm: {
          50: "#F5F0EB",
          100: "#E0D5CC",
          200: "#C4B5A8",
          300: "#A89585",
          400: "#8D7565",
          500: "#6D5A4A",
          600: "#5D4A3A",
          700: "#4E3B2D",
          800: "#3E2D22",
          900: "#2E1F17",
        },
      },
      fontFamily: {
        sans: ["Nunito", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
