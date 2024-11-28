/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// Based on https://www.learnwithjason.dev/blog/auto-generate-social-image/
// Modified from https://github.com/jlengstorf/get-share-image

function cleanText(text: any) {
  return encodeURIComponent(text).replace(/%(23|2C|2F|3F|5C)/g, `%25$1`);
}

// The magic numbers are the width of the fixed  elements https://res.cloudinary.com/nmeuleman/image/upload/social-card.png
const bumperTopPx = 4;
const bumperBottomPx = 12;
const imageWidthPx = 1280;
const imageHeightPx = 669;
const paddingBoxYPx = 67;
const paddingBoxXPx = 129;
const textLeftOffsetPx = Math.floor(paddingBoxXPx + paddingBoxYPx);
// const textLeftOffsetPx = Math.floor(paddingBoxXPx * (3 / 2));
const textAreaWidthPx = imageWidthPx - 4 * paddingBoxXPx;
const dateTopOffsetPx = 2 * paddingBoxYPx + bumperTopPx;
const titleTopOffsetPx = dateTopOffsetPx + paddingBoxYPx;
const authorBottomOffsetPx = 2 * paddingBoxYPx + bumperBottomPx;
const twitterBottomOffsetPx = 2 * paddingBoxYPx + bumperBottomPx;
// const authorBottomOffsetPx = Math.floor((3 / 2) * paddingBoxYPx);
// const twitterBottomOffsetPx = Math.floor((3 / 2) * paddingBoxYPx);

function generateSocialImage({
  //@ts-ignore
  title,
  //@ts-ignore
  date,
  author = `Nicky Meuleman`,
  twitter = `@NMeuleman`,
  cloudName = `nmeuleman`,
  imagePublicID = `social-card4`,
  cloudinaryUrlBase = `https://res.cloudinary.com`,
  titleFont = `SourceSansPro-Bold.ttf`,
  titleExtraConfig = ``,
  dateExtraConfig = ``,
  authorExtraConfig = ``,
  twitterExtraConfig = ``,
  dateFont = `SourceSansPro-Bold.ttf`,
  imageWidth = imageWidthPx,
  imageHeight = imageHeightPx,
  textAreaWidth = textAreaWidthPx,
  textLeftOffset = textLeftOffsetPx,
  titleTopOffset = titleTopOffsetPx,
  dateTopOffset = dateTopOffsetPx,
  authorBottomOffset = authorBottomOffsetPx,
  twitterBottomOffset = twitterBottomOffsetPx,
  textColor = `F6F6F6F6`,
  //@ts-ignore
  titleColor,
  //@ts-ignore
  dateColor,
  authorColor = `DFE5F3`,
  twitterColor = `DFE5F3`,
  titleFontSize = 64,
  dateFontSize = 24,
  authorFont = `SourceSansPro-Regular.ttf`,
  authorFontSize = 36,
  twitterFont = `SourceSansPro-Regular.ttf`,
  twitterFontSize = 36,
  version = undefined,
}) {
  // configure social media image dimensions, quality, and format
  const imageConfig = [
    `w_${imageWidth}`,
    `h_${imageHeight}`,
    `c_fill`,
    `q_auto`,
    `f_auto`,
  ].join(`,`);

  // configure the title text
  const titleConfig = [
    `w_${textAreaWidth}`,
    `c_fit`,
    `co_rgb:${titleColor || textColor}`,
    `g_north_west`,
    `x_${textLeftOffset}`,
    `y_${titleTopOffset}`,
    `l_text:${titleFont}_${titleFontSize}${titleExtraConfig}:${cleanText(
      title,
    )}`,
  ].join(`,`);

  // configure the date text
  const dateConfig = date
    ? [
        `w_${textAreaWidth}`,
        `c_fit`,
        `co_rgb:${dateColor || textColor}`,
        `g_north_west`,
        `x_${textLeftOffset}`,
        `y_${dateTopOffset}`,
        `l_text:${dateFont}_${dateFontSize}${dateExtraConfig}:${cleanText(
          date,
        )}`,
      ].join(`,`)
    : undefined;

  // configure the author text
  const authorConfig = author
    ? [
        `w_${Math.floor(textAreaWidth / 2)}`,
        `c_fit`,
        `co_rgb:${authorColor || textColor}`,
        `g_south_west`,
        `x_${textLeftOffset}`,
        `y_${authorBottomOffset}`,
        `l_text:${authorFont}_${authorFontSize}${authorExtraConfig}:${cleanText(
          author,
        )}`,
      ].join(`,`)
    : undefined;

  // configure the twitter text
  const twitterConfig = twitter
    ? [
        `w_${Math.floor(textAreaWidth / 2)}`,
        `c_fit`,
        `co_rgb:${twitterColor || textColor}`,
        `g_south_east`,
        `x_${textLeftOffset}`,
        `y_${twitterBottomOffset}`,
        `l_text:${twitterFont}_${twitterFontSize}${twitterExtraConfig}:${cleanText(
          twitter,
        )}`,
      ].join(`,`)
    : undefined;

  // combine all the pieces required to generate a Cloudinary URL
  const urlParts = [
    cloudinaryUrlBase,
    cloudName,
    `image`,
    `upload`,
    imageConfig,
    titleConfig,
    dateConfig,
    authorConfig,
    twitterConfig,
    version,
    imagePublicID,
  ];

  // remove any falsy sections of the URL (e.g. an undefined version)
  const validParts = urlParts.filter(Boolean);

  // join all the parts into a valid URL to the generated image
  return validParts.join(`/`);
}

export { generateSocialImage };
