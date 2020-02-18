import nightOwl from '@theme-ui/prism/presets/night-owl.json';
import { themeConfig } from '@nickymeuleman/gatsby-theme-blog';
import merge from 'deepmerge';

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

const theme = merge(themeConfig, {
  colors: {
    text: '#f6f6f6',
    mutedText: `#DFE5F3`,
    // mutedText: `#e0e0e0e0`,
    // mutedText: `#c1c1c1c1`,
    background: '#222b40',
    mutedBackground: '#425c86',
    primary: 'rgb(92, 212, 125)',
    // primary: '#bf1f1d',
    mutedPrimary: 'rgb(176, 251, 188)',
    // mutedPrimary: '#cc4c4a',
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
    Header: {
      backgroundColor: `mutedBackground`,
      color: `text`,
      borderBottom: `3px solid`,
      borderColor: `mutedPrimary`,
    },
    PostExtra: {
      borderColor: '#4E608C',
    },
    PostCard: {
      '.date': {
        color: '#99A8CF',
      },
    },
    pre: {
      ...nightOwl,
    },
  },
});

console.log(theme);

export default theme;
