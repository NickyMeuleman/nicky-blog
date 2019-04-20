import Typography from 'typography';
import oceanBeachTheme from 'typography-theme-ocean-beach';
import { MOBILE_MEDIA_QUERY } from 'typography-breakpoint-constants';
import theme from './theme';

oceanBeachTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  a: {
    color: 'inherit',
    fontWeight: 700,
    textDecoration: 'none',
    textShadow: 'none',
    backgroundImage: 'none',
    transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
    borderBottom: `1px solid ${theme.light.primaryLighter}`,
    boxShadow: `inset 0 -2px 0px 0px ${theme.light.primaryLighter}`,
  },
  '.dark a': {
    borderBottom: `1px solid ${theme.dark.primaryLighter}`,
    boxShadow: `inset 0 -2px 0px 0px ${theme.dark.primaryLighter}`,
  },
  'a:hover': {
    background: theme.light.primaryLighter,
    borderBottom: `1px solid ${theme.light.primaryLight}`,
    boxShadow: `inset 0 -2px 0px 0px ${theme.light.primaryLight}`,
  },
  '.dark a:hover': {
    background: theme.dark.primaryLighter,
    borderBottom: `1px solid ${theme.dark.primaryLight}`,
    boxShadow: `inset 0 -2px 0px 0px ${theme.dark.primaryLight}`,
  },
  'a.anchor': {
    color: `inherit`,
    fill: theme.light.primaryLight,
    textDecoration: `none`,
    borderBottom: `none`,
    boxShadow: `none`,
  },
  '.dark a.anchor': {
    fill: theme.dark.primaryLight,
  },
  'a.anchor:hover': {
    background: `none`,
  },
  ':not(pre) > code[class*="language-"]': {
    borderRadius: '3px',
    padding: '0 0.2rem',
    paddingTop: '0.1em',
    paddingBottom: '0.1em',
    background: '#bbeffd',
    fontSize: '80%',
    fontVariant: 'none',
    fontFeatureSettings: '"clig" 0, "calt" 0',
    position: 'relative',
    top: '-1px',
    lineHeight: 'inherit',
  },
  '.dark :not(pre) > code[class*="language-"]': {
    background: '#000',
  },
  blockquote: {
    borderLeft: `${rhythm(6 / 16)} solid ${theme.light.primary}`,
  },
  '.dark blockquote': {
    borderLeft: `${rhythm(6 / 16)} solid ${theme.light.primary}`,
  },
  '::selection': {
    backgroundColor: `${theme.light.primary}`,
    color: '#f5f5f5',
  },
  '.dark ::selection': {
    backgroundColor: `${theme.dark.primary}`,
    color: '#f5f5f5',
  },
  [MOBILE_MEDIA_QUERY]: {
    blockquote: {
      borderLeft: `${rhythm(3 / 16)} solid ${theme.light.primary}`,
    },
    '.dark blockquote': {
      borderLeft: `${rhythm(3 / 16)} solid ${theme.dark.primary}`,
    },
  },
});

const typography = new Typography(oceanBeachTheme);
const { rhythm, scale: scaleJS } = typography;

const scale = num =>
  Object.entries(scaleJS(num))
    .map(
      ([k, v]) => `${k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}: ${v}`
    )
    .join('\n');

export { rhythm, scale, typography as default };
