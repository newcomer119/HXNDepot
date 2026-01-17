/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#005a2b", // HXN green
          light: "#007a3a",
          dark: "#003d1d",
        },
        gold: {
          DEFAULT: "#d4af37", // HXN gold
          light: "#f4e4bc",
          dark: "#b8941f",
        },
        background: {
          DEFAULT: "#FFFFFF", // white background
          light: "#F9FAFB",
          lighter: "#F3F4F6",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          light: "#F9FAFB",
          dark: "#E5E7EB",
        },
        text: {
          primary: "#005a2b", // HXN green
          secondary: "#6B7280",
          tertiary: "#9CA3AF",
        },
        accent: {
          DEFAULT: "#d4af37", // HXN gold
          red: "#F44336",
          yellow: "#FFC107",
        },
      },
    },
  },
  plugins: [],
};
