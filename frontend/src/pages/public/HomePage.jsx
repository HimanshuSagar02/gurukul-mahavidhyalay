import { Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, formatDate, resolveMediaUrl } from '../../api/client';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SectionHeading } from '../../components/SectionHeading';
import { AdvertisementPopup } from '../../components/public/AdvertisementPopup';

export const HomePage = () => {
  const { site: sharedSite } = useOutletContext();
  const [data, setData] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const loadHome = async () => {
      const response = await api.get('/public/home');
      setData(response);
    };

    loadHome();
  }, []);

  const site = data?.site || sharedSite;
  const slides = site?.hero?.slides || [];
  const socialLinks = [
    { label: 'Facebook', url: site?.socialLinks?.facebook },
    { label: 'Instagram', url: site?.socialLinks?.instagram },
    { label: 'YouTube', url: site?.socialLinks?.youtube },
    { label: 'WhatsApp', url: site?.socialLinks?.whatsapp }
  ].filter((item) => item.url);

  useEffect(() => {
    if (slides.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  if (!site || !data) {
    return <LoadingScreen label="Please wait..." />;
  }

  return (
    <>
      <AdvertisementPopup popup={data.popup} />

      <section className="hero">
        <div className="hero__media">
          {slides.map((slide, index) => (
            <div
              key={`${slide.title}-${slide.image}`}
              className={`hero__slide ${index === activeSlide ? 'hero__slide--active' : ''}`}
              style={{ backgroundImage: `url(${resolveMediaUrl(slide.image)})` }}
            />
          ))}
          <div className="hero__overlay" />
        </div>

        <div className="container hero__content">
          <div className="hero__copy">
            <span className="hero__eyebrow">{site.hero.bannerNote}</span>
            <h1>{site.collegeName}</h1>
            <p className="hero__subtitle">{site.affiliation}</p>
            <p>{site.hero.headline}</p>
            <p>{site.hero.subheadline}</p>

            <div className="hero__actions">
              <Link to="/admissions" className="button">
                {site.hero.primaryCtaLabel}
              </Link>
              <Link to="/courses" className="button button--secondary">
                {site.hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <aside className="hero__panel">
            <span className="hero__panel-label">At a Glance</span>
            <h2>Bachelor of Arts</h2>
            <ul>
              <li>Location: {site.location}</li>
              <li>Popular subjects: English, Hindi, Drawing, Home Science, Sociology</li>
              <li>Affiliation: {site.affiliation}</li>
            </ul>
          </aside>
        </div>

        <div className="hero__ticker">
          <div className="container hero__ticker-inner">
            <span>Highlights</span>
            <p>{site.announcementTicker}</p>
          </div>
        </div>
      </section>

      <section className="section section--muted">
        <div className="container identity-grid">
          <article className="identity-card">
            <SectionHeading
              eyebrow="Our Identity"
              title={site.branding?.managementLogoTitle || 'Management Logo'}
              description={site.affiliation}
            />
            {site.branding?.managementLogoUrl ? (
              <div className="identity-card__logo">
                <img
                  src={resolveMediaUrl(site.branding.managementLogoUrl)}
                  alt={site.branding.managementLogoTitle || 'Management logo'}
                />
              </div>
            ) : (
              <p className="identity-card__copy">
                The management emblem will appear here soon.
              </p>
            )}
          </article>

          <article className="identity-card">
            <SectionHeading
              eyebrow="Stay Connected"
              title="Social Links"
              description="Follow our latest updates and campus moments."
            />
            {socialLinks.length ? (
              <div className="social-link-list">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.url} target="_blank" rel="noreferrer" className="social-link-chip">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <p className="identity-card__copy">
                Our social links will be shared here soon.
              </p>
            )}
          </article>
        </div>
      </section>

      <section className="section section--warm">
        <div className="container panel-grid">
          <article className="content-panel">
            <div className="content-panel__header">
              <h3>Latest Updates</h3>
            </div>
            <div className="content-panel__body">
              {data.notifications.length ? (
                data.notifications.map((notice) => (
                  <div key={notice._id} className="notice-row">
                    <div className="notice-row__date">{formatDate(notice.publishedAt)}</div>
                    <div>
                      <strong>{notice.title}</strong>
                      <p>{notice.description || 'More details will be shared soon.'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No updates right now"
                  description="Fresh updates will appear here soon."
                />
              )}
              <Link to="/notifications" className="text-link">
                View all updates
              </Link>
            </div>
          </article>

          <article className="content-panel">
            <div className="content-panel__header">
              <h3>About Us</h3>
            </div>
            <div className="content-panel__body">
              <p>{site.about.introduction}</p>
              <div className="mini-copy-block">
                <strong>Mission</strong>
                <p>{site.about.mission}</p>
              </div>
              <Link to="/about" className="text-link">
                Read more
              </Link>
            </div>
          </article>

          <article className="content-panel">
            <div className="content-panel__header">
              <h3>Featured Course</h3>
            </div>
            <div className="content-panel__body">
              {data.courses.map((course) => (
                <div key={course._id}>
                  <strong>{course.title}</strong>
                  <p>{course.overview}</p>
                  <ul className="subject-list">
                    {course.subjects.map((subject) => (
                      <li key={subject}>{subject}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <Link to="/courses" className="text-link">
                View course details
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="feature-split">
            <div className="feature-split__image-wrap">
              <img
                src={resolveMediaUrl(site.about.principalImage)}
                alt={site.about.principalName || 'Principal'}
                className="feature-split__image"
              />
            </div>
            <div className="feature-split__content">
              <SectionHeading
                eyebrow="From the Principal"
                title={site.about.principalName || 'Principal'}
                description={site.about.principalDesignation}
              />
              <p className="lead-copy">{site.about.principalMessage}</p>
              <div className="dual-copy">
                <div>
                  <h3>Mission</h3>
                  <p>{site.about.mission}</p>
                </div>
                <div>
                  <h3>Vision</h3>
                  <p>{site.about.vision}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {site.motivation?.enabled ? (
        <section className="section">
          <div className="container motivation-panel">
            {site.motivation?.imageUrl ? (
              <div className="motivation-panel__image">
                <img src={resolveMediaUrl(site.motivation.imageUrl)} alt={site.motivation.title || 'Motivation'} />
              </div>
            ) : null}
            <div className="motivation-panel__content">
              <SectionHeading
                eyebrow="A Word of Encouragement"
                title={site.motivation?.title || 'Student Motivation'}
                description="A few words to inspire every learner."
              />
              <p className="lead-copy">{site.motivation?.text}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--muted">
        <div className="container">
          <SectionHeading
            eyebrow="Gallery"
            title="Campus life and special moments"
            description="A quick look at memorable moments from college life."
          />

          {data.gallery.length ? (
            <div className="gallery-preview">
              {data.gallery.slice(0, 3).map((item) => (
                <article key={item._id} className="gallery-preview__item">
                  <img src={resolveMediaUrl(item.imageUrl)} alt={item.caption || 'Gallery item'} />
                  <div className="gallery-preview__caption">
                    {item.category ? <span className="gallery-card__eyebrow">{item.category}</span> : null}
                    <strong>{item.caption || 'College gallery update'}</strong>
                    {item.photoOf ? <p className="gallery-card__detail">Featuring: {item.photoOf}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="More moments coming soon"
              description="Please visit again to see the latest highlights."
            />
          )}

          <div className="section__actions">
            <Link to="/gallery" className="button button--secondary">
              View gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container contact-strip">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Need help with admissions or college details?"
              description={site.contact.inquiryText}
            />
          </div>
          <div className="contact-strip__details">
            <div>
              <span>Address</span>
              <strong>{site.contact.address}</strong>
            </div>
            <div>
              <span>Phone</span>
              <strong>{site.contact.phone || 'Coming soon'}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{site.contact.email || 'Coming soon'}</strong>
            </div>
          </div>
          <Link to="/contact" className="button">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
};
