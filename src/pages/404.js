/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link } from "gatsby";

const NotFoundPage = () => (
  <div
    sx={{
      height: "100vh",
      width: "90vw",
      margin: "0 auto",
      paddingLeft: [0, 6],
      paddingTop: [0, 5],
      fontSize: 4,
      fontFamily:
        '"Segoe UI", Roboto, "Helvetica Neue", Ubuntu, Arial, sans-serif',
    }}
  >
    <h1 sx={{ fontSize: "8rem", marginTop: 0 }}>:(</h1>
    <h2>Woops!</h2>
    <p sx={{ my: 2 }}>This page was not found.</p>
    <p sx={{ my: 2 }}>
      I&apos;m not sure how you got here, but you are now looking at an
      uninteresting, empty page.
    </p>
    <div sx={{ fontSize: 3, mt: 5 }}>
      {"Check out "}
      <Link to="/" sx={{ variant: "styles.a" }}>
        the home page
      </Link>
      {" or "}
      <Link to="/blog" sx={{ variant: "styles.a" }}>
        the blog
      </Link>
      {" instead."}
    </div>
  </div>
);

export default NotFoundPage;
