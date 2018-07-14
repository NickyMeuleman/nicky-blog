import Typography from 'typography';
import oceanBeachTheme from 'typography-theme-ocean-beach';
import theme from './theme';

oceanBeachTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  a: {
    color: 'inherit',
    fontWeight: 700,
    textDecoration: 'none',
    borderBottom: `1px solid ${theme.primaryLighter}`,
    boxShadow: `inset 0 -2px 0px 0px ${theme.primaryLighter}`,
    textShadow: 'none',
    backgroundImage: 'none',
    transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  'a:hover': {
    background: theme.primaryLighter,
  },
  'a.anchor': {
    color: `inherit`,
    fill: theme.primaryLight,
    textDecoration: `none`,
    borderBottom: `none`,
    boxShadow: `none`,
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
  blockquote: {
    borderLeft: `${rhythm(1 / 4)} solid ${theme.primary}`,
  },
});

const typography = new Typography(oceanBeachTheme);
const { rhythm, scale: scaleJS } = typography;

const scale = num =>
  Object.entries(scaleJS(num))
    .map(([k, v]) => `${k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()}: ${v}`)
    .join('\n');

export { rhythm, scale, typography as default };
