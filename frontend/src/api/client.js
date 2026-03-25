const rawApiUrl = import.meta.env.VITE_API_URL || '/api';
const apiUrl = rawApiUrl.replace(/\/$/, '');
const apiOrigin = new URL(apiUrl, window.location.origin).origin;

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

  if (value.startsWith('http://') || value.startsWith('https://')) {
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
