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
        ink: "#17211d",
        leaf: "#2f6f5e",
        mint: "#dff5ec",
        peach: "#ffdfc7",
        sky: "#dbeafe"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(23, 33, 29, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
