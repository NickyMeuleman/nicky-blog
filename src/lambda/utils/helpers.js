const sameOrigin = headers => {
  const { origin, referer, authorization } = headers;

  if (authorization === process.env.BUILD_JWT) {
    return null;
  }

  const whiteList = [
    'https://nickymeuleman.netlify.com',
    'http://nickymeuleman.netlify.com',
    process.env.ORIGIN,
  ];
  const fromSite =
    whiteList.some(str => origin.includes(str)) &&
    whiteList.some(str => referer.includes(str));

  if (fromSite) {
    return null;
  }

  throw new Error('Not allowed');
};

export { sameOrigin };
