import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { TABLET_WIDTH, LARGE_DISPLAY_WIDTH } from 'typography-breakpoint-constants';
import Hero from '../components/Hero/Hero';
import PostCard from '../components/PostCard/PostCard';
import { rhythm } from '../utils/typography';
import Layout from '../components/Layout/Layout';

const Container = styled.div`
  margin: 0 ${rhythm(1)} ${rhythm(0.5)} ${rhythm(1)};
  & > * {
    margin-bottom: ${rhythm(1)};
  }
  & > p {
    grid-column: 1/3;
  }
  @media (min-width: ${TABLET_WIDTH}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: ${rhythm(1)};
    margin: 0 ${rhythm(2)} ${rhythm(1.5)} ${rhythm(2)};
    & > * {
      margin-bottom: 0;
    }
  }
  @media (min-width: ${LARGE_DISPLAY_WIDTH}) {
    grid-template-columns: 1fr 1fr;
    margin: 0 ${rhythm(3)} ${rhythm(2)} ${rhythm(3)};
  }
`;

const PostsPage = ({ data }) => (
  <Layout>
    <Hero title="Writing things down" />
    <Container>
      <p>{data.allMarkdownRemark.totalCount} Posts</p>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <PostCard
          key={node.id}
          url={`/blog${node.fields.slug}`}
          title={node.frontmatter.title}
          date={node.frontmatter.date}
          author={node.frontmatter.author}
          coverSizes={node.frontmatter.cover ? node.frontmatter.cover.childImageSharp.fluid : null}
        />
      ))}
    </Container>
  </Layout>
);

export default PostsPage;

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
            author
            cover {
              childImageSharp {
                fluid {
                  ...GatsbyImageSharpFluid_withWebp
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
