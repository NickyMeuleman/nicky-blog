import React from 'react';
import Helmet from 'react-helmet';
import { StaticQuery, graphql } from 'gatsby';
import getSocialImage from '../../utils/og-image';

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

const SEO = ({ meta, title, description, slug, date }) => (
  <StaticQuery
    query={query}
    render={data => {
      const { siteMetadata } = data.site;
      const metaDescription = description || siteMetadata.description;
      const metaImage = getSocialImage({
        title,
        date: new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
      });
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
              content: 'summary_large_image',
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
