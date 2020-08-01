module.exports = {
  siteMetadata: {
    title: "Nicky blogs",
    siteUrl: "https://nickymeuleman.netlify.com",
    description: "Nicky tries to blog",
    social: {
      twitter: "@NMeuleman",
    },
  },
  plugins: [
    {
      resolve: "@nickymeuleman/gatsby-theme-blog",
      options: {
        assetPath: "data/assets",
        instances: [
          {
            basePath: "blog",
            contentPath: "data/posts",
          },
          {
            basePath: "garden",
            contentPath: "data/garden",
          },
        ],
      },
    },
    "gatsby-plugin-theme-ui",
    "gatsby-plugin-extract-schema",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Nicky Meuleman",
        short_name: "NickyM",
        start_url: "/",
        background_color: "#222b40",
        theme_color: "rgb(176, 251, 188)",
        display: "minimal-ui",
        icon: "static/favicon.svg",
      },
    },
    "gatsby-plugin-remove-serviceworker",
    {
      resolve: "gatsby-plugin-google-analytics",
      options: {
        trackingId: "UA-117805994-1",
        head: false,
        anonymize: true,
        respectDNT: true,
      },
    },
    "gatsby-plugin-sitemap",
    "gatsby-plugin-netlify", // keep as last in array
  ],
};
