import React from 'react';
import { Link, graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { TABLET_WIDTH, LARGE_DISPLAY_WIDTH } from 'typography-breakpoint-constants';
import Layout from '../components/Layout/Layout';
import Hero from '../components/Hero/Hero';
import ClapButton from '../components/ClapButton/ClapButton';
import { rhythm, scale } from '../utils/typography';

const LinkU = styled(Link)`
  border-bottom: none;
  box-shadow: none;
  height: auto;
  width: auto;
  color: ${props => props.theme.primary};
  &:hover {
    background: ${props => props.theme.primaryLighter};
  }
`;

const UnderPost = styled.div`
  margin: ${rhythm(2)} ${rhythm(1)};

  @media (min-width: ${TABLET_WIDTH}) {
    max-width: calc(100vw - 3rem);
    width: 40rem;
    margin-left: auto;
    margin-right: auto;
  }
  @media (min-width: ${LARGE_DISPLAY_WIDTH}) {
    width: 60rem;
  }
`;

const Adjacent = styled.div`
  display: flex;
  justify-content: space-between;
  & > * {
    flex: 1;
  }
  h4 {
    color: rgba(0, 0, 0, 0.54);
    margin: 0;
    ${scale(0)};
    line-height: 1;
  }
  [data-next] {
    text-align: right;
  }
`;

const Container = styled.div`
  & > div:first-child {
    position: relative;
    z-index: 1;
    height: ${rhythm(13)};
  }
  article {
    position: relative;
    z-index: 30;
    background-image: linear-gradient(rgba(255, 255, 255, 0.75), #fff ${rhythm(5)});
    padding: ${rhythm(1)};
    margin: 0 auto;
    margin-top: ${rhythm(-5)};

    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.34);
    h1:first-child {
      margin-top: 0;
    }
    .gatsby-highlight {
      /* break code block out of container */
      width: calc(100% + ${rhythm(2)});
      /* use negative margin instead of css grid to preserve margin collapsing */
      margin-left: -${rhythm(1)};
      border-radius: 0;
    }
    @media (min-width: ${TABLET_WIDTH}) {
      max-width: 40rem;
      margin-left: auto;
      margin-right: auto;
    }
    @media (min-width: ${LARGE_DISPLAY_WIDTH}) {
      max-width: 60rem;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

const BlogPostTemplate = ({ data, pageContext, location }) => {
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
        <article>
          <h1>{post.frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
        <UnderPost>
          <ClapButton
            key={location.href}
            location={location}
            style={{ marginBottom: rhythm(1), width: '58px', height: '58px' }}
            color="rgba(21,87,153,1)"
          />
          <Adjacent>
            <div>
              {prev && (
                <LinkU to={`/blog${prev.fields.slug}`}>
                  <h4>Older</h4>
                  <span data-prev style={{ width: '1rem', marginLeft: '-1rem' }}>
                    ←
                  </span>
                  <span>{prev.frontmatter.title}</span>
                </LinkU>
              )}
            </div>
            <div data-next>
              {next && (
                <LinkU to={`/blog${next.fields.slug}`}>
                  <h4>Newer</h4>
                  <span>{next.frontmatter.title}</span>
                  <span style={{ width: '1rem', marginRight: '-1rem' }}>→</span>
                </LinkU>
              )}
            </div>
          </Adjacent>
        </UnderPost>
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
