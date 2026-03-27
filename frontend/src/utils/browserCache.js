export const PUBLIC_SITE_CACHE_KEY = 'gurukul-public-site-cache-v1';
export const PUBLIC_HOME_CACHE_KEY = 'gurukul-public-home-cache-v1';

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

export const readCachedJson = (key) => {
  if (!canUseStorage()) {
    return null;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? JSON.parse(rawValue) : null;
  } catch {
    return null;
  }
};

export const writeCachedJson = (key, value) => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota and serialization issues for non-critical UI cache.
  }
};

export const clearCachedJson = (key) => {
  if (!canUseStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore storage issues for non-critical UI cache.
  }
};

export const syncPublicSiteSnapshot = (site) => {
  if (!site || typeof site !== 'object') {
    return;
  }

  writeCachedJson(PUBLIC_SITE_CACHE_KEY, site);
};

export const syncPublicHomeSnapshot = (site) => {
  if (!site || typeof site !== 'object') {
    return;
  }

  const currentHome = readCachedJson(PUBLIC_HOME_CACHE_KEY);
  if (currentHome && typeof currentHome === 'object' && !Array.isArray(currentHome)) {
    writeCachedJson(PUBLIC_HOME_CACHE_KEY, {
      ...currentHome,
      site
    });
  }
};
