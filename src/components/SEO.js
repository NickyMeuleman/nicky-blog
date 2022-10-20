import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import * as path from "path";
import { generateSocialImage } from "../utils/og-image";

const SEO = ({
  image,
  title,
  description,
  slug,
  keywords,
  canonicalUrl,
  twitterHandle,
  date,
  author,
  basePath = ``,
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
    }
  `);

  const { siteMetadata } = result.site;
  const metaDescription = description || siteMetadata.description;
  let metaImage = null;
  if (date) {
    metaImage = generateSocialImage({
      title,
      date: new Date(date)
        .toLocaleDateString(`en-US`, {
          year: `numeric`,
          month: `long`,
          day: `numeric`,
        })
        .toUpperCase(),
      dateColor: `99A8CF`,
      dateExtraConfig: `letter_spacing_2`,
      author: author.name || `Nicky Meuleman`,
      twitter:
        `@${author.twitter}` || siteMetadata.social.twitter || `@NMeuleman`,
      titleFontSize: 64,
      dateFontSize: 36,
      authorFontSize: 36,
      twitterFontSize: 36,
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

  const formattedTitle = title
    ? `${title} | ${siteMetadata.title}`
    : siteMetadata.title;

  return (
    <React.Fragment>
      <title>{formattedTitle}</title>
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
    </React.Fragment>
  );
};

export { SEO };
