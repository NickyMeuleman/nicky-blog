import React from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import { TABLET_WIDTH, LARGE_DISPLAY_WIDTH } from 'typography-breakpoint-constants';
import PostCard from '../components/PostCard/PostCard';
import { rhythm, scale } from '../utils/typography';
import Layout from '../components/Layout/Layout';
import TypedStrings from '../components/TypedStrings/TypedStrings';

const Container = styled.div`
  display: grid;
  grid-template-columns: 5vw 1fr 5vw;
  grid-template-rows: ${rhythm(8)} auto 1fr;
`;

const Triangle = styled.div`
  grid-row: 1/-1;
  grid-column: 1/-1;
  background: ${props => `linear-gradient(120deg, ${props.theme.primary} 5%, ${props.theme.secondary})`};
  clip-path: polygon(0 0, 0% 20rem, 90% 0);
  z-index: 1;
  overflow: hidden;
`;

const HeroContent = styled.div`
  grid-column: 2/-2;
  grid-row: 1/2;
  align-self: center;
  z-index: 5;
  & > h1 {
    color: #f5f5f5;
    padding: 0;
    margin-top: 0;
    margin-bottom: ${rhythm(0.1)};
  }
  .type-wrap {
    color: #f5f5f5;
    ${scale(2 / 3)};
  }
  .typed-cursor {
    color: ${props => props.theme.primaryLighter};
    opacity: 1;
    animation: typedjsBlink 0.7s infinite;
    -webkit-animation: typedjsBlink 0.7s infinite;
    animation: typedjsBlink 0.7s infinite;
  }
  @keyframes typedjsBlink {
    50% {
      opacity: 0;
    }
  }
`;

const Content = styled.div`
  z-index: 5;
  grid-row: 2/-2;
  grid-column: 2/-2;
  & > * {
    margin-bottom: ${rhythm(1)};
  }
  & > div:first-of-type {
    grid-column: 1/3;
  }
  @media (min-width: ${TABLET_WIDTH}) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    grid-gap: ${rhythm(1)};
    & > * {
      margin-bottom: 0;
    }
  }
  @media (min-width: ${LARGE_DISPLAY_WIDTH}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const IndexPage = ({ data }) => (
  <Layout>
    <Container>
      <Triangle />
      <HeroContent>
        <h1>Building for the modern web</h1>
        <TypedStrings strings={['Web applications', 'Landing pages', 'Responsive designs', 'Static websites']} />
      </HeroContent>
      <Content>
        <p>
          <span role="img" aria-label="sparkling star">
            ✨
          </span>{' '}
          Recent posts ({data.allMarkdownRemark.totalCount} total)
        </p>
        {data.allMarkdownRemark.edges.map(({ node }, i) => (
          <PostCard
            key={node.id}
            featured={i === 0}
            url={`/blog${node.fields.slug}`}
            title={node.frontmatter.title}
            date={node.frontmatter.date}
            author={node.frontmatter.author}
            coverSizes={node.frontmatter.cover ? node.frontmatter.cover.childImageSharp.fluid : null}
            excerpt={node.excerpt}
          />
        ))}
      </Content>
    </Container>
  </Layout>
);

export default IndexPage;

export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 3) {
      totalCount
      edges {
        node {
          excerpt(pruneLength: 250)
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
            author
            cover {
              childImageSharp {
                fluid(maxWidth: 1920) {
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
