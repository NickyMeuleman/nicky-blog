import { toTheme } from '@theme-ui/typography';
import moraga from 'typography-theme-moraga';
import nightOwl from '@theme-ui/prism/presets/night-owl.json';
import merge from 'deepmerge';

const typographyTheme = toTheme(moraga);

export default merge(typographyTheme, {
  colors: {
    background: '#222b40',
    primary: '#2e3e5a',
    text: '#f6f6f6',
    // dark theme
    blauw1: '#222b40', // background
    blauw2: '#2e3e5a', // primary
    blauw3: '#3a5075', // primary-alt
    blauw6: '#222b40', // border
    blauw7: '#425c86', // hover
    wit1: 'ffffff', // icons
    wit2: '#f6f6f6', // text
    rood1: '#bf1f1d', // accent
    blauw5: '#4a97cc', // soft text on alt
    // rest
    blauw4: '#3375a3',
    rood2: '#cc4c4a',
    rood3: '#931816',
    rood4: '#cf5756',
    rood5: '#a91b1a',
    rood6: '#7d1413',
    grijs1: '#b4b4b4',
    grijs2: '#d6d6d6',
  },
  styles: {
    Container: {
      backgroundColor: 'primary',
    },
    a: {
      color: 'text',
      textDecoration: 'none',
      borderBottom: '1px solid',
      borderColor: 'blauw5',
    },
    pre: {
      ...nightOwl,
    },
  },
});
