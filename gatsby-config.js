const remarkMath = require(`remark-math`);
const visit = require(`unist-util-visit`);

// add metastring properties as seperate properties
// turns $$ title=something (so {meta: "title=something"}) into {title: "something"}
const re = /\b([-\w]+)(?:=(?:"([^"]*)"|'([^']*)'|([^"'\s]+)))?/g;
const transformer = (ast) => {
  visit(ast, `element`, (node) => {
    let match;
    if (node?.properties?.className?.includes(`math-display`) && node.meta) {
      re.lastIndex = 0; // Reset regex.
      while ((match = re.exec(node.meta))) {
        node.properties[match[1]] = match[2] || match[3] || match[4] || true;
      }
    }
  });
};

const rehypeMetaAsAttributes = () => transformer;

module.exports = {
  siteMetadata: {
    title: `Nicky blogs`,
    siteUrl: `https://nickymeuleman.netlify.com`,
    description: `Nicky tries to blog`,
    social: {
      twitter: `@NMeuleman`,
    },
  },
  plugins: [
    {
      resolve: `@nickymeuleman/gatsby-theme-blog`,
      options: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [rehypeMetaAsAttributes],
        assetPath: `data/assets`,
        instances: [
          {
            basePath: `blog`,
            contentPath: `data/posts`,
          },
          {
            basePath: `garden`,
            contentPath: `data/garden`,
          },
        ],
      },
    },
    `gatsby-plugin-theme-ui`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Nicky Meuleman`,
        short_name: `NickyM`,
        start_url: `/`,
        background_color: `#222b40`,
        theme_color: `rgb(176, 251, 188)`,
        display: `minimal-ui`,
        icon: `static/favicon.svg`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: `UA-117805994-1`,
        head: false,
        anonymize: true,
        respectDNT: true,
      },
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        // the site_url field populates the <link> in the xml <channel>
        // the description field populates the <description> in the xml <channel>
        query: `
        {
          site {
            siteMetadata {
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
        feeds: [
          {
            serialize: ({ query: { site, allBlogPost } }) =>
              allBlogPost.nodes.map((node) => {
                const url = `${site.siteMetadata.siteUrl}/blog/${node.slug}`;
                return {
                  title: node.title,
                  date: node.date,
                  url,
                  guid: url,
                  custom_elements: [
                    {
                      "content:encoded": `<div style="width: 100%; margin: 0 auto; max-width: 800px; padding: 40px 40px;">
                          <p>
                            A new article <em>"${node.title}"</em> was posted. You can <a href="${url}">read it online</a>.
                          </p>
                        </div>`,
                    },
                  ],
                };
              }),
            query: `
            {
              allBlogPost(
                limit: 25
                sort: { fields: [date], order: DESC }
                filter: {
                  published: { ne: false }
                  instance: { basePath: { eq: "blog" } }
                }
              ) {
                nodes {
                  title
                  slug
                  date
                }
              }
            }
             `,
            output: `/blog/rss.xml`,
            // optional configuration to insert feed reference in pages:
            // if `string` is used, it will be used to create RegExp and then test if pathname of
            // current page satisfied this regular expression;
            // if not provided or `undefined`, all pages will have feed reference inserted
            match: `^/blog/`,
            title: `Nicky Meuleman Blog RSS Feed`,
          },
        ],
      },
    },
    `gatsby-plugin-sitemap`,
    // "gatsby-plugin-netlify", // keep as last in array
  ],
};
