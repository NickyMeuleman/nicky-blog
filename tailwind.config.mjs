/* eslint-disable @typescript-eslint/unbound-method */
import defaultTheme from "tailwindcss/defaultTheme";
import typography from "@tailwindcss/typography";
import plugin from "tailwindcss/plugin";

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
      content: {
        checkmark: "'\\2713'",
      },
      typography: {
        // no! bad! don't things
        DEFAULT: {
          css: {
            code: {
              color: "inherit",
            },
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
            strong: {
              color: "inherit",
            },
            blockquote: {
              color: "inherit",
            },
          },
        },
      },
    },
  },
  plugins: [
    plugin(({ addBase, addComponents, theme }) => {
      addBase({
        p: {
          marginTop: theme("margin.4"),
          marginBottom: theme("margin.4"),
        },
      });
      addComponents({
        ".anchor": {
          "--underlineWidth": theme("borderWidth.2"),
          "--blockLength": theme("spacing.3"),
          color: theme("colors.mutedText"),
          textDecoration: `none`,
          backgroundImage: `linear-gradient(90deg, ${theme("colors.background")}, ${theme("colors.background")}), linear-gradient(${theme("colors.mutedPrimary")}, ${theme("colors.mutedPrimary")}), linear-gradient(${theme("colors.primary")}, ${theme("colors.primary")})`,
          backgroundRepeat: `no-repeat`,
          backgroundSize: `var(--blockLength) var(--underlineWidth), 100% var(--underlineWidth), 0 var(--underlineWidth)`,
          backgroundPosition: `calc(var(--blockLength) * -1) 100%, 100% 100%, 0 100%`,
          transition: `background-size cubic-bezier(0.39, 0.575, 0.565, 1) 0.3s, background-position cubic-bezier(0.39, 0.575, 0.565, 1) 0.3s, color cubic-bezier(0.39, 0.575, 0.565, 1) 0.3s`,
          border: `none`,
          "&:hover": {
            color: `mutedPrimary`,
            border: `none`,
            backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 100% var(--underlineWidth)`,
            backgroundPosition: `calc(100% + var(--blockLength)) 100%, 100% 100%, 0 100%`,
          },
        },
        ".code": {
          fontSize: "0.85em",
          overflowWrap: "break-word",
          fontFamily: theme("fontFamily.mono"),
          letterSpacing: theme("letterSpacing.wide"),
          backgroundColor: theme("colors.mutedBackground"),
          padding: theme("padding.1"),
          borderRadius: theme("borderRadius.sm"),
        },
      });
    }),
    typography(),
  ],
};
