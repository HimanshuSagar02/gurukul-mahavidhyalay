import { Link, NavLink } from 'react-router-dom';
import { resolveMediaUrl } from '../../api/client';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'New Admission', path: '/admissions' },
  { label: 'Notifications', path: '/notifications' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Contact', path: '/contact' }
];

export const PublicHeader = ({ site }) => (
  <header className="site-header">
    <div className="top-strip">
      <div className="container top-strip__inner">
        <div className="top-strip__text">
          <span>Trusted Learning, Lasting Values</span>
          <span>{site?.location}</span>
        </div>
        <div className="top-strip__links">
          {(site?.headerLinks || []).map((link) =>
            link.path?.startsWith('http') ? (
              <a key={`${link.label}-${link.path}`} href={link.path} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ) : (
              <Link key={`${link.label}-${link.path}`} to={link.path}>
                {link.label}
              </Link>
            )
          )}
        </div>
      </div>
    </div>

    <div className="brand-header">
      <div className="container brand-header__inner">
        <Link to="/" className="brand-header__identity">
          <img
            src={resolveMediaUrl(site?.branding?.websiteLogoUrl || '/logo-mark.svg')}
            alt={`${site?.collegeName || 'College'} logo`}
            className="brand-header__logo"
          />
          <div>
            <p className="brand-header__eyebrow">Proudly Affiliated</p>
            <h1>{site?.collegeName || 'Gurukul Mahavidyalay'}</h1>
            <p>{site?.affiliation}</p>
            <p>{site?.location}</p>
          </div>
        </Link>

        <div className="brand-header__highlights">
          <div>
            <span className="brand-header__meta-label">Course</span>
            <strong>B.A.</strong>
          </div>
          <div>
            <span className="brand-header__meta-label">Affiliation</span>
            <strong>{site?.affiliation || 'Guru Jambheshwar University'}</strong>
          </div>
          <div>
            <span className="brand-header__meta-label">Admissions</span>
            <strong>Now Open</strong>
          </div>
        </div>
      </div>
    </div>

    <nav className="main-nav">
      <div className="container main-nav__inner">
        <div className="main-nav__links">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <span className="main-nav__search" aria-hidden="true">
          Explore
        </span>
      </div>
    </nav>
  </header>
);
