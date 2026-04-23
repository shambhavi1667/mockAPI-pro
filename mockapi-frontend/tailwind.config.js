/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        background: "#0f172a",
        card: "#1e293b",
        text: "#e2e8f0",
        subtext: "#94a3b8"
      }
    },
  },
  plugins: [],
};