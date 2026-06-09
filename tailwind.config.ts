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
        ink: "#25211d",
        clay: "#d75b35",
        tomato: "#ef6a4c",
        sage: "#6f8f72",
        wine: "#8f3d5a",
        marigold: "#e8ad3f",
        cream: "#fbf7ef",
        oat: "#efe5d8"
      },
      boxShadow: {
        soft: "0 18px 55px rgba(55, 43, 31, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
