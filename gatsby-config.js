module.exports = {
  siteMetadata: {
    title: 'Nicky blogs',
    siteUrl: 'https://nickymeuleman.netlify.com',
    description: 'Nicky tries to blog',
    social: {
      twitter: '@NMeuleman',
    },
  },
  plugins: [
    {
      resolve: `@nickymeuleman/gatsby-theme-blog`,
      options: {
        contentPath: `posts`,
        assetPath: `data`,
        basePath: `blog`,
        pagination: {
          postsPerPage: 10,
          prefixPath: `page`,
        },
      },
    },
    `gatsby-plugin-extract-schema`,
  ],
};
