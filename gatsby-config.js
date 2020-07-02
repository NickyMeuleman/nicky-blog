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
        basePath: "blog",
        contentPath: "data/posts",
        assetPath: "data/assets",
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
