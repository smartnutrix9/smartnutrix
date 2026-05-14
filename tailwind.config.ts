import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#E1F5EE",
          100: "#C3EBD9",
          200: "#9FE1CB",
          300: "#5DCAA5",
          400: "#2DB887",
          500: "#1D9E75",
          600: "#0F6E56",
          700: "#085041",
          800: "#04342C",
          900: "#021A16",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 2px 20px rgba(0,0,0,0.06)",
        card: "0 4px 24px rgba(0,0,0,0.08)",
      },
    },
  },
  plugins: [],
};

export default config;