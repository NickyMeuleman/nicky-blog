import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero/Hero';
import PostCard from '../components/PostCard/PostCard';
import { rhythm } from '../utils/typography';

const Container = styled.div`
  margin: 0 ${rhythm(1)} ${rhythm(0.5)} ${rhythm(1)};
  & > * {
    margin-bottom: ${rhythm(1)};
  }
  & > div:first-of-type {
    grid-column: 1/3;
  }
  @media (min-width: 55rem) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: ${rhythm(1)};
    margin: 0 ${rhythm(2)} ${rhythm(1.5)} ${rhythm(2)};
    & > * {
      margin-bottom: 0;
    }
  }
  @media (min-width: 70rem) {
    grid-template-columns: 1fr 1fr;
    margin: 0 ${rhythm(3)} ${rhythm(2)} ${rhythm(3)};
  }
`;

const IndexPage = ({ data }) => (
  <div>
    <Hero
      title="Building for the modern web"
      typedStrings={['Web applications', 'Landing pages', 'Responsive designs', 'Static websites']}
    />
    <Container>
      <p>
        <span role="img" aria-label="sparkling star">
          ✨
        </span>{' '}
        Recent posts ({data.allMarkdownRemark.totalCount} total)
      </p>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <PostCard
          key={node.id}
          url={`/blog${node.fields.slug}`}
          title={node.frontmatter.title}
          date={node.frontmatter.date}
          author={node.frontmatter.author}
          coverSizes={node.frontmatter.cover ? node.frontmatter.cover.childImageSharp.sizes : null}
        />
      ))}
    </Container>
  </div>
);

export default IndexPage;

// eslint-disable-next-line
export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 3) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            author
            cover {
              childImageSharp {
                sizes(maxWidth: 1920) {
                  base64
                  aspectRatio
                  src
                  srcSet
                  srcWebp
                  srcSetWebp
                  sizes
                }
              }
            }
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
