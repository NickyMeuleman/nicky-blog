const API = 'https://api.applause-button.com';

const getClaps = url =>
  fetch(`${API}/get-claps${url ? `?url=${url}` : ''}`, {
    headers: {
      'Content-Type': 'text/plain',
    },
  }).then(response => response.text());

const updateClaps = (claps, url) =>
  fetch(`${API}/update-claps${url ? `?url=${url}` : ''}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(claps),
  }).then(response => response.text());

const getMultipleClaps = urlArr =>
  fetch(`${API}/get-multiple`, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(urlArr),
  }).then(response => response.text());

const normalizeUrl = url => {
  let newUrl = url.replace(/^https?:\/\//, '');
  const components = newUrl.split('?');
  if (components.length > 1) {
    [newUrl] = components;
  }
  return newUrl;
};

export { getClaps, updateClaps, getMultipleClaps, normalizeUrl };
