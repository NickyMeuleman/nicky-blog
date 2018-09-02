import React from 'react';
import { Link, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { TABLET_WIDTH, LARGE_DISPLAY_WIDTH } from 'typography-breakpoint-constants';
import Layout from '../components/Layout/Layout';
import Hero from '../components/Hero/Hero';
import { rhythm, scale } from '../utils/typography';

const LinkU = styled(Link)`
  border-bottom: none;
  box-shadow: none;
  height: auto;
  width: auto;
  &:hover {
    background: inherit;
  }
  color: ${props => props.theme.primary};
`;

const ArticleContainer = styled.div`
  display: block;
  & > article {
    box-shadow: 0px 3px 3px #333;
    background: none;
    background-image: linear-gradient(rgba(255, 255, 255, 0.85), #fff 25vh);
    border-radius: 5px;
    padding: ${rhythm(1)};
    h1:first-child {
      margin-top: 0;
    }
  }
  @media (min-width: ${TABLET_WIDTH}) {
    & > article {
      padding: ${rhythm(2)};
    }
    .gatsby-highlight {
      /* use negative margin instead of css grid to preserve margin collapsing */
      margin-left: -${rhythm(2)};
      margin-right: -${rhythm(2)};
    }
  }
  @media (min-width: ${LARGE_DISPLAY_WIDTH}) {
    & > article {
      padding: ${rhythm(3)};
      padding-top: ${rhythm(1)};
    }
  }
`;

const Bottom = styled.section`
  margin: ${rhythm(1)};
  display: grid;
  grid-template-columns: 1fr 1fr;
  h4 {
    color: rgba(0, 0, 0, 0.54);
    margin: 0;
    ${scale(0)};
    line-height: 1;
  }
  [data-next] {
    text-align: right;
  }
  @media (min-width: ${TABLET_WIDTH}) {
    margin: ${rhythm(1)} 0;
  }
`;

const Container = styled.section`
  @media (min-width: ${TABLET_WIDTH}) {
    display: grid;
    grid-template-columns: ${rhythm(2)} 1fr ${rhythm(2)};
    grid-template-rows: ${rhythm(10)} ${rhythm(3)} 1fr;
    & > div:first-child {
      grid-row: 1/3;
      grid-column: 1/-1;
      z-index: 20;
    }
    & > ${ArticleContainer} {
      grid-row: 2/4;
      grid-column: 2/-2;
      z-index: 30;
    }
    & > ${Bottom} {
      grid-row: 4/-1;
      grid-column: 2/-2;
    }
  }
  @media (min-width: ${LARGE_DISPLAY_WIDTH}) {
    grid-template-columns: ${rhythm(4)} minmax(auto, 66em) ${rhythm(4)};
    justify-content: center;
  }
`;

const BlogPostTemplate = ({ data, pageContext }) => {
  const { markdownRemark: post } = data;
  const { prev, next } = pageContext;
  return (
    <Layout>
      <Helmet>
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={post.frontmatter.title} />
        <meta
          name="twitter:image"
          content={
            data.site.siteMetadata.siteUrl +
            (post.frontmatter.cover ? post.frontmatter.cover.childImageSharp.sizes.src : '/icons/icon-256x256.png')
          }
        />
      </Helmet>
      <Container>
        <Hero
          title={post.frontmatter.title}
          coverSizes={post.frontmatter.cover ? post.frontmatter.cover.childImageSharp.sizes : null}
        />
        <ArticleContainer>
          <article>
            <h1>{post.frontmatter.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.html }} />
          </article>
        </ArticleContainer>
        <Bottom>
          <div>
            {prev && (
              <LinkU to={`/blog${prev.fields.slug}`}>
                <h4>Older</h4>
                <span data-prev>←</span>
                <span>{prev.frontmatter.title}</span>
              </LinkU>
            )}
          </div>
          <div data-next>
            {next && (
              <LinkU to={`/blog${next.fields.slug}`}>
                <h4>Newer</h4>
                <span>{next.frontmatter.title}</span>
                <span>→</span>
              </LinkU>
            )}
          </div>
        </Bottom>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostQuery($slug: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
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
    }
  }
`;

export default BlogPostTemplate;
