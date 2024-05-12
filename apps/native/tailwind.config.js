/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["poppins", "system-ui"],
      serif: ["poppins", "system-ui"],
      display: ["poppins", "system-ui"],
      body: ["poppins", "system-ui"],
    },
    extend: {
      colors: {
        // purple: "#514FB6",
        // "dark-purple": "#9470B5",
        "dark-purple": "#514FB6",
        "light-purple": "#514FB6",
        "light-grey": "#F0F3F4",
        grey: "#696969",
        "super-light-green": "#f0faf3",
      },
    },
  },
  plugins: [],
};
