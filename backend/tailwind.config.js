/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          50:  "#fff1f1",
          100: "#ffe1e1",
          200: "#ffbdbd",
          300: "#ff8a8a",
          400: "#ff5a5a",
          500: "#ff2f2f",
          600: "#e51b1b",
          700: "#bd1313",
          800: "#990f0f",
          900: "#7f0c0c",
        },
        ember: "#ff7a00",
        surface: {
          DEFAULT: "#111111",
          card:    "#1a1a1a",
          border:  "#2a2a2a",
          hover:   "#222222",
        },
      },
    },
  },
  plugins: [],
};
