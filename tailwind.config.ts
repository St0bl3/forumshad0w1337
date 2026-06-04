import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: "#050816",
        night: "#0A0F1F",
        steel: "#101828",
        cyan: "#00F5FF",
        purple: "#8B5CF6",
        pink: "#FF0088"
      },
      fontFamily: {
        display: ["var(--font-display)", "Inter", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"]
      },
      boxShadow: {
        neon: "0 0 40px rgba(0, 245, 255, 0.25)",
        purple: "0 0 56px rgba(139, 92, 246, 0.28)",
        pink: "0 0 56px rgba(255, 0, 136, 0.26)"
      }
    }
  },
  plugins: []
};

export default config;
