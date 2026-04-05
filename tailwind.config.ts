import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      colors: {
        saf: {
          green:      "#00A551", // Safaricom primary green
          "green-dark": "#007A3C",
          "green-deep": "#0D2B1C", // sidebar
          "green-mid":  "#1A4A2E", // sidebar hover/border
          orange:     "#FF6B2B",   // accent / alert
          "orange-dark": "#E05520",
        },
      },
      boxShadow: {
        sm:           "0 1px 2px 0 rgba(0,0,0,0.05)",
        md:           "0 4px 6px -1px rgba(0,0,0,0.1)",
        card:         "0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.06)",
        "card-hover": "0 4px 16px rgba(0,0,0,0.08), 0 8px 28px rgba(0,0,0,0.10)",
        glow:         "0 0 24px rgba(0,165,81,0.25)",
        "glow-orange":"0 0 24px rgba(255,107,43,0.25)",
      },
      backgroundImage: {
        "gradient-brand":           "linear-gradient(135deg, #00A551, #007A3C)",
        "gradient-secondary":       "linear-gradient(135deg, #FF6B2B, #E05520)",
        "gradient-accent":          "linear-gradient(135deg, #0EA5E9, #0284C7)",
        "gradient-primary-light":   "linear-gradient(135deg, #DCFCE7, #BBF7D0)",
        "gradient-secondary-light": "linear-gradient(135deg, #FFEDD5, #FED7AA)",
        "gradient-accent-light":    "linear-gradient(135deg, #E0F2FE, #BAE6FD)",
      },
    },
  },
  plugins: [],
};

export default config;
