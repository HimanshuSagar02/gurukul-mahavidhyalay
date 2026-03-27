import { Link, NavLink } from 'react-router-dom';
import { resolveMediaUrl } from '../../api/client';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Admission', path: '/admissions' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' }
];

const sanitizePhoneLink = (value = '') => value.replace(/[^\d+]/g, '');

export const PublicHeader = ({ site }) => {
  const utilityItems = [
    site?.location ? { label: 'Location', value: site.location } : null,
    site?.affiliation ? { label: 'Affiliation', value: site.affiliation } : null,
    site?.contact?.phone
      ? { label: 'Phone', value: site.contact.phone, href: `tel:${sanitizePhoneLink(site.contact.phone)}` }
      : null
  ].filter(Boolean);

  return (
    <header className="site-header">
      <div className="brand-header">
        <div className="container brand-header__inner">
          <Link to="/" className="brand-header__identity">
            <span className="brand-header__logo-frame">
              <img
                src={resolveMediaUrl(site?.branding?.websiteLogoUrl || '/logo-mark.svg')}
                alt={`${site?.collegeName || 'College'} logo`}
                className="brand-header__logo"
                decoding="async"
              />
            </span>
            <div>
              <p className="brand-header__eyebrow">Official Website</p>
              <h1>{site?.collegeName || 'Gurukul Mahavidhyalya'}</h1>
              {site?.location ? <p>{site.location}</p> : null}
              {site?.affiliation ? <p>{site.affiliation}</p> : null}
            </div>
          </Link>

          <div className="brand-header__utility">
            {utilityItems.length ? (
              <div className="brand-header__meta">
                {utilityItems.map((item) =>
                  item.href ? (
                    <a key={item.label} href={item.href}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </a>
                  ) : (
                    <div key={item.label}>
                      <span>{item.label}</span>
                      <strong>{item.value}</strong>
                    </div>
                  )
                )}
              </div>
            ) : null}

            <div className="button-row">
              <Link to="/admissions" className="button button--secondary">
                {site?.hero?.primaryCtaLabel || 'Apply Now'}
              </Link>
              {site?.contact?.email ? (
                <a href={`mailto:${site.contact.email}`} className="button button--ghost">
                  Email Us
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <nav className="main-nav" aria-label="Primary navigation">
        <div className="container main-nav__inner">
          <div className="main-nav__links">
            {navItems.map((item) => (
              <NavLink key={item.path} to={item.path} end={item.path === '/'}>
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
};
