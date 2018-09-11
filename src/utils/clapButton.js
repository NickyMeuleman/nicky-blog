const normalizeUrl = url => {
  let newUrl = url.replace(/^https?:\/\//, '');
  const components = newUrl.split('?');
  if (components.length > 1) {
    [newUrl] = components;
  }
  return newUrl;
};

export { normalizeUrl as default };
