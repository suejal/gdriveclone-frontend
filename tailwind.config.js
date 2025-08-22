/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          50: "#fafafa",
          100: "#f5f6f7",
          200: "#e8ebee",
          300: "#dbe1e6",
        },
        primary: {
          50: "#f7f7ff",
          100: "#eef0ff",
          200: "#dfe3ff",
          300: "#c7ceff",
          400: "#a2b2ff",
          500: "#7e97ff",
        },
        mint: {
          100: "#eaf7f3",
          200: "#d5efe7",
          300: "#bee6da",
        },
        peach: {
          100: "#fff2ec",
          200: "#ffe5d9",
          300: "#ffd6c2",
        },
      },
      borderRadius: {
        xl: "1rem",
        '2xl': "1.25rem",
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(20, 23, 28, 0.12)",
      },
    },
  },
  plugins: [],
};

