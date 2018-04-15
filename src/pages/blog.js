import React from 'react';
import Hero from '../components/Hero/Hero';
import PostCard from '../components/PostCard/PostCard';

const PostsPage = ({ data }) => (
  <div>
    <Hero title="Writing things down" />
    <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <PostCard
        key={node.id}
        url={`/blog${node.fields.slug}`}
        title={node.frontmatter.title}
        date={node.frontmatter.date}
      />
    ))}
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
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;
