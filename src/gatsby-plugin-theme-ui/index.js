// import { toTheme } from '@theme-ui/typography';
import { tailwind } from '@theme-ui/presets';
// import moraga from 'typography-theme-moraga';
import nightOwl from '@theme-ui/prism/presets/night-owl.json';
import merge from 'deepmerge';

// const typographyTheme = toTheme(moraga);

// export default merge(typographyTheme, {
//   colors: {
//     background: '#222b40',
//     primary: '#2e3e5a',
//     text: '#f6f6f6',
//     // dark theme
//     blauw1: '#222b40', // background
//     blauw2: '#2e3e5a', // primary
//     blauw3: '#3a5075', // primary-alt
//     blauw6: '#222b40', // border
//     blauw7: '#425c86', // hover
//     wit1: 'ffffff', // icons
//     wit2: '#f6f6f6', // text
//     rood1: '#bf1f1d', // accent
//     blauw5: '#4a97cc', // soft text on alt
//     // rest
//     blauw4: '#3375a3',
//     rood2: '#cc4c4a',
//     rood3: '#931816',
//     rood4: '#cf5756',
//     rood5: '#a91b1a',
//     rood6: '#7d1413',
//     grijs1: '#b4b4b4',
//     grijs2: '#d6d6d6',
//   },
//   styles: {
//     Container: {
//       backgroundColor: 'primary',
//     },
//     a: {
//       color: 'text',
//       textDecoration: 'none',
//       borderBottom: '1px solid',
//       borderColor: 'blauw5',
//     },
//     pre: {
//       ...nightOwl,
//     },
//   },
// });

const theme = merge(tailwind, {
  colors: {
    text: '#f6f6f6',
    mutedText: `#c1c1c1c1`,
    background: '#222b40',
    mutedBackground: '#425c86',
    primary: '#bf1f1d',
    mutedPrimary: '#cc4c4a',
  },
  sizes: {
    lineLength: `70ch`,
  },
  fonts: {
    body:
      'Source Sans Pro, ' +
      '-apple-system, BlinkMacSystemFont,"Segoe ' +
      'UI",Roboto,"Helvetica Neue",Arial,"Noto ' +
      'Sans",sans-serif,"Apple Color Emoji","Segoe UI ' +
      'Emoji","Segoe UI Symbol","Noto Color Emoji"',
    heading: 'inherit',
    sans:
      'Source Sans Pro, ' +
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
      margin: 0,
    },
    Layout: {
      backgroundColor: `background`,
      color: `text`,
      fontFamily: `sans`, // from tailwind styles
      fontSize: 1,
      lineHeight: `text`,
    },
    Header: {
      backgroundColor: `mutedBackground`,
      color: `text`,
      fontWeight: `bold`,
      margin: 0,
      borderBottom: `1px solid`,
      borderColor: `background`,
      h1: {
        display: `block`,
        fontSize: 3,
        margin: `0 auto`,
        maxWidth: `lineLength`,
        padding: 3,
        width: `90vw`,
        color: `inherit`,
      },
      a: {
        color: `inherit`,
        ':hover': {
          color: `inherit`,
          borderColor: `inherit`,
        },
      },
    },
    Main: {
      margin: `0 auto`,
      width: `90vw`,
    },
    pre: {
      ...nightOwl,
      marginBottom: 2,
      overflow: `auto`,
      padding: 3,
      borderRadius: `default`,
    },
    inlineCode: {
      fontSize: `inherit`,
      fontWeight: `semibold`,
      backgroundColor: `mutedBackground`,
      padding: 1,
      borderRadius: `sm`,
    },
    a: {
      color: `mutedPrimary`,
      fontWeight: `bold`,
      textDecoration: `none`,
      ':hover': {
        textDecoration: `none`,
        color: `primary`,
        borderBottomWidth: `2px`,
        borderBottomStyle: `solid`,
        borderBottomColor: `mutedPrimary`,
      },
    },
    blockquote: {
      margin: 0,
      paddingLeft: 3,
      borderLeftWidth: 5,
      borderLeftColor: `mutedBackground`,
      borderLeftStyle: `solid`,
    },
  },
});

console.log(theme);

export default theme;
