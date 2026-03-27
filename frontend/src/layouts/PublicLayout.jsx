import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { LoadingScreen } from '../components/LoadingScreen';
import { PublicFooter } from '../components/public/PublicFooter';
import { PublicHeader } from '../components/public/PublicHeader';

const upsertMetaTag = (attribute, key, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);

  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }

  tag.setAttribute('content', content);
};

const upsertLinkTag = (rel, href) => {
  let tag = document.head.querySelector(`link[rel="${rel}"]`);

  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    document.head.appendChild(tag);
  }

  tag.setAttribute('href', href);
};

const upsertJsonLd = (id, payload) => {
  let script = document.head.querySelector(`script[data-seo-id="${id}"]`);

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-seo-id', id);
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(payload);
};

const buildPageSeo = (pathname, site) => {
  const collegeName = (site?.collegeName || 'Gurukul Mahavidhyalya').trim();
  const fullLocation = (site?.location || 'Khusalpur, District Rampur, Teh. Swar').trim();
  const shortLocation = fullLocation.split(',')[0]?.trim() || fullLocation;
  const brand = shortLocation ? `${collegeName} ${shortLocation}` : collegeName;
  const affiliation = site?.affiliation?.trim();

  const seoByPath = {
    '/': {
      title: `${brand} | BA Admission & Courses`,
      description: `${collegeName} in ${fullLocation}${affiliation ? ` is affiliated with ${affiliation} and` : ''} offers admission help, B.A. course details, college notices, gallery updates, and contact information.`
    },
    '/about': {
      title: `About ${collegeName} | College Profile & Leadership`,
      description: `Read about ${collegeName}, its mission, leadership, campus values, and academic environment for students in ${fullLocation}.`
    },
    '/courses': {
      title: `${collegeName} Courses | BA Subjects, Eligibility & Duration`,
      description: `Explore ${collegeName} course details, B.A. subjects, eligibility, duration, and academic information for new students.`
    },
    '/admissions': {
      title: `${collegeName} Admission | Apply Online for BA Course`,
      description: `Apply for admission at ${collegeName}. Check eligibility, submit the online admission form, and connect with the college admission team.`
    },
    '/notifications': {
      title: `${collegeName} Notifications | Latest College Notices`,
      description: `See the latest admission notices, announcements, and official college updates from ${collegeName}.`
    },
    '/gallery': {
      title: `${collegeName} Gallery | Campus Photos & Activities`,
      description: `View campus photos, events, student activities, and gallery highlights from ${collegeName}.`
    },
    '/contact': {
      title: `Contact ${collegeName} | Address, Map & Admission Help`,
      description: `Contact ${collegeName} for admission support, address details, map location, and general college inquiries.`
    }
  };

  return seoByPath[pathname] || seoByPath['/'];
};

const buildStructuredData = (site) => {
  const origin = window.location.origin;
  const collegeName = (site?.collegeName || 'Gurukul Mahavidhyalya').trim();
  const location = (site?.location || 'Khusalpur, District Rampur, Teh. Swar').trim();
  const description = site?.hero?.subheadline?.trim() || site?.hero?.headline?.trim() || `${collegeName} admissions, courses, notices, and contact information.`;
  const logoPath = site?.branding?.websiteLogoUrl?.trim();
  const contactAddress = site?.contact?.address?.trim() || location;
  const socialLinks = Object.values(site?.socialLinks || {}).filter(Boolean);

  const organization = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: collegeName,
    description,
    url: origin,
    address: {
      '@type': 'PostalAddress',
      streetAddress: contactAddress,
      addressLocality: location
    }
  };

  if (logoPath) {
    organization.logo = new URL(logoPath, origin).href;
  }

  if (site?.contact?.phone) {
    organization.telephone = site.contact.phone.trim();
  }

  if (site?.contact?.email) {
    organization.email = site.contact.email.trim();
  }

  if (site?.affiliation) {
    organization.parentOrganization = {
      '@type': 'Organization',
      name: site.affiliation.trim()
    };
  }

  if (socialLinks.length) {
    organization.sameAs = socialLinks;
  }

  return organization;
};

export const PublicLayout = () => {
  const location = useLocation();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSite = async () => {
      try {
        const data = await api.get('/public/site');
        setSite(data.site);
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, []);

  useEffect(() => {
    const { title, description } = buildPageSeo(location.pathname, site);
    const logoPath = site?.branding?.websiteLogoUrl?.trim() || '/logo-mark.svg';

    document.title = title;
    upsertMetaTag('name', 'description', description);
    upsertMetaTag('property', 'og:title', title);
    upsertMetaTag('property', 'og:description', description);
    upsertMetaTag('property', 'og:type', 'website');
    upsertMetaTag('property', 'og:url', window.location.href);
    upsertMetaTag('name', 'twitter:title', title);
    upsertMetaTag('name', 'twitter:description', description);
    upsertLinkTag('icon', logoPath);
    upsertJsonLd('college-organization', buildStructuredData(site));
  }, [location.pathname, site]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="public-shell">
      <PublicHeader site={site} />
      <main>
        <Outlet context={{ site }} />
      </main>
      <PublicFooter site={site} />
    </div>
  );
};
