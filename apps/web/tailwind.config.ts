import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          500: "#2980E8",
          600: "#0064D2",
          700: "#0052A8",
        },
        accent: {
          50: "#FFF8F1",
          100: "#FFF7ED",
          600: "#FF6B00",
          700: "#D45800",
        },
        success: { 100: "#DCFCE7", 600: "#16A34A" },
        warning: { 100: "#FEF3C7", 600: "#D97706" },
        error: { 100: "#FEE2E2", 600: "#DC2626" },
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "12px",
        xl: "16px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
