import React from 'react';
import { graphql } from 'gatsby';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { TABLET_WIDTH, LARGE_DISPLAY_WIDTH } from 'typography-breakpoint-constants';
import Layout from '../components/Layout/Layout';
import { rhythm } from '../utils/typography';
// import React from 'react';
// import { Link, graphql } from 'gatsby';
// import Helmet from 'react-helmet';
// import styled from 'styled-components';
// import { TABLET_WIDTH, LARGE_DISPLAY_WIDTH } from 'typography-breakpoint-constants';
// import Layout from '../components/Layout/Layout';
// import Hero from '../components/Hero/Hero';
// import { rhythm, scale } from '../utils/typography';

const Container = styled.div`
  /* Horizontal scrolling near tablet width */
  /* overflow: hidden; */
  background: #f5f5f5;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: ${rhythm(12)} ${rhythm(5)} auto 1fr;
  div:first-child {
    width: 100%;
    height: 100%;
    grid-column: 1/-1;
    grid-row: 1 / 3;
  }
  article {
    grid-column: 2 / -2;
    grid-row: 2 / -2;
    background-image: linear-gradient(rgba(255, 255, 255, 0.75), #fff ${rhythm(5)});
    padding: ${rhythm(1)};
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.34);
    h1:first-child {
      margin-top: 0;
    }
    .gatsby-highlight {
      /* use negative margin instead of css grid to preserve margin collapsing */
      margin-left: -${rhythm(1)};
      margin-right: -${rhythm(1)};
      border-radius: 0;
    }
  }
  div:last-child {
    grid-column: 2/-2;
    grid-row: -2/-1;
  }

  @media (min-width: ${TABLET_WIDTH}) {
    grid-template-columns: ${rhythm(2)} 1fr ${rhythm(2)};
    justify-content: center;
  }
  @media (min-width: ${LARGE_DISPLAY_WIDTH}) {
    grid-template-columns: minmax(${rhythm(4)}, 1fr) minmax(auto, 66em) minmax(${rhythm(4)}, 1fr);
  }
`;

const BlogPostTemplate = ({ data, pageContext }) => {
  const { markdownRemark: post } = data;
  // const { prev, next } = pageContext;
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
        <div style={{ background: 'green' }}>
          {/* <img src="https://source.unsplash.com/random" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> */}
        </div>
        <article>
          <h1>{post.frontmatter.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.html }} />
        </article>
        <div style={{ background: 'blue' }}>
          <p>under article</p>
        </div>
      </Container>
    </Layout>
  );
};

export const query = graphql`
  query BlogPostQueryTwo($slug: String!) {
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
