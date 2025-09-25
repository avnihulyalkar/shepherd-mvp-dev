/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        abcwhyte: ["ABCWhyte", "sans-serif"],
      },
      colors: {
        primary: "#df153e",
        "primary-hover": "#c8102e",
        secondary: "#8f8f8f",
        "gray-border": "#232323",
        surface: "#0C0C0C",
        "surface-hover": "#1A1A1A",
        helper: "#595959",
      },
    },
  },
  plugins: [],
};
