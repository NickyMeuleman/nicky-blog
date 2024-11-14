import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["SourceSans3", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        text: "#f6f6f6",
        mutedText: "#DFE5F3",
        mutedTextBg: "#99A8CF",
        background: "#222b40",
        mutedBackground: "#425c86",
        primary: "rgb(92, 212, 125)",
        mutedPrimary: "rgb(176, 251, 188)",
        watermarkBg: "#4E608C",
        info: "#63b3ed",
        danger: "#feb2b2",
        // danger: "#d95757",
        success: "rgb(92, 212, 125)",
      },
    },
  },
  plugins: [],
};
