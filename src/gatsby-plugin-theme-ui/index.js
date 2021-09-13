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
    root: {
      // a named color doesn't work, this is mutedPrimary
      accentColor: "rgb(176, 251, 188)",
      "li::marker": {
        color: "mutedPrimary",
      },
      "::-webkit-scrollbar-thumb": {
        ":hover": {
          backgroundColor: "mutedText",
        },
        ":active": {
          backgroundColor: "text",
        },
        minHeight: "58px",
        backgroundColor: "mutedTextBg",
        borderRadius: "8px",
        borderWidth: "4px",
        borderStyle: "solid",
        borderColor: "background",
      },
      "::-webkit-scrollbar": {
        width: "16px",
      },
      details: {
        "::-webkit-scrollbar-thumb": {
          ":hover": { backgroundColor: "mutedText" },
          ":active": { backgroundColor: "text" },
          minHeight: "58px",
          backgroundColor: "mutedTextBg",
          borderRadius: "8px",
          borderWidth: "4px",
          borderStyle: "solid",
          borderColor: "background",
        },
        "::-webkit-scrollbar": {
          width: "16px",
        },
      },
    },
    Header: {
      link: {
        "--underlineWidth": (t) => t.borderWidths[2],
        color: `mutedText`,
        textDecoration: `none`,
        backgroundImage: (t) =>
          `linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `0 var(--underlineWidth)`,
        backgroundPosition: `0 100%`,
        transition:
          "background-size cubic-bezier(.39,.575,.565,1) 0.3s, color cubic-bezier(.39,.575,.565,1) 0.3s",
        border: "none",
        ":hover": {
          color: "mutedPrimary",
          textDecoration: `none`,
          border: "none",
          backgroundSize: `100% var(--underlineWidth)`,
        },
        "&.is-active": {
          color: `mutedText`,
          backgroundImage: (t) =>
            `linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `100% var(--underlineWidth)`,
          backgroundPosition: `0 100%`,
          transition: "color cubic-bezier(.39,.575,.565,1) 0.3s",
          border: "none",
          ":hover": {
            color: "mutedPrimary",
          },
        },
      },
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
        "--blockLength": (t) => t.sizes[4],
      },
    },
    TableOfContentsList: {
      link: {
        "--underlineWidth": (t) => t.borderWidths[2],
        "--blockLength": (t) => t.sizes[4],
        color: `mutedText`,
        textDecoration: `none`,
        backgroundImage: (t) =>
          `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary}), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 0 var(--underlineWidth)`,
        backgroundPosition: `calc(var(--blockLength) * -1) 100%, 100% 100%, 0 100%`,
        transition:
          "background-size cubic-bezier(.39,.575,.565,1) 0.3s, background-position cubic-bezier(.39,.575,.565,1) 0.3s, color cubic-bezier(.39,.575,.565,1) 0.3s",
        ":hover": {
          color: "mutedPrimary",
          backgroundImage: (t) =>
            `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary}), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
          backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 100% var(--underlineWidth)`,
          backgroundPosition:
            "calc(100% + var(--blockLength)) 100%, 100% 100%, 0 100%",
        },
        active: {
          "--underlineWidth": (t) => t.borderWidths[2],
          "--blockLength": (t) => t.sizes[6],
          color: `mutedPrimary`,
          textDecoration: `none`,
          backgroundImage: (t) =>
            `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary}), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: `var(--blockLength) var(--underlineWidth), 100% var(--underlineWidth), 0 var(--underlineWidth)`,
          backgroundPosition: `calc(var(--blockLength) * -1) 100%, 100% 100%, 0 100%`,
          transition:
            "background-size cubic-bezier(.39,.575,.565,1) 0.3s, background-position cubic-bezier(.39,.575,.565,1) 0.3s, color cubic-bezier(.39,.575,.565,1) 0.3s",
          border: "none",
          ":hover": {
            color: "mutedPrimary",
            backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 100% var(--underlineWidth)`,
            backgroundPosition:
              "calc(100% + var(--blockLength)) 100%, 100% 100%, 0 100%",
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
      mb: 3,
      highlightLine: {
        backgroundColor: `#01121f`,
        borderLeftColor: `#9ccc65`,
      },
      title: {
        backgroundColor: nightOwl.backgroundColor,
        borderBottomColor: `#262a39`,
        color: nightOwl.color,
      },
      copyButton: {
        color: nightOwl[".comment"].color,
        ":hover": { color: nightOwl.color, borderColor: nightOwl.color },
      },
      "::-webkit-scrollbar-thumb": {
        ":hover": { backgroundColor: "#262a39" },
        ":active": { backgroundColor: nightOwl.color },
        minHeight: "58px",
        // taken from the VSCode theme
        backgroundColor: `#084d8180`,
        borderRadius: "8px",
        borderWidth: "4px",
        borderStyle: "solid",
        borderColor: nightOwl.backgroundColor,
      },
      "::-webkit-scrollbar": {
        height: "16px",
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
      "--blockLength": (t) => t.sizes[3],
      color: `mutedText`,
      textDecoration: `none`,
      backgroundImage: (t) =>
        `linear-gradient(90deg, ${t.colors.background}, ${t.colors.background}), linear-gradient(${t.colors.mutedPrimary}, ${t.colors.mutedPrimary}), linear-gradient(${t.colors.primary}, ${t.colors.primary})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: `var(--blockLength) var(--underlineWidth), 100% var(--underlineWidth), 0 var(--underlineWidth)`,
      backgroundPosition: `calc(var(--blockLength) * -1) 100%, 100% 100%, 0 100%`,
      transition:
        "background-size cubic-bezier(0.39, 0.575, 0.565, 1) 0.3s, background-position cubic-bezier(0.39, 0.575, 0.565, 1) 0.3s, color cubic-bezier(0.39, 0.575, 0.565, 1) 0.3s",
      border: "none",
      ":hover": {
        color: "mutedPrimary",
        border: "none",
        backgroundSize: `var(--blockLength) var(--underlineWidth), 0 var(--underlineWidth), 100% var(--underlineWidth)`,
        backgroundPosition:
          "calc(100% + var(--blockLength)) 100%, 100% 100%, 0 100%",
      },
    },
    table: {
      my: 3,
      marginLeft: "auto",
      marginRight: "auto",
      width: "4/5",
      textAlign: "left",
      textIndent: 0,
      borderCollapse: "collapse",
      borderStyle: "solid",
      borderWidth: 0,
      thead: {
        tr: {
          "th:first-child": {
            borderTopLeftRadius: `sm`,
          },
          "th:last-child": {
            borderTopRightRadius: `sm`,
          },
        },
      },
      th: {
        px: 2,
        py: 1,
        backgroundColor: "mutedBackground",
        borderColor: "mutedPrimary",
        borderStyle: "solid",
        borderWidth: 0,
        borderBottomWidth: "1px",
      },
      tr: {
        borderStyle: "solid",
        borderWidth: 0,
        borderColor: "watermarkBg",
        borderBottomWidth: "1px",
      },
      td: {
        px: 2,
        py: 1,
      },
    },
  },
});

export default theme;
