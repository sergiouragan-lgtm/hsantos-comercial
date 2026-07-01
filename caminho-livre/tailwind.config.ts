import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        outerbg: "var(--outer-bg)",
        card: "var(--card)",
        navbg: "var(--nav-bg)",
        text: "var(--text)",
        muted: "var(--text-muted)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        gold: "var(--gold)",
        orange: "var(--orange)",
        blue: "var(--blue)",
        purple: "var(--purple)",
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Noto Sans Arabic", "sans-serif"],
        sans: ["var(--font-jakarta)", "Noto Sans Arabic", "sans-serif"],
      },
      keyframes: {
        "cl-modal-in": {
          from: { opacity: "0", transform: "scale(.92) translateY(8px)" },
          to: { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "cl-confetti": {
          "0%": { transform: "translateY(-16px) rotate(0deg)", opacity: "1" },
          "100%": { transform: "translateY(230px) rotate(360deg)", opacity: "0" },
        },
        "cl-fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "cl-spin": { to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "cl-modal-in": "cl-modal-in .18s ease-out",
        "cl-confetti-1": "cl-confetti 1.6s ease-in 0s forwards",
        "cl-confetti-2": "cl-confetti 1.9s ease-in .1s forwards",
        "cl-confetti-3": "cl-confetti 1.7s ease-in .05s forwards",
        "cl-confetti-4": "cl-confetti 2s ease-in .15s forwards",
        "cl-confetti-5": "cl-confetti 1.8s ease-in .08s forwards",
        "cl-confetti-6": "cl-confetti 1.6s ease-in .12s forwards",
        "cl-fade-in": "cl-fade-in .2s ease-out",
        "cl-spin": "cl-spin .9s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
