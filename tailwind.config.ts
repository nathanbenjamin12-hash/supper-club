import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#2A2623",
        charcoal: "#2A2623",
        cream: "#FAF7F2",
        stone: "#F1ECE5",
        oat: "#F1ECE5",
        clay: "#E8DED2",
        olive: "#68735F",
        sage: "#8AA17B",
        terracotta: "#B86A4F",
        honey: "#C9A66B",
        tomato: "#B86A4F",
        wine: "#8A4E42",
        marigold: "#C9A66B"
      },
      fontFamily: {
        sans: ["var(--font-body)"],
        display: ["var(--font-heading)"]
      },
      boxShadow: {
        soft: "0 16px 42px rgba(42, 38, 35, 0.08)",
        subtle: "0 8px 24px rgba(42, 38, 35, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
