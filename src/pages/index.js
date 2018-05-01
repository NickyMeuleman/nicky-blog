import React from 'react';
import Link from 'gatsby-link';
import Hero from '../components/Hero/Hero';

const IndexPage = ({ data }) => (
  <div>
    <Hero
      title="Building for the modern web"
      typedStrings={['Web applications', 'Landing pages', 'Responsive designs', 'Static websites']}
    />
    <h4>{data.allMarkdownRemark.totalCount} Posts</h4>
    {data.allMarkdownRemark.edges.map(({ node }) => (
      <div key={node.id}>
        <Link to={`/blog${node.fields.slug}`}>
          <h3>
            {node.frontmatter.title} <span>— {node.frontmatter.date}</span>
          </h3>
          <p>{node.excerpt}</p>
        </Link>
      </div>
    ))}
  </div>
);

export default IndexPage;

// eslint-disable-next-line
export const query = graphql`
  query IndexQuery {
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "DD MMMM, YYYY")
          }
          excerpt
          fields {
            slug
          }
        }
      }
    }
  }
`;
