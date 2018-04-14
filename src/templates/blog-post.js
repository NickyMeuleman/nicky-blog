import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero/Hero';
import { rhythm } from '../utils/typography';

const ArticleContainer = styled.div`
  display: block;
  & > article {
    background-color: #fff;
    grid-column: 2/3;
    grid-row: 2/3;
    border-radius: 5px;
    padding: ${rhythm(1)};
    h1:first-child {
      margin-top: 0;
    }
  }
  @media (min-width: 55rem) {
    display: grid;
    grid-template-columns: ${rhythm(2)} 1fr ${rhythm(2)};
    grid-template-rows: ${rhythm(1)} 1fr ${rhythm(1)};
    & > article {
      padding: ${rhythm(2)};
    }
    .gatsby-highlight {
      /* use negative margin instead of css grid to preserve margin collapsing */
      margin-left: -${rhythm(2)};
      margin-right: -${rhythm(2)};
    }
  }
  @media (min-width: 70rem) {
    grid-template-columns: ${rhythm(4)} 1fr ${rhythm(4)};
    & > article {
      padding: ${rhythm(3)};
    }
  }
`;

const Section = styled.section`
  @media (min-width: 55rem) {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: ${rhythm(6)} ${rhythm(4)} 1fr;
    & > div:first-child {
      grid-row: 1/3;
      grid-column: 1/2;
      z-index: 20;
    }
    & > div:last-child {
      grid-row: 2/4;
      grid-column: 1/2;
      z-index: 30;
    }
  }
`;

// TODO: accomplish overlap without divitis, maybe use styled(ReactComponent)

const BlogPostTemplate = ({ data }) => {
  const { markdownRemark: post } = data;
  return (
    <Section>
      <div>
        <Hero title={post.frontmatter.title} />
      </div>
      <div>
        <ArticleContainer>
          <article dangerouslySetInnerHTML={{ __html: post.html }} />
        </ArticleContainer>
      </div>
    </Section>
  );
};

// eslint-disable-next-line
export const query = graphql`
  query BlogPostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;

export default BlogPostTemplate;
