import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero/Hero';
import PostCard from '../components/PostCard/PostCard';
import { rhythm } from '../utils/typography';

const Container = styled.div`
  margin: 0 ${rhythm(1)} ${rhythm(0.5)} ${rhythm(1)};
  @media (min-width: 55rem) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: ${rhythm(1)};
    margin: 0 ${rhythm(2)} ${rhythm(1.5)} ${rhythm(2)};
  }
  @media (min-width: 70rem) {
    grid-template-columns: 1fr 1fr;
    margin: 0 ${rhythm(3)} ${rhythm(2)} ${rhythm(3)};
  }
`;

const PostsPage = ({ data }) => (
  <div>
    <Hero title="Writing things down" />
    <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
    <Container>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <PostCard
          key={node.id}
          url={`/blog${node.fields.slug}`}
          title={node.frontmatter.title}
          date={node.frontmatter.date}
          coverSizes={node.frontmatter.cover ? node.frontmatter.cover.childImageSharp.sizes : null}
        />
      ))}
    </Container>
  </div>
);

export default PostsPage;

// eslint-disable-next-line
export const query = graphql`
  query PostsQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            cover {
              childImageSharp {
                sizes {
                  ...GatsbyImageSharpSizes_withWebp
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
