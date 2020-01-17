// Based on https://www.learnwithjason.dev/blog/auto-generate-social-image/
// Modified from https://github.com/jlengstorf/get-share-image

function cleanText(text) {
  return encodeURIComponent(text).replace(/%(23|2C|2F|3F|5C)/g, '%25$1');
}

const imageWidthPx = 1280;
const imageHeightPx = 669;
const textAreaPercentage = 65;
const textAreaWidthPx = Math.floor((imageWidthPx / 100) * textAreaPercentage);
// Horizontally center textarea
const textLeftOffsetPx = Math.floor((imageWidthPx - textAreaWidthPx) / 2);
// The magic numbers are the width of the fixed  elements https://res.cloudinary.com/nmeuleman/image/upload/v1579276629/blog-post-card.png
const dateTopOffsetPx = Math.floor(25 + (imageHeightPx - 100 - 6 - 25) / 5);
const titleTopOffsetPx = dateTopOffsetPx + 70;

function generateSocialImage({
  title,
  date,
  cloudName = 'nmeuleman',
  imagePublicID = 'blog-post-card',
  cloudinaryUrlBase = 'https://res.cloudinary.com',
  titleFont = 'SourceSansPro-Regular.ttf',
  titleExtraConfig = '',
  dateExtraConfig = '',
  dateFont = 'SourceSansPro-Regular.ttf',
  imageWidth = imageWidthPx,
  imageHeight = imageHeightPx,
  textAreaWidth = textAreaWidthPx,
  textLeftOffset = textLeftOffsetPx,
  titleTopOffset = titleTopOffsetPx,
  dateTopOffset = dateTopOffsetPx,
  textColor = 'F6F6F6F6',
  titleColor,
  dateColor,
  titleFontSize = 64,
  dateFontSize = 48,
  version = null,
}) {
  // configure social media image dimensions, quality, and format
  const imageConfig = [
    `w_${imageWidth}`,
    `h_${imageHeight}`,
    'c_fill',
    'q_auto',
    'f_auto',
  ].join(',');

  // configure the title text
  const titleConfig = [
    `w_${textAreaWidth}`,
    'c_fit',
    `co_rgb:${titleColor || textColor}`,
    'g_north_west',
    `x_${textLeftOffset}`,
    `y_${titleTopOffset}`,
    `l_text:${titleFont}_${titleFontSize}${titleExtraConfig}:${cleanText(
      title
    )}`,
  ].join(',');

  // configure the date text
  const dateConfig = date
    ? [
        `w_${textAreaWidth}`,
        'c_fit',
        `co_rgb:${dateColor || textColor}`,
        'g_north_west',
        `x_${textLeftOffset}`,
        `y_${dateTopOffset}`,
        `l_text:${dateFont}_${dateFontSize}${dateExtraConfig}:${cleanText(
          date
        )}`,
      ].join(',')
    : undefined;

  // combine all the pieces required to generate a Cloudinary URL
  const urlParts = [
    cloudinaryUrlBase,
    cloudName,
    'image',
    'upload',
    imageConfig,
    titleConfig,
    dateConfig,
    version,
    imagePublicID,
  ];

  // remove any falsy sections of the URL (e.g. an undefined version)
  const validParts = urlParts.filter(Boolean);

  // join all the parts into a valid URL to the generated image
  return validParts.join('/');
}

export default generateSocialImage;
