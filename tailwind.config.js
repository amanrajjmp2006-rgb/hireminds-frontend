/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: "#0B1120",
        surface: "#111827",
        card: "#1F2937",
        accent: "#2563EB",
        accent2: "#60A5FA"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(96,165,250,0.2), 0 0 30px rgba(37,99,235,0.35)",
        glass: "0 12px 40px rgba(2,6,23,0.45)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
}
