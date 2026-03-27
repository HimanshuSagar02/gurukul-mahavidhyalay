import { Link } from 'react-router-dom';
import { getVisibleSocialLinks, isExternalUrl, resolveMediaUrl } from '../../api/client';

const fallbackLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Admission', path: '/admissions' },
  { label: 'Contact', path: '/contact' }
];

const getFooterLinks = (site) => {
  const sourceLinks = [...(site?.footer?.quickLinks || []), ...(site?.footer?.exploreLinks || [])];
  const dedupedLinks = sourceLinks.filter(
    (link, index) =>
      link?.label &&
      link?.path &&
      sourceLinks.findIndex((item) => item.label === link.label && item.path === link.path) === index
  );

  return dedupedLinks.length ? dedupedLinks : fallbackLinks;
};

const sanitizePhoneLink = (value = '') => value.replace(/[^\d+]/g, '');

export const PublicFooter = ({ site }) => {
  const footerLinks = getFooterLinks(site);
  const socialLinks = getVisibleSocialLinks(site);
  const contactItems = [
    site?.contact?.address ? { label: 'Address', value: site.contact.address } : null,
    site?.contact?.phone
      ? { label: 'Phone', value: site.contact.phone, href: `tel:${sanitizePhoneLink(site.contact.phone)}` }
      : null,
    site?.contact?.email ? { label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` } : null
  ].filter(Boolean);

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div>
          <div className="site-footer__brand">
            <span className="site-footer__logo-frame">
              <img
                src={resolveMediaUrl(site?.branding?.websiteLogoUrl || '/logo-mark.svg')}
                alt={`${site?.collegeName || 'College'} logo`}
                className="site-footer__logo"
                loading="lazy"
                decoding="async"
              />
            </span>
            <h3>{site?.collegeName || 'Gurukul Mahavidyalya'}</h3>
          </div>
          {site?.location ? <p>{site.location}</p> : null}
          {site?.affiliation ? <p>{site.affiliation}</p> : null}
          {socialLinks.length ? (
            <div className="site-footer__socials">
              {socialLinks.map((link) => (
                <a key={link.label} href={link.url} target="_blank" rel="noreferrer" aria-label={link.label}>
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="site-footer__nav">
          <h4>Navigation</h4>
          <ul>
            {footerLinks.map((link) => (
              <li key={`${link.label}-${link.path}`}>
                {isExternalUrl(link.path) ? (
                  <a href={link.path} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ) : (
                  <Link to={link.path}>{link.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {contactItems.length ? (
          <div>
            <h4>Contact</h4>
            <ul className="site-footer__contact-list">
              {contactItems.map((item) => (
                <li key={item.label}>
                  <span>{item.label}</span>
                  {item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="site-footer__bottom">
        <div className="container">
          <p>Copyright (c) {new Date().getFullYear()} {site?.collegeName || 'Gurukul Mahavidyalya'}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
