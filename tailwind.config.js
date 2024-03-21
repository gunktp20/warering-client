/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: { min: "0px", max: "600px" },

      md: { min: "601px", max: "1023px" },

      lg: { min: "1024px", max: "1279px" },

      xl: { min: "1280px", max: "1535px" },

      "2xl": { min: "1536px" },

    },

    colors: {
      ...colors,
      primary: {
        DEFAULT: "#1966FB",
        100: "#D0E6FE",
        200: "#A2CBFE",
        300: "#74ACFD",
        400: "#5292FC",
        500: "#1966FB", 
        600: "#124ED7",
        700: "#0C3AB4",
        800: "#072891",
        900: "#041C78",
      },
      second: {
        DEFAULT: "#3173B1",
      },
    },
    extend: {},
  },
  plugins: [],
};
