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
      resolve: '@nickymeuleman/gatsby-theme-blog',
      options: {
        basePath: 'blog',
        contentPath: 'data/posts',
        assetPath: 'data/assets',
      },
    },
    'gatsby-plugin-theme-ui',
    'gatsby-plugin-extract-schema',
  ],
};
