import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';

const query = graphql`
  query GetSiteMetadata {
    site {
      siteMetadata {
        title
        description
        siteUrl
        social {
          twitter
        }
      }
    }
  }
`;

const SEO = ({ meta, image, title, description, slug }) => (
  <StaticQuery
    query={query}
    render={data => {
      const { siteMetadata } = data.site;
      const metaDescription = description || siteMetadata.description;
      const metaImage = image ? `${siteMetadata.siteUrl}${image}` : null;
      const url = `${siteMetadata.siteUrl}${slug}`;
      return (
        <Helmet
          htmlAttributes={{ lang: 'en' }}
          {...(title
            ? {
                titleTemplate: `%s - ${siteMetadata.title}`,
                title,
              }
            : {
                title: siteMetadata.title,
              })}
          meta={[
            {
              name: 'description',
              content: metaDescription,
            },
            {
              property: 'og:url',
              content: url,
            },
            {
              property: 'og:title',
              content: title || siteMetadata.title,
            },
            {
              name: 'og:description',
              content: metaDescription,
            },
            {
              name: 'twitter:card',
              content: 'summary',
            },
            {
              name: 'twitter:creator',
              content: siteMetadata.social.twitter,
            },
            {
              name: 'twitter:title',
              content: title || siteMetadata.title,
            },
            {
              name: 'twitter:description',
              content: metaDescription,
            },
          ]
            .concat(
              metaImage
                ? [
                    {
                      property: 'og:image',
                      content: metaImage,
                    },
                    {
                      name: 'twitter:image',
                      content: metaImage,
                    },
                  ]
                : []
            )
            .concat(meta)}
        />
      );
    }}
  />
);

SEO.defaultProps = {
  meta: [],
  title: '',
  slug: '',
};

export { SEO as default };
