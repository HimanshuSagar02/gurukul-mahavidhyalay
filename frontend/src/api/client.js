const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const apiUrl = rawApiUrl.replace(/\/$/, '');
const apiOrigin = new URL(apiUrl, window.location.origin).origin;

export const acceptedImageTypes = 'image/jpeg,image/png,image/webp,image/gif';
export const isExternalUrl = (value = '') => value.startsWith('http://') || value.startsWith('https://');
export const isPlaceholderMedia = (value = '') => value.startsWith('/placeholders/');
export const getVisibleSocialLinks = (site) =>
  [
    { label: 'Facebook', url: site?.socialLinks?.facebook },
    { label: 'Instagram', url: site?.socialLinks?.instagram },
    { label: 'YouTube', url: site?.socialLinks?.youtube },
    { label: 'WhatsApp', url: site?.socialLinks?.whatsapp }
  ].filter((item) => item.url);

const request = async (path, options = {}) => {
  const response = await fetch(`${apiUrl}${path}`, {
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
};

export const api = {
  get: (path) => request(path),
  post: (path, body) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  put: (path, body) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body)
    }),
  delete: (path) =>
    request(path, {
      method: 'DELETE'
    })
};

export const resolveMediaUrl = (value) => {
  if (!value) {
    return '';
  }

  if (isExternalUrl(value)) {
    return value;
  }

  if (value.startsWith('/uploads')) {
    return `${apiOrigin}${value}`;
  }

  return value;
};

export const formatDate = (value) => {
  if (!value) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(new Date(value));
};
