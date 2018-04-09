import React from 'react';
import styled from 'styled-components';
import Hero from '../components/Hero/Hero';
import { rhythm } from '../utils/typography';

const ArticleContainer = styled.div`
  display: grid;
  grid-template-rows: ${rhythm(1)} 1fr ${rhythm(1)};
  grid-template-columns: ${rhythm(4)} 1fr 1fr ${rhythm(4)};
  & > article {
    background-color: #fff;
    grid-column: 2/4;
    grid-row: 2/3;
    border-radius: 5px;
    padding: ${rhythm(3)};
    h1:first-child {
      margin-top: 0;
    }
  }
`;

const BlogPostTemplate = ({ data }) => {
  const { markdownRemark: post } = data;
  return (
    <div>
      <Hero title={post.frontmatter.title} />
      <ArticleContainer>
        <article dangerouslySetInnerHTML={{ __html: post.html }} />
      </ArticleContainer>
    </div>
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
