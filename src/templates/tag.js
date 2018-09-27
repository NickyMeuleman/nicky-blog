import React from 'react';
import { Link, graphql } from 'gatsby';

import Layout from '../components/Layout/Layout';

const TagTemplate = ({ pageContext, data }) => {
  const { tag } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  const tagHeader = `${totalCount} post${totalCount === 1 ? `` : `s`} tagged with "${tag}"`;

  return (
    <Layout>
      <h1>{tagHeader}</h1>
      <ul>
        {edges.map(({ node }) => {
          const {
            frontmatter: { title },
            fields: { slug },
          } = node;
          return (
            <li key={slug}>
              <Link to={`/blog${slug}`}>{title}</Link>
            </li>
          );
        })}
      </ul>
      <Link to="/blog/tags">All tags</Link>
    </Layout>
  );
};

export default TagTemplate;

export const tagTemplateQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] }, draft: { ne: true } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`;
