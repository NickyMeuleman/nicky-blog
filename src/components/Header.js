/** @jsx jsx */
import { jsx } from 'theme-ui';
import { Link } from 'gatsby';

const Header = ({ passedSx }) => {
  return (
    <header
      sx={{
        display: 'grid',
        gridTemplateColumns:
          'minmax(1rem, 1fr) minmax(20ch, 70ch)  minmax(1rem, 1fr)',
        py: 4,
        backgroundColor: 'mutedBackground',
        borderBottom: '2px solid',
        borderBottomColor: 'mutedPrimary',
        ...passedSx,
      }}
    >
      <span sx={{ gridColumn: '2/3', gridRow: '1/1', justifySelf: 'start' }}>
        <Link
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'text',
          }}
        >
          NickyMeuleman
        </Link>
      </span>
      <nav
        sx={{
          gridColumn: '2/3',
          gridRow: '1/1',
          justifySelf: 'end',
          display: 'flex',
          //   Chrome doesn't support "gap" for flexbox yet, sadface
          span: {
            marginLeft: 4,
          },
        }}
      >
        <span>
          <Link
            to="/"
            sx={{
              variant: 'styles.a',
              border: 'none',
              '&.is-active': {
                borderBottomWidth: `2px`,
                borderBottomStyle: `solid`,
                borderBottomColor: `mutedPrimary`,
              },
            }}
            activeClassName="is-active"
          >
            Home
          </Link>
        </span>
        <span>
          <Link
            to="/uses"
            sx={{
              variant: 'styles.a',
              border: 'none',
              '&.is-active': {
                borderBottomWidth: `2px`,
                borderBottomStyle: `solid`,
                borderBottomColor: `mutedPrimary`,
              },
            }}
            activeClassName="is-active"
          >
            Uses
          </Link>
        </span>
        <span>
          <Link
            to="/blog"
            sx={{
              variant: 'styles.a',
              border: 'none',
              '&.is-active': {
                borderBottomWidth: `2px`,
                borderBottomStyle: `solid`,
                borderBottomColor: `mutedPrimary`,
              },
            }}
            activeClassName="is-active"
          >
            Blog
          </Link>
        </span>
      </nav>
    </header>
  );
};

export default Header;
