const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'content' });
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
          edges {
            node {
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        createPage({
          path: `/blog${node.fields.slug}`,
          component: path.resolve('./src/templates/blog-post.js'),
          context: {
            slug: node.fields.slug,
          },
        });
      });
      const postsPerPage = 3;
      const numPages = Math.ceil(result.data.allMarkdownRemark.edges.length / postsPerPage);
      Array.from({ length: numPages }).forEach((_, i) => {
        createPage({
          path: i === 0 ? `/blog` : `/blog/${i + 1}`,
          component: path.resolve('./src/templates/blog.js'),
          context: {
            limit: postsPerPage,
            skip: i * postsPerPage,
            numPages,
            pageIndex: i + 1,
            isFirst: i === 0,
            isLast: i === numPages - 1,
          },
        });
      });
      resolve();
    });
  });
};
