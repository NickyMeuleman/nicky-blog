import React from 'react';
import Hero from '../components/Hero/Hero';

const BlogPostTemplate = ({ data }) => {
  const { markdownRemark: post } = data;
  return (
    <div>
      <Hero title={post.frontmatter.title} />
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
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
