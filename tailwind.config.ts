import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0e273c",
        secondary: "#e4dbca",
        accent: "#f82866",
        text: "#efece6",
        itext: "#051420",
      },
    },
  },
  plugins: [],
} satisfies Config;
