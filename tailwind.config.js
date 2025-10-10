/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta inspirada no logo: preto, vermelho-fogo, âmbar/brilho
        accent: {
          50: "#fff1f1",
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
      },
      boxShadow: {
        glow: "0 0 20px rgba(255, 90, 90, 0.4), 0 0 40px rgba(255, 122, 0, 0.25)",
      },
      fontFamily: {
        // use a default; você pode trocar por uma fonte heavy/condensed depois
        display: ["Impact", "Oswald", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
