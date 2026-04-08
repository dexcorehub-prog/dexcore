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
        ink: "#0B0D10",
        panel: "#12161C",
        surface: "#171C22",
        border: "#2A3442",
        text: "#F5F7FA",
        muted: "#AAB4C3",
        brand: "#2F6BFF",
        glow: "#5B8CFF"
      },
      boxShadow: {
        soft: "0 16px 50px rgba(0,0,0,0.35)",
        glow: "0 0 0 1px rgba(91,140,255,0.22), 0 18px 60px rgba(47,107,255,0.18)"
      },
      backgroundImage: {
        grid: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.08) 1px, transparent 0)",
        hero: "radial-gradient(circle at top, rgba(47,107,255,0.23), transparent 32%), radial-gradient(circle at 80% 0%, rgba(91,140,255,0.18), transparent 22%), linear-gradient(180deg, #0B0D10 0%, #12161C 100%)"
      }
    }
  },
  plugins: []
};

export default config;
