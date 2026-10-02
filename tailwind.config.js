/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#182129",
          navyLight: "#202B36",
          bronze: "#C87A54",
          bronzeLight: "#E8A27C",
          blue: "#002D4A",
          emerald: "#00A37A",
          emeraldHover: "#008A67",
          slate: "#F8FAFC",
          border: "#E2E8F0",
          borderDark: "#2D3945",
        },
        risk: {
          red: "#EF4444",
          redBg: "#FEF2F2",
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
