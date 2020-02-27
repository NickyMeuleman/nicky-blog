/** @jsx jsx */
import { jsx, Styled } from 'theme-ui';

const Footer = () => {
  return (
    <footer
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr minmax(20ch, 70ch) 1fr',
        alignItems: 'center',
        py: 4,
        px: '5vw', // relates to width of Main
        color: 'mutedText',
        backgroundColor: 'mutedBackground',
      }}
    >
      <div
        sx={{
          gridColumn: '2/3',
          gridRow: '1/2',
          justifySelf: 'start',
          fontSize: 0,
        }}
      >
        <Styled.p sx={{ m: 0 }}>
          Designed and developed by Nicky Meuleman
        </Styled.p>
        <Styled.p sx={{ m: 0 }}>
          Built with{' '}
          <Styled.a
            href="https://gatsbyjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Gatsby
          </Styled.a>
          . Hosted on{' '}
          <Styled.a
            href="https://www.netlify.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Netlify
          </Styled.a>
          .
        </Styled.p>
      </div>
      <nav
        sx={{
          gridColumn: '2/3',
          gridRow: ['2/3', '1/2'],
          justifySelf: ['start', 'end'],
          mt: [3, 0],
          display: 'flex',
          //   Chrome doesn't support "gap" for flexbox yet, sadface
          span: {
            marginLeft: 4,
          },
        }}
      >
        <a
          href="https://twitter.com/NMeuleman"
          aria-label="Twitter"
          sx={{
            lineHeight: 0,
            path: { fill: 'mutedText' },
            ':hover': { path: { fill: 'rgb(29, 161, 242)' } },
          }}
        >
          <svg
            role="img"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Twitter logo</title>
            <path d="M19.6894 3.88235C18.9647 4.21176 18.1835 4.42824 17.3741 4.53176C18.2024 4.03294 18.8424 3.24235 19.1435 2.29176C18.3624 2.76235 17.4965 3.09176 16.5835 3.28C15.84 2.47059 14.7953 2 13.6094 2C11.3976 2 9.59059 3.80706 9.59059 6.03765C9.59059 6.35765 9.62823 6.66824 9.69412 6.96C6.34353 6.79059 3.36 5.18118 1.37412 2.74353C1.02588 3.33647 0.828235 4.03294 0.828235 4.76706C0.828235 6.16941 1.53412 7.41176 2.62588 8.11765C1.95765 8.11765 1.33647 7.92941 0.790588 7.64706C0.790588 7.64706 0.790588 7.64706 0.790588 7.67529C0.790588 9.63294 2.18353 11.2706 4.02823 11.6376C3.68941 11.7318 3.33176 11.7788 2.96471 11.7788C2.71059 11.7788 2.45647 11.7506 2.21176 11.7035C2.72 13.2941 4.19765 14.48 5.97647 14.5082C4.60235 15.6 2.86118 16.24 0.96 16.24C0.64 16.24 0.32 16.2212 0 16.1835C1.78824 17.3318 3.91529 18 6.19294 18C13.6094 18 17.6847 11.8447 17.6847 6.50824C17.6847 6.32941 17.6847 6.16 17.6753 5.98118C18.4659 5.41647 19.1435 4.70118 19.6894 3.88235Z" />
          </svg>
        </a>
        <a
          href="https://github.com/NickyMeuleman"
          aria-label="GitHub"
          sx={{
            lineHeight: 0,
            marginLeft: 3,
            path: { fill: 'mutedText' },
            ':hover': { path: { fill: 'mutedPrimary' } },
          }}
        >
          <svg
            role="img"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>The GitHub Logo</title>
            <path d="M10.2285 1C5.12976 1 1 5.13206 1 10.2285C1 14.3067 3.64397 17.7651 7.30999 18.9841C7.77142 19.071 7.94061 18.7856 7.94061 18.5403C7.94061 18.3211 7.93292 17.7405 7.92907 16.9715C5.36201 17.5283 4.8206 15.7333 4.8206 15.7333C4.40071 14.6682 3.79393 14.3836 3.79393 14.3836C2.95798 13.8115 3.85853 13.823 3.85853 13.823C4.78523 13.8876 5.27203 14.7735 5.27203 14.7735C6.09491 16.1847 7.43227 15.7771 7.95983 15.5411C8.04289 14.9443 8.28053 14.5375 8.54431 14.3067C6.49481 14.076 4.34072 13.2824 4.34072 9.74632C4.34072 8.73887 4.69833 7.916 5.29049 7.27C5.18667 7.03698 4.8752 6.09875 5.37124 4.82752C5.37124 4.82752 6.14412 4.57989 7.90908 5.77345C8.64736 5.56811 9.43178 5.4666 10.2162 5.46198C11.0006 5.4666 11.7851 5.56811 12.5233 5.77345C14.2767 4.57989 15.0496 4.82752 15.0496 4.82752C15.5457 6.09875 15.2342 7.03698 15.1419 7.27C15.7302 7.916 16.0878 8.73887 16.0878 9.74632C16.0878 13.2916 13.9307 14.0722 11.8773 14.299C12.2003 14.5759 12.5003 15.1419 12.5003 16.0063C12.5003 17.2414 12.4887 18.2335 12.4887 18.5334C12.4887 18.7756 12.6502 19.064 13.1232 18.9718C16.8154 17.7613 19.457 14.3006 19.457 10.2285C19.457 5.13206 15.325 1 10.2285 1Z" />
          </svg>
        </a>
      </nav>
    </footer>
  );
};

export default Footer;
