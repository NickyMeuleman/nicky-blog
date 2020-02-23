/** @jsx jsx */
// import React from 'react';
import { jsx } from 'theme-ui';
import { Link, graphql } from 'gatsby';
import { PostCard } from '@nickymeuleman/gatsby-theme-blog';

const IndexPage = ({ data }) => {
  console.log(data);

  const posts = data.allBlogPost.nodes;
  return (
    <div
      sx={{
        minHeight: '100vh',
      }}
    >
      <div
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '40vh',
          minHeight: '20rem',
          backgroundColor: 'mutedBackground',
        }}
      >
        <header
          sx={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(1rem, 1fr) minmax(20ch, 70ch)  minmax(1rem, 1fr)',
            fontSize: 3,
            py: 3,
          }}
        >
          <span
            sx={{ gridColumn: '2/3', gridRow: '1/1', justifySelf: 'start' }}
          >
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
        <div
          sx={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns:
              'minmax(1rem, 1fr) minmax(20ch, 70ch)  minmax(1rem, 1fr)',
            gridTemplateRows: '1fr',
            fontSize: 3,
          }}
        >
          <div sx={{ gridColumn: '2/3', alignSelf: 'end' }}>
            <h2
              sx={{
                fontSize: 4,
                my: 0,
                lineHeight: 1,
                fontWeight: 'normal',
              }}
            >
              Hey!
            </h2>
            <h1
              sx={{
                fontSize: 7,
                mt: 0,
                mb: 5,
                lineHeight: 1,
                fontWeight: 'normal',
              }}
            >
              <span
                sx={{
                  color: 'mutedPrimary',
                  fontWeight: 'bold',
                }}
              >
                Build
              </span>{' '}
              for the modern web
            </h1>
          </div>
        </div>
      </div>
      <div
        sx={{
          display: 'grid',
          gridTemplateColumns:
            'minmax(1rem, 1fr) minmax(20ch, 70ch)  minmax(1rem, 1fr)',
          fontSize: 3,
          my: 5,
          gap: 3,
        }}
      >
        <div
          sx={{
            gridColumn: '2/3',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <div sx={{ color: 'text' }}>Latest blogposts</div>
          <div sx={{ textTransform: 'uppercase', color: 'mutedTextBg' }}>
            <Link
              to="/blog"
              sx={{
                textDecoration: 'none',
                color: 'inherit',
                letterSpacing: 'wide',
                ':hover': {
                  color: 'mutedPrimary',
                },
              }}
            >
              View all
            </Link>
          </div>
        </div>
        <div
          sx={{
            gridColumn: '2/3',
            display: 'grid',
            gap: 4,
            fontSize: 1,
          }}
        >
          {posts.map(post => {
            return (
              <PostCard
                key={post.id}
                url="/"
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
    </div>
  );
};

export const indexQuery = graphql`
  query IndexQuery {
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
