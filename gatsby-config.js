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
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `pages`,
        path: `${__dirname}/content/`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 590,
              linkImagesToOriginal: false,
            },
          },
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
            },
          },
          'gatsby-remark-copy-linked-files',
          `gatsby-remark-autolink-headers`,
        ],
      },
    },
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography.js`,
        omitGoogleFont: true,
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: 'Nicky Meuleman',
        short_name: 'NickyM',
        start_url: '/',
        background_color: '#f5f5f5',
        theme_color: '#155799',
        display: 'minimal-ui',
        icon: 'static/favicon.svg',
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: `gatsby-plugin-sitemap`,
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: 'UA-117805994-1',
        head: false,
        anonymize: true,
        respectDNT: true,
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
    'gatsby-plugin-netlify-cache',
    'gatsby-plugin-extract-schema',
    `gatsby-plugin-lodash`,
    'gatsby-plugin-netlify', // keep as last in array
  ],
};
