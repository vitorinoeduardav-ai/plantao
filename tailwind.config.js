/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        clinic: {
          ink: "#26323b",
          mint: "#d9f2ed",
          paper: "#fffaf4",
          lilac: "#ede7ff",
        },
      },
      boxShadow: {
        soft: "0 18px 45px rgba(38, 50, 59, 0.10)",
      },
    },
  },
  plugins: [],
};
