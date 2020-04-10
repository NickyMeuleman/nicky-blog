/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import { Link, graphql } from "gatsby";
import { PostCard } from "@nickymeuleman/gatsby-theme-blog";
import SEO from "../components/SEO";
import GlobalStyles from "../components/GlobalStyles";
import Header from "../components/Header";
import Footer from "../components/Footer";

const IndexPage = ({ data }) => {
  const posts = data.allBlogPost.nodes;
  const blogPath = data.nickyThemeBlogConfig.basePath;
  return (
    <React.Fragment>
      <GlobalStyles />
      <SEO />
      <div
        sx={{
          minHeight: "100vh",
        }}
      >
        <div
          sx={{
            backgroundColor: "mutedBackground",
          }}
        >
          <Header
            passedSx={{ backgroundColor: "transparent", border: "none" }}
          />
          <div
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr minmax(20ch, 70ch) 1fr",
              gridTemplateRows: "1fr",
              px: "5vw", // relates to width of Main
            }}
          >
            <div
              sx={{
                gridColumn: "2/3",
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-end",
                mt: 5,
                mb: 4,
              }}
            >
              <h2
                sx={{
                  fontSize: [2, null, 3],
                  my: 0,
                  lineHeight: 1,
                  fontWeight: "normal",
                }}
              >
                Hey!
              </h2>
              <h1
                sx={{
                  fontSize: [5, null, 6],
                  my: 0,
                  lineHeight: 1,
                  fontWeight: "normal",
                }}
              >
                <span
                  sx={{
                    color: "mutedPrimary",
                    fontWeight: "bold",
                  }}
                >
                  Build
                </span>{" "}
                for the modern web
              </h1>
            </div>
          </div>
        </div>
        <div
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr minmax(20ch, 70ch) 1fr",
            my: 5,
            px: "5vw", // relates to width of Main
          }}
        >
          <div
            sx={{
              gridColumn: "2/3",
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <div sx={{ color: "text" }}>Latest blogposts</div>
            <div sx={{ textTransform: "uppercase", color: "mutedTextBg" }}>
              <Link
                to="/blog"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  letterSpacing: "wide",
                  ":hover": {
                    color: "mutedPrimary",
                  },
                }}
              >
                View all
              </Link>
            </div>
          </div>
          <div
            sx={{
              gridColumn: "2/3",
              display: "grid",
              gap: 4,
              fontSize: 1,
            }}
          >
            {posts.map((post) => {
              return (
                <PostCard
                  key={post.id}
                  url={`/${blogPath}/${post.slug}`}
                  title={post.title}
                  date={post.date}
                  authors={post.authors}
                  coverSizes={
                    post.cover ? post.cover.childImageSharp.fluid : null
                  }
                />
              );
            })}
          </div>
        </div>
        <Footer />
      </div>
    </React.Fragment>
  );
};

export const indexQuery = graphql`
  query IndexQuery {
    nickyThemeBlogConfig {
      basePath
    }
    allBlogPost(
      sort: { order: DESC, fields: date }
      limit: 3
      filter: { published: { eq: true } }
    ) {
      nodes {
        id
        authors {
          shortName
          name
        }
        date
        id
        slug
        title
        cover {
          childImageSharp {
            fluid {
              ...GatsbyImageSharpFluid_withWebp
            }
          }
        }
      }
    }
  }
`;

export default IndexPage;
