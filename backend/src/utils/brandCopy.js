const isPlainObject = (value) => {
  if (Object.prototype.toString.call(value) !== '[object Object]') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const affiliationPattern = /\b(affiliated|affiliation|university|board|council|institute)\b/i;
const locationPattern = /\b(khusalpur|district|dist\.?|teh\.?|tehsil|village|rampur|swar|road|near|address)\b/i;

export const normalizeCollegeSpelling = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value
    .replace(/\bMahavidhyalya\b/g, 'Mahavidyalya')
    .replace(/\bMahavidyalay\b/g, 'Mahavidyalya');
};

export const normalizeAffiliationText = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  return value.replace(/^\s*affiliated\s+(with|to)\s+/i, '').trim();
};

export const normalizeSiteIdentityFields = (site = {}) => {
  const rawLocation = typeof site.location === 'string' ? site.location.trim() : site.location;
  const rawAffiliation = typeof site.affiliation === 'string' ? site.affiliation.trim() : site.affiliation;

  let location = rawLocation;
  let affiliation = normalizeAffiliationText(rawAffiliation);

  const locationLooksLikeAffiliation = typeof location === 'string' && affiliationPattern.test(location);
  const affiliationLooksLikeLocation = typeof affiliation === 'string' && locationPattern.test(affiliation);

  if (locationLooksLikeAffiliation && affiliationLooksLikeLocation) {
    location = rawAffiliation;
    affiliation = normalizeAffiliationText(rawLocation);
  }

  return {
    location,
    affiliation
  };
};

export const normalizeCollegeSpellingDeep = (value) => {
  if (typeof value === 'string') {
    return normalizeCollegeSpelling(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeCollegeSpellingDeep(item));
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entryValue]) => [key, normalizeCollegeSpellingDeep(entryValue)])
    );
  }

  return value;
};
