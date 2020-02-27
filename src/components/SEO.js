import React from 'react';
import Helmet from 'react-helmet';
import { useStaticQuery, graphql } from 'gatsby';
import * as path from 'path';
import getSocialImage from '../utils/og-image';

const SEO = ({
  meta,
  image,
  title,
  description,
  slug,
  lang = `en`,
  keywords,
  canonicalUrl,
  twitterHandle,
  date,
  author,
  children,
}) => {
  const result = useStaticQuery(graphql`
    query SiteMetadataForSEO {
      site {
        siteMetadata {
          siteUrl
          title
          description
          social {
            twitter
          }
        }
      }
      nickyThemeBlogConfig {
        basePath
      }
    }
  `);

  const { siteMetadata } = result.site;
  const { basePath } = result.nickyThemeBlogConfig;
  const metaDescription = description || siteMetadata.description;
  let metaImage = null;
  if (date) {
    metaImage = getSocialImage({
      title,
      date: new Date(date)
        .toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        .toUpperCase(),
      dateColor: '99A8CF',
      dateExtraConfig: 'letter_spacing_1',
      author: author.name || 'Nicky Meuleman',
      twitter:
        `@${author.twitter}` || siteMetadata.social.twitter || '@NMeuleman',
    });
  } else if (image) {
    metaImage = `${siteMetadata.siteUrl}${image}`;
  }
  let url = `${siteMetadata.siteUrl}${path.join(
    `/`,
    `${basePath}`,
    `${slug}`
  )}`;
  if (url.endsWith(`/`)) {
    // if url ends in "/", remove it
    url = url.slice(0, -1);
  }

  return (
    <Helmet
      title={title}
      defaultTitle={siteMetadata.title}
      titleTemplate={`%s | ${siteMetadata.title}`}
      meta={meta}
    >
      <html lang={lang || `en`} />
      <meta name="description" content={metaDescription} />
      {metaImage && <meta name="image" content={metaImage} />}
      <meta property="og:title" content={title || siteMetadata.title} />
      <meta property="og:url" content={url} />
      <meta property="og:description" content={metaDescription} />
      {metaImage && <meta property="og:image" content={metaImage} />}
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || siteMetadata.title} />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:description" content={metaDescription} />
      {metaImage && <meta name="twitter:image" content={metaImage} />}
      {/* TODO: Consistent @ or not */}
      <meta
        name="twitter:creator"
        content={`@${twitterHandle}` || siteMetadata.social.twitter}
      />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {keywords && <meta name="keywords" content={keywords.join(`, `)} />}
      {children}
    </Helmet>
  );
};

export default SEO;
