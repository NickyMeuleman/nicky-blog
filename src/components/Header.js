/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "gatsby";

const Header = ({ passedSx }) => {
  return (
    <header
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(20ch, 70ch) 1fr",
        py: 4,
        px: "5vw", // relates to width of Main
        backgroundColor: "mutedBackground",
        borderBottom: "2px solid",
        borderBottomColor: "mutedPrimary",
        ...passedSx,
      }}
    >
      <span sx={{ gridColumn: "2/3", gridRow: "1/1", justifySelf: "start" }}>
        <Link
          to="/"
          sx={{
            textDecoration: "none",
            color: "mutedText",
            display: ["none", "block"],
          }}
        >
          NickyMeuleman
        </Link>
        <Link
          to="/"
          aria-label="Nicky Meuleman"
          sx={{
            textDecoration: "none",
            color: "mutedText",
            display: ["block", "none"],
          }}
        >
          Nime
        </Link>
      </span>
      <nav
        sx={{
          gridColumn: "2/3",
          gridRow: "1/1",
          justifySelf: "end",
          display: "flex",
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
              variant: "styles.Header.link",
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
              variant: "styles.Header.link",
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
              variant: "styles.Header.link",
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

export { Header };
