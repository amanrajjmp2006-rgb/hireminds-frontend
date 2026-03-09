/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#0B1120",
        bgSecondary: "#111827",
        card: "#1F2937",
        accent: "#2563EB",
        accentSoft: "#60A5FA",
      },
      boxShadow: {
        glow: "0 0 30px rgba(96,165,250,0.35)",
      },
      borderRadius: {
        xl2: "1rem",
      },
    },
  },
  plugins: [],
}
