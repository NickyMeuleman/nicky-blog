const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

// Create slugs for pages
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode });
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
              frontmatter {
                title
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        return reject(result.errors);
      }
      // filter drafts
      const blogPosts = result.data.allMarkdownRemark.edges.filter(edge => !edge.node.frontmatter.draft);

      // create blog-post pages
      blogPosts.forEach(({ node }, i) => {
        const next = i === 0 ? null : blogPosts[i - 1].node;
        const prev = i === blogPosts.length - 1 ? null : blogPosts[i + 1].node;

        createPage({
          path: `/blog${node.fields.slug}`,
          component: path.resolve('./src/templates/blog-post.js'),
          context: {
            slug: node.fields.slug,
            prev,
            next,
          },
        });
      });

      // create blog-list pages
      const postsPerPage = 6;
      const numPages = Math.ceil(blogPosts.length / postsPerPage);
      Array.from({ length: numPages }).forEach((_, i) => {
        createPage({
          path: i === 0 ? `/blog` : `/blog/${i + 1}`,
          component: path.resolve('./src/templates/blog.js'),
          context: {
            limit: postsPerPage,
            skip: i * postsPerPage,
            numPages,
            currentPage: i + 1,
          },
        });
      });
      return resolve();
    });
  });
};
