/** @jsx jsx */
import React from "react";
import { jsx } from "theme-ui";
import { Link, graphql } from "gatsby";
import { PostCard } from "@nickymeuleman/gatsby-theme-blog";
import { SEO } from "../components/SEO";
import { GlobalStyles } from "../components/GlobalStyles";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

const IndexPage = ({ data }) => {
  const blogposts = data.blogposts.nodes;
  const gardenposts = data.gardenposts.nodes;
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
            <div
              sx={{
                color: "text",
                fontSize: 2,
                position: "relative",
                mb: 2,
                "::before": {
                  content: "''",
                  bottom: 0,
                  position: "absolute",
                  height: "2px",
                  width: "3ch",
                  backgroundColor: "mutedPrimary",
                },
              }}
            >
              Latest blogposts
            </div>
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
            {blogposts.map((post) => {
              return (
                <PostCard
                  key={post.id}
                  url={`/blog/${post.slug}`}
                  title={post.title}
                  date={post.date}
                  authors={post.authors}
                  image={
                    post.cover
                      ? post.cover.childImageSharp.gatsbyImageData
                      : null
                  }
                />
              );
            })}
          </div>
          <div
            sx={{
              gridColumn: "2/3",
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
              mt: 5,
            }}
          >
            <div
              sx={{
                color: "text",
                fontSize: 2,
                position: "relative",
                mb: 2,
                "::before": {
                  content: "''",
                  bottom: 0,
                  position: "absolute",
                  height: "2px",
                  width: "3ch",
                  backgroundColor: "mutedPrimary",
                },
              }}
            >
              Latest digital garden{" "}
              <a
                href="https://joelhooks.com/digital-garden"
                sx={{ color: "text", verticalAlign: "middle" }}
              >
                <svg
                  role="img"
                  width="20"
                  height="20"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  sx={{ display: "inline" }}
                >
                  <title>questionmark</title>
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>{" "}
              posts{" "}
            </div>
            <div sx={{ textTransform: "uppercase", color: "mutedTextBg" }}>
              <Link
                to="/garden"
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
            {gardenposts.map((post) => {
              return (
                <PostCard
                  key={post.id}
                  url={`/garden/${post.slug}`}
                  title={post.title}
                  date={post.date}
                  authors={post.authors}
                  image={
                    post.cover
                      ? post.cover.childImageSharp.gatsbyImageData
                      : null
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
    blogposts: allBlogPost(
      sort: { order: DESC, fields: date }
      limit: 3
      filter: {
        published: { eq: true }
        instance: { basePath: { eq: "blog" } }
      }
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
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
    gardenposts: allBlogPost(
      sort: { order: DESC, fields: date }
      limit: 3
      filter: {
        published: { eq: true }
        instance: { basePath: { eq: "garden" } }
      }
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
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
  }
`;

export default IndexPage;
