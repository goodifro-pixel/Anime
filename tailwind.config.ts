import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
        },
        bg: {
          DEFAULT: "#0b0b12",
          soft: "#12121c",
          card: "#181825",
          border: "#26263a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 10px 40px -10px rgba(168, 85, 247, 0.35)",
      },
    },
  },
  plugins: [],
};

export default config;
