import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eefdf4",
          100: "#d6f9e3",
          200: "#b0f1cb",
          300: "#7be3ac",
          400: "#3ecd86",
          500: "#16b369",
          600: "#0a9054",
          700: "#097245",
          800: "#0b5a39",
          900: "#0a4a30",
        },
      },
    },
  },
  plugins: [],
};

export default config;
