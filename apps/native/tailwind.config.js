/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: "#514FB6",
        "dark-purple": "#9470B5",
        "light-purple": "#edbdf2",
        "light-grey": "#F0F3F4",
        grey: "#696969",
        "super-light-green": "#f0faf3",
      },
    },
  },
  plugins: [],
};
