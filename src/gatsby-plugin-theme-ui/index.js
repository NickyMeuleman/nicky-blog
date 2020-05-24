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
  },
});
console.log({ theme });

export default theme;
