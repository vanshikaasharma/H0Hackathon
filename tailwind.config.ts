import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rackd: {
          charcoal: "#36454F",
          mint: "#B2E0D6",
          "mint-dark": "#8ECFC2",
          surface: "#FAFAF8",
        },
      },
      borderRadius: {
        card: "18px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(54 69 79 / 0.06), 0 4px 12px -2px rgb(54 69 79 / 0.08)",
        "card-hover":
          "0 12px 32px -8px rgb(54 69 79 / 0.14), 0 4px 12px -4px rgb(54 69 79 / 0.08)",
        soft: "0 2px 8px rgb(54 69 79 / 0.06)",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
