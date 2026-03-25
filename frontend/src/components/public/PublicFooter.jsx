import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../api/client';

const socialLinks = (site) =>
  [
    { label: 'Facebook', url: site?.socialLinks?.facebook },
    { label: 'Instagram', url: site?.socialLinks?.instagram },
    { label: 'YouTube', url: site?.socialLinks?.youtube },
    { label: 'WhatsApp', url: site?.socialLinks?.whatsapp }
  ].filter((item) => item.url);

export const PublicFooter = ({ site }) => (
  <footer className="site-footer">
    <div className="container site-footer__grid">
      <div>
        <div className="site-footer__brand">
          <img
            src={resolveMediaUrl(site?.branding?.websiteLogoUrl || '/logo-mark.svg')}
            alt={`${site?.collegeName || 'College'} logo`}
            className="site-footer__logo"
          />
          <h3>{site?.collegeName || 'Gurukul Mahavidyalay'}</h3>
        </div>
        <p>{site?.affiliation}</p>
        <p>{site?.contact?.address || site?.location}</p>
        {socialLinks(site).length ? (
          <div className="site-footer__socials">
            {socialLinks(site).map((link) => (
              <a key={link.label} href={link.url} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            ))}
          </div>
        ) : null}
      </div>
      <div>
        <h4>Quick Links</h4>
        <ul>
          {(site?.footer?.quickLinks || []).map((link) => (
            <li key={`${link.label}-${link.path}`}>
              {link.path?.startsWith('http') ? (
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
      <div>
        <h4>Explore</h4>
        <ul>
          {(site?.footer?.exploreLinks || []).map((link) => (
            <li key={`${link.label}-${link.path}`}>
              {link.path?.startsWith('http') ? (
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
      <div>
        <h4>Contact</h4>
        <ul>
          <li>{site?.contact?.phone || 'Phone details coming soon'}</li>
          <li>{site?.contact?.email || 'Email details coming soon'}</li>
        </ul>
      </div>
    </div>
    <div className="site-footer__bottom">
      <div className="container">
        <p>Copyright (c) {new Date().getFullYear()} Gurukul Mahavidyalay. All rights reserved.</p>
      </div>
    </div>
  </footer>
);
