import Typography from 'typography';
// import kirkhamTheme from 'typography-theme-kirkham';
import oceanBeachTheme from 'typography-theme-ocean-beach';

oceanBeachTheme.overrideThemeStyles = ({ rhythm }, options) => ({
  a: {
    color: 'inherit',
    fontWeight: 700,
    textDecoration: 'none',
    borderBottom: '1px solid #bbeffd',
    boxShadow: 'inset 0 -2px 0px 0px #bbeffd',
    textShadow: 'none',
    backgroundImage: 'none',
    transition: 'all 100ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  'a:hover': {
    background: '#bbeffd',
  },
  'code.language-text': {
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
});

const typography = new Typography(oceanBeachTheme);

export default typography;
