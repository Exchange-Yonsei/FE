import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#102A43",
        leaf: "#003876",
        mint: "#F0F6FF",
        peach: "#D8E7FF",
        sky: "#D8E7FF",
        "yonsei-primary": "#003876",
        "yonsei-secondary": "#005BAC",
        "yonsei-light": "#F0F6FF",
        "blue-soft": "#D8E7FF"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(16, 42, 67, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
