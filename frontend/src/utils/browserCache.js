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
