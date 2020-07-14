import nightOwl from "@theme-ui/prism/presets/night-owl.json";
import { themeConfig } from "@nickymeuleman/gatsby-theme-blog";
import merge from "deepmerge";

const theme = merge(themeConfig, {
  colors: {
    text: "#f6f6f6",
    mutedText: `#DFE5F3`,
    mutedTextBg: `#99A8CF`,
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
  fonts: {
    body:
      "Source Sans Pro, " +
      '-apple-system, BlinkMacSystemFont,"Segoe ' +
      'UI",Roboto,"Helvetica Neue",Arial,"Noto ' +
      'Sans",sans-serif,"Apple Color Emoji","Segoe UI ' +
      'Emoji","Segoe UI Symbol","Noto Color Emoji"',
    heading: "inherit",
    sans:
      "Source Sans Pro, " +
      '-apple-system, BlinkMacSystemFont,"Segoe ' +
      'UI",Roboto,"Helvetica Neue",Arial,"Noto ' +
      'Sans",sans-serif,"Apple Color Emoji","Segoe UI ' +
      'Emoji","Segoe UI Symbol","Noto Color Emoji"',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
    monospace:
      'Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace',
  },
  styles: {
    Header: {
      backgroundColor: `mutedBackground`,
      color: `text`,
      borderBottom: `3px solid`,
      borderColor: `mutedPrimary`,
    },
    PostExtra: {
      details: {
        borderColor: "watermarkBg",
      },
      title: {
        color: "mutedTextBg",
      },
      link: {
        "--underlineWidth": "1px",
      },
    },
    TableOfContentsList: {
      "--underlineWidth": (t) => t.borderWidths[2],
      "--blockLength": (t) => t.sizes[2],
      link: {
        color: `mutedText`,
        textDecoration: `none`,
        backgroundImage: (t) =>
          `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(${t.colors.danger}, ${t.colors.danger}), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 0 var(--underlineWidth)`,
        backgroundPosition: `calc(var(--blockLength) * -1) 100%, 0 100%, 0 100%`,
        transition:
          "background-size cubic-bezier(0.39, 0.575, 0.565, 1) 2s, background-position cubic-bezier(0.39, 0.575, 0.565, 1) 2s, color cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s",
        border: "none",
        ":hover": {
          color: `mutedText`,
          textDecoration: `none`,
          backgroundImage: (t) =>
            `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary}), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `var(--blockLength) var(--underlineWidth), 100% var(--underlineWidth), 0 var(--underlineWidth)`,
          backgroundPosition: `calc(var(--blockLength) * -1) 100%, 100% 100%, 0 100%`,
          transition:
            "background-size cubic-bezier(0.39, 0.575, 0.565, 1) 2s, background-position cubic-bezier(0.39, 0.575, 0.565, 1) 2s, color cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s",
          border: "none",
        },
        active: {
          backgroundImage: (t) =>
            `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(red,red), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `var(--blockLength) var(--underlineWidth), 100% var(--underlineWidth), 100% var(--underlineWidth)`,
          backgroundPosition: `calc(var(--blockLength) * -1) 100%, 0 100%, 0 100%`,
          transition:
            "background-size cubic-bezier(0.39, 0.575, 0.565, 1) 2s, background-position cubic-bezier(0.39, 0.575, 0.565, 1) 2s, color cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s",
          border: "none",
          ":hover": {
            backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 100% var(--underlineWidth)`,
            backgroundPosition: `calc(100% + var(--blockLength)) 100%, 100% 100%, 0 100%`,
          },
        },
      },
    },
    MetaListItem: {
      title: {
        color: "mutedTextBg",
      },
    },
    PostCard: {
      date: {
        color: "mutedTextBg",
      },
    },
    CodeBlock: {
      ...nightOwl,
      highlightLine: {
        backgroundColor: `#01121f`,
        borderLeftColor: `#9ccc65`,
      },
      title: {
        backgroundColor: nightOwl.backgroundColor,
        borderBottomColor: `#262a39`,
        color: nightOwl.color,
      },
    },
    HeaderLink: {
      textDecoration: "none",
      color: "text",
      ":hover": {
        textDecoration: `none`,
        color: `mutedPrimary`,
        borderBottomWidth: `2px`,
        borderBottomStyle: `solid`,
        borderBottomColor: `primary`,
      },
    },
    h1: {
      mt: 4,
      mb: 2,
    },
    h2: {
      mt: 4,
      mb: 2,
    },
    h3: {
      mt: 4,
      mb: 2,
    },
    h4: {
      mt: 3,
      mb: 2,
    },
    img: {
      maxWidth: "100%",
    },
    inlineCode: {
      fontSize: "0.85em",
    },
    a: {
      "--underlineWidth": (t) => t.borderWidths[2],
      "--blockLength": (t) => t.sizes[2],
      color: `mutedText`,
      textDecoration: `none`,
      backgroundImage: (t) =>
        `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary}), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `var(--blockLength) var(--underlineWidth), 100% var(--underlineWidth), 0 var(--underlineWidth)`,
      backgroundPosition: `calc(var(--blockLength) * -1) 100%, 100% 100%, 0 100%`,
      transition:
        "background-size cubic-bezier(0.39, 0.575, 0.565, 1) 2s, background-position cubic-bezier(0.39, 0.575, 0.565, 1) 2s, color cubic-bezier(0.39, 0.575, 0.565, 1) 0.5s",
      border: "none",
      ":hover": {
        color: "mutedPrimary",
        textDecoration: `none`,
        border: "none",
        backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 100% var(--underlineWidth)`,
        backgroundPosition:
          "calc(100% + var(--blockLength)) 100%, 100% 100%, 0 100%",
      },
    },
  },
});
console.log(theme);

export default theme;
