import React from 'react';
import { graphql, Link } from 'gatsby';

import kebabCase from 'lodash/kebabCase';

import Helmet from 'react-helmet';
import Layout from '../../components/Layout/Layout';

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
  },
}) => {
  const uniqGroup = group.reduce((lookup, tag) => {
    const key = kebabCase(tag.fieldValue.toLowerCase());
    if (!lookup[key]) {
      lookup[key] = Object.assign(tag, {
        slug: `/blog/tags/${key}`,
      });
    }
    return lookup;
  }, {});

  return (
    <Layout>
      <Helmet title="Tags" />
      <div>
        <h1>Tags</h1>
        <ul>
          {Object.keys(uniqGroup)
            .sort((tagA, tagB) => tagA.localeCompare(tagB))
            .map(key => {
              const tag = uniqGroup[key];
              return (
                <li key={tag.fieldValue}>
                  <Link to={tag.slug}>
                    {tag.fieldValue} ({tag.totalCount})
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    </Layout>
  );
};

export default TagsPage;

export const tagsPageQuery = graphql`
  query {
    allMarkdownRemark(limit: 2000, filter: { frontmatter: { draft: { ne: true } } }) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
