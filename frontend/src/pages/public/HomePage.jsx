import { Link, useOutletContext } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api, formatDate, isPlaceholderMedia, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SectionHeading } from '../../components/SectionHeading';
import { AdvertisementPopup } from '../../components/public/AdvertisementPopup';
import { readCachedJson, writeCachedJson } from '../../utils/browserCache';

const PUBLIC_HOME_CACHE_KEY = 'gurukul-public-home-cache-v1';

const buildLeadershipCard = (eyebrow, title, designation, message, imageUrl) => {
  const safeImageUrl = String(imageUrl || '/placeholders/principal-placeholder.svg').trim();
  if (!title && !designation && !message && !safeImageUrl) {
    return null;
  }

  return {
    eyebrow,
    title,
    designation,
    message,
    imageUrl: safeImageUrl
  };
};

const sanitizePhoneLink = (value = '') => value.replace(/[^\d+]/g, '');
const buildCount = (value) => String(Math.max(0, Number(value) || 0)).padStart(2, '0');
const formatDisplayTitle = (value = '') =>
  String(value || '')
    .trim()
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => {
      if (/^[A-Z0-9]{2,}$/.test(word) && word.length <= 5) {
        return word;
      }

      const lowerWord = word.toLowerCase();
      return `${lowerWord.charAt(0).toUpperCase()}${lowerWord.slice(1)}`;
    })
    .join(' ');

const defaultFacilityItems = [
  {
    title: 'Library',
    badge: 'LB',
    description: 'Quiet reading support with reference material, guided study time, and subject access for undergraduate learning.'
  },
  {
    title: 'Labs',
    badge: 'LM',
    description: 'Practical learning spaces that support subject work, demonstrations, and everyday academic preparation.'
  },
  {
    title: 'Hostel Support',
    badge: 'HS',
    description: 'Student support services focused on comfort, discipline, and a dependable study environment when needed.'
  },
  {
    title: 'Sports',
    badge: 'SP',
    description: 'Physical activity, recreation, and participation-focused campus culture to support confidence and wellbeing.'
  }
];

const defaultAdmissionSteps = [
  {
    step: '01',
    title: 'Submit Application',
    description: 'Complete the admission form with personal details, marks, subjects, and contact information.'
  },
  {
    step: '02',
    title: 'Document Review',
    description: 'The college team reviews eligibility, submitted records, and the selected academic combination.'
  },
  {
    step: '03',
    title: 'Confirmation',
    description: 'Applicants receive guidance for the next step, including verification, contact, and admission communication.'
  },
  {
    step: '04',
    title: 'Start the Session',
    description: 'Once confirmed, students can follow notices, academic updates, and the beginning of the programme cycle.'
  }
];

const defaultTestimonials = [
  {
    name: 'Student Voice',
    role: 'Undergraduate Student',
    quote: 'The admission process is simple to follow and the college communication remains clear and dependable.'
  },
  {
    name: 'Parent Feedback',
    role: 'College Community',
    quote: 'Important updates, academic guidance, and contact details are easy to understand and access.'
  },
  {
    name: 'Alumni Perspective',
    role: 'Graduate',
    quote: 'A disciplined environment and consistent guidance help students move forward with confidence.'
  }
];

export const HomePage = () => {
  const { site: sharedSite } = useOutletContext();
  const [data, setData] = useState(() => readCachedJson(PUBLIC_HOME_CACHE_KEY));
  const [loadingHome, setLoadingHome] = useState(() => !readCachedJson(PUBLIC_HOME_CACHE_KEY));
  const [activeManagementSlide, setActiveManagementSlide] = useState(0);

  useEffect(() => {
    let isActive = true;

    const loadHome = async () => {
      try {
        const response = await api.get('/public/home', { attempts: 3, retryDelayMs: 450 });

        if (!isActive) {
          return;
        }

        setData(response);
        writeCachedJson(PUBLIC_HOME_CACHE_KEY, response);
      } catch {
        // Keep the last successful home snapshot if the request fails during startup.
      } finally {
        if (isActive) {
          setLoadingHome(false);
        }
      }
    };

    loadHome();

    return () => {
      isActive = false;
    };
  }, []);

  const site = data?.site || sharedSite;
  const homeData = data || { site, courses: [], notifications: [], gallery: [], popup: null };
  const courses = homeData.courses || [];
  const featuredCourse = courses[0] || null;
  const coursesPreview = courses.slice(0, 3);
  const notifications = homeData.notifications || [];
  const announcementItems = notifications.length
    ? notifications.slice(0, 3)
    : site?.announcementTicker
      ? [
          {
            _id: 'announcement-ticker',
            title: 'Latest Notice',
            description: site.announcementTicker,
            category: 'Announcement',
            publishedAt: new Date().toISOString()
          }
        ]
      : [];
  const gallery = homeData.gallery || [];
  const galleryPreview = gallery.slice(0, 6);
  const managementProfiles = [...(site?.about?.managementProfiles || [])]
    .filter((profile) => {
      const hasImage = profile?.imageUrl && !isPlaceholderMedia(profile.imageUrl);
      return profile?.name || profile?.work || profile?.experience || hasImage;
    })
    .sort((first, second) => Number(first.displayOrder || 0) - Number(second.displayOrder || 0));
  const leadershipCards = [
    buildLeadershipCard(
      'From the Principal',
      site?.about?.principalName || 'Principal',
      site?.about?.principalDesignation,
      site?.about?.principalMessage,
      site?.about?.principalImage
    ),
    buildLeadershipCard(
      'From the Chief Executive Officer',
      site?.about?.ceoName || 'Chief Executive Officer',
      site?.about?.ceoDesignation,
      site?.about?.ceoMessage,
      site?.about?.ceoImage
    )
  ].filter(Boolean);
  const contactItems = [
    site?.contact?.address ? { label: 'Address', value: site.contact.address } : null,
    site?.contact?.phone
      ? { label: 'Phone', value: site.contact.phone, href: `tel:${sanitizePhoneLink(site.contact.phone)}` }
      : null,
    site?.contact?.email ? { label: 'Email', value: site.contact.email, href: `mailto:${site.contact.email}` } : null
  ].filter(Boolean);
  const defaultCampusHighlights = [
    {
      value: '01',
      label: 'Programmes',
      detail: 'Core undergraduate learning options presented clearly for applicants and families.'
    },
    {
      value: '01',
      label: 'Announcements',
      detail: 'Admission, examination, and event communication remains visible on the public site.'
    },
    {
      value: '04',
      label: 'Campus Glimpses',
      detail: 'A visual record of campus life, academic activity, and institutional moments.'
    },
    {
      value: '01',
      label: 'Support Channels',
      detail: 'Direct contact routes for admission queries, calls, and official communication.'
    }
  ];
  const campusHighlights = site?.homepage?.highlights?.length
    ? site.homepage.highlights
        .filter((item) => item?.value || item?.label || item?.detail)
        .map((item, index) => ({
          value: String(item.value || '').trim() || defaultCampusHighlights[index]?.value || '00',
          label: item.label || defaultCampusHighlights[index]?.label || 'Highlight',
          detail: item.detail || defaultCampusHighlights[index]?.detail || ''
        }))
    : defaultCampusHighlights;
  const facilities = site?.homepage?.facilities?.length ? site.homepage.facilities : defaultFacilityItems;
  const admissionSteps = site?.homepage?.admissionSteps?.length ? site.homepage.admissionSteps : defaultAdmissionSteps;
  const testimonials = site?.homepage?.testimonials?.length ? site.homepage.testimonials : defaultTestimonials;

  useEffect(() => {
    if (managementProfiles.length <= 1) {
      setActiveManagementSlide(0);
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveManagementSlide((current) => (current + 1) % managementProfiles.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, [managementProfiles.length]);

  useEffect(() => {
    if (activeManagementSlide >= managementProfiles.length) {
      setActiveManagementSlide(0);
    }
  }, [activeManagementSlide, managementProfiles.length]);

  if ((loadingHome && !data) || !site || !data) {
    return <LoadingScreen />;
  }

  const hasAboutPanels = Boolean(site.about?.mission || site.about?.vision);
  const hasContactMap = Boolean(site.contact?.mapEmbedUrl);

  return (
    <>
      <AdvertisementPopup popup={homeData.popup} />

      <section className="hero hero--homepage">
        <div className="hero__backdrop" aria-hidden="true">
          <div className="hero__backdrop-glow hero__backdrop-glow--primary" />
          <div className="hero__backdrop-glow hero__backdrop-glow--secondary" />
          <img
            src={resolveMediaUrl(site?.branding?.websiteLogoUrl || '/logo-mark.svg')}
            alt=""
            className="hero__backdrop-mark"
            decoding="async"
          />
        </div>

        <div className="container hero__content">
          <div className="hero__copy">
            <div className="hero__identity">
              <div className="hero__logo-shell">
                <img
                  src={resolveMediaUrl(site?.branding?.websiteLogoUrl || '/logo-mark.svg')}
                  alt={`${site.collegeName} logo`}
                  className="hero__logo"
                  decoding="async"
                />
              </div>
              <div>
                {site.hero?.bannerNote ? <span className="hero__eyebrow">{site.hero.bannerNote}</span> : null}
                <h1>{site.collegeName}</h1>
                {site.location ? <p className="hero__subtitle">{site.location}</p> : null}
                {site.affiliation ? <p className="hero__subnote">{site.affiliation}</p> : null}
              </div>
            </div>

            {site.hero?.headline ? <p className="hero__lead">{site.hero.headline}</p> : null}
            {site.hero?.subheadline ? <p>{site.hero.subheadline}</p> : null}

            <div className="hero__actions">
              <Link to="/admissions" className="button">
                {site.hero?.primaryCtaLabel || 'Apply Now'}
              </Link>
              <Link to="/notifications" className="button button--secondary">
                {site.hero?.secondaryCtaLabel || 'Admissions Open'}
              </Link>
              <Link to="/contact" className="button button--ghost">
                {site.hero?.tertiaryCtaLabel || 'Contact Us'}
              </Link>
            </div>

            <div className="hero__info-grid">
              {site.location ? (
                <div className="hero__info-card">
                  <span>Location</span>
                  <strong>{site.location}</strong>
                </div>
              ) : null}
              {featuredCourse?.duration ? (
                <div className="hero__info-card">
                  <span>Programme</span>
                  <strong>{featuredCourse.duration}</strong>
                </div>
              ) : null}
              <div className="hero__info-card">
                <span>Updates</span>
                <strong>{announcementItems.length ? `${buildCount(announcementItems.length)} Latest Notices` : 'Admissions Guidance'}</strong>
              </div>
            </div>
          </div>

          <aside className="hero__panel hero__panel--homepage">
            <span className="hero__panel-label">Quick Overview</span>
            <h2>{featuredCourse?.title || 'Undergraduate Learning'}</h2>
            <p>
              {site.about?.introduction ||
                'A disciplined and student-focused academic environment designed for clear communication, accessible admissions, and dependable guidance.'}
            </p>
            <div className="hero__panel-points">
              {site.location ? <div>Regional presence rooted in {site.location}</div> : null}
              {site.affiliation ? <div>{site.affiliation}</div> : null}
              {featuredCourse?.subjects?.length ? <div>{featuredCourse.subjects.slice(0, 4).join(', ')}</div> : null}
            </div>
          </aside>
        </div>
      </section>

      {announcementItems.length ? (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Announcements"
              title="Latest Updates"
              description="Admissions, examination notices, and campus-related updates stay available in one clear section."
            />

            <div className="announcement-grid">
              {announcementItems.map((notice) => (
                <article key={notice._id} className="announcement-card">
                  <div className="announcement-card__meta">
                    <span>{notice.category || 'Update'}</span>
                    <strong>{formatDate(notice.publishedAt)}</strong>
                  </div>
                  <h3>{notice.title}</h3>
                  {notice.description ? <p>{notice.description}</p> : null}
                </article>
              ))}
            </div>

            <div className="section__actions">
              <Link to="/notifications" className="button button--secondary">
                View All Updates
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {(site.about?.introduction || site.about?.mission || site.about?.vision) ? (
        <section className="section section--muted">
          <div className={`container about-home ${hasAboutPanels ? '' : 'about-home--single'}`.trim()}>
            <div className="about-home__content">
              <SectionHeading
                eyebrow="About College"
                title={site.collegeName}
                description={site.affiliation || 'A clean and focused undergraduate college experience.'}
              />
              {site.about?.introduction ? <p className="lead-copy">{site.about.introduction}</p> : null}
              <div className="section__actions">
                <Link to="/about" className="button button--secondary">
                  Read More
                </Link>
              </div>
            </div>

            {hasAboutPanels ? (
              <div className="about-home__panels">
                {site.about?.mission ? (
                  <article className="about-home__panel">
                    <span>Mission</span>
                    <p>{site.about.mission}</p>
                  </article>
                ) : null}
                {site.about?.vision ? (
                  <article className="about-home__panel">
                    <span>Vision</span>
                    <p>{site.about.vision}</p>
                  </article>
                ) : null}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {coursesPreview.length ? (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Courses"
              title="Programmes Offered"
              description="Core academic options are presented with eligibility, duration, and subject direction."
            />

            <div className="course-preview-grid">
              {coursesPreview.map((course) => (
                <article key={course._id} className="course-preview-card">
                  <div className="course-preview-card__meta">
                    {course.duration ? <span>{course.duration}</span> : <span>Undergraduate Programme</span>}
                    {course.eligibility ? <strong>{course.eligibility}</strong> : null}
                  </div>
                  <h3>{course.title}</h3>
                  {course.overview ? <p>{course.overview}</p> : null}
                  {course.subjects?.length ? (
                    <ul className="subject-list subject-list--wide">
                      {course.subjects.slice(0, 5).map((subject) => (
                        <li key={subject}>{subject}</li>
                      ))}
                    </ul>
                  ) : null}
                </article>
              ))}
            </div>

            <div className="section__actions">
              <Link to="/courses" className="button button--secondary">
                View All Courses
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--warm">
        <div className="container">
          <SectionHeading
            eyebrow="Highlights"
            title="Campus Highlights"
            description="Essential numbers and college-facing indicators remain simple, readable, and easy to scan."
          />

          <div className="metric-grid">
            {campusHighlights.map((item) => (
              <article key={item.label} className="metric-card">
                <strong>{item.value}</strong>
                <h3>{item.label}</h3>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {leadershipCards.length ? (
        <section className="section">
          <div className="container">
            <SectionHeading
              eyebrow="Academic Leadership"
              title="Principal and Chief Executive Officer"
              description="Senior leadership remains visible in a static section for quick reference and institutional trust."
            />

            <div className={`leadership-spotlights ${leadershipCards.length === 1 ? 'leadership-spotlights--single' : ''}`.trim()}>
              {leadershipCards.map((card) => (
                <article
                  key={card.eyebrow}
                  className={`leadership-spotlight ${card.imageUrl ? '' : 'leadership-spotlight--textOnly'}`.trim()}
                >
                  {card.imageUrl ? (
                    <div className="leadership-spotlight__media">
                      <img
                        src={resolveMediaUrl(card.imageUrl)}
                        alt={card.title}
                        className="leadership-spotlight__image"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  ) : null}
                  <div className="leadership-spotlight__content">
                    <span className="section-heading__eyebrow">{card.eyebrow}</span>
                    <h3>{card.title}</h3>
                    {card.designation ? <p className="leadership-spotlight__designation">{card.designation}</p> : null}
                    {card.message ? <p className="lead-copy">{card.message}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {managementProfiles.length ? (
        <section className="section section--muted">
          <div className="container">
            <SectionHeading
              eyebrow="Management Staff"
              title="Management Team Profiles"
              description="Additional management profiles appear in a dedicated slider separate from the Principal and CEO."
            />

            <div className="leadership-carousel">
              <div
                className="leadership-carousel__track"
                style={{ transform: `translateX(-${activeManagementSlide * 100}%)` }}
              >
                {managementProfiles.map((profile) => {
                  const profileImage = profile.imageUrl && !isPlaceholderMedia(profile.imageUrl) ? profile.imageUrl : '';
                  return (
                    <article
                      key={profile.id}
                      className={`leadership-carousel__slide ${profileImage ? '' : 'leadership-carousel__slide--textOnly'}`.trim()}
                    >
                      {profileImage ? (
                        <div className="leadership-carousel__media">
                          <img
                            src={resolveMediaUrl(profileImage)}
                            alt={profile.name || 'Management profile'}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                      ) : null}
                      <div className="leadership-carousel__content">
                        <span className="section-heading__eyebrow">Management Team</span>
                        <h3>{profile.name || 'Management Member'}</h3>
                        {profile.work ? <p className="leadership-spotlight__designation">{profile.work}</p> : null}
                        {profile.experience ? <p className="lead-copy">{profile.experience}</p> : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {managementProfiles.length > 1 ? (
              <div className="leadership-carousel__controls">
                {managementProfiles.map((profile, index) => (
                  <button
                    key={profile.id}
                    type="button"
                    className={index === activeManagementSlide ? 'is-active' : ''}
                    aria-label={`Show profile ${index + 1}`}
                    onClick={() => setActiveManagementSlide(index)}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Facilities"
            title="Campus Facilities"
            description="Essential student-facing facilities are presented with minimal and readable supporting information."
          />

          <div className="facility-grid">
            {facilities.map((item, index) => (
              <article key={item.title} className="facility-card">
                <div className="facility-card__badge">{item.badge || String(index + 1).padStart(2, '0')}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {galleryPreview.length ? (
        <section className="section section--muted">
          <div className="container">
            <SectionHeading
              eyebrow="Gallery"
              title="Campus Life"
              description="A curated view of campus spaces, academic activities, and important institutional moments."
            />

            <div className="gallery-preview gallery-preview--expanded">
              {galleryPreview.map((item, index) => {
                const galleryCategory = formatDisplayTitle(item.category);
                const galleryTitle = formatDisplayTitle(item.caption || item.photoOf || `Campus Highlight ${String(index + 1).padStart(2, '0')}`);
                const galleryDetail =
                  item.photoOf && formatDisplayTitle(item.photoOf) !== galleryTitle ? String(item.photoOf).trim() : '';

                return (
                  <article key={item._id} className="gallery-preview__item">
                    <img src={resolveMediaUrl(item.imageUrl)} alt={galleryTitle || 'Campus gallery item'} loading="lazy" decoding="async" />
                    {(galleryCategory || galleryTitle || galleryDetail) ? (
                      <div className="gallery-preview__caption">
                        {galleryCategory ? <span className="gallery-card__eyebrow">{galleryCategory}</span> : null}
                        {galleryTitle ? <strong>{galleryTitle}</strong> : null}
                        {galleryDetail ? <p className="gallery-card__detail">{galleryDetail}</p> : null}
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>

            <div className="section__actions">
              <Link to="/gallery" className="button button--secondary">
                View Full Gallery
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="section section--warm">
        <div className="container">
          <SectionHeading
            eyebrow="Admissions"
            title="Admission Process"
            description="A simple step-by-step view helps students and families understand how to begin."
          />

          <div className="process-grid">
            {admissionSteps.map((item, index) => (
              <article key={`${item.title}-${index}`} className="process-step">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Testimonials"
            title="Student and Alumni Voices"
            description="Selected testimonials can be managed from the admin panel and displayed in a clean public format."
          />

          <div className="experience-grid">
            {testimonials.map((item, index) => (
              <article key={`${item.name}-${index}`} className="experience-card">
                <span>{item.role || 'Student Voice'}</span>
                <h3>{item.name || 'College Community'}</h3>
                <p>{item.quote}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {contactItems.length || site.contact?.mapEmbedUrl ? (
        <section className="section section--muted">
          <div className={`container contact-home ${hasContactMap ? '' : 'contact-home--single'}`.trim()}>
            <div className="contact-home__content">
              <SectionHeading
                eyebrow="Contact"
                title="Contact and Campus Location"
                description={site.contact?.inquiryText || 'Reach the college for admissions, support, and general communication.'}
              />

              <div className="contact-home__cards">
                {contactItems.map((item) => (
                  <article key={item.label} className="contact-home__card">
                    <span>{item.label}</span>
                    {item.href ? <a href={item.href}>{item.value}</a> : <strong>{item.value}</strong>}
                  </article>
                ))}
              </div>

              <div className="button-row">
                <Link to="/contact" className="button">
                  Contact Details
                </Link>
                <Link to="/admissions" className="button button--secondary">
                  Admission Inquiry
                </Link>
              </div>
            </div>

            {hasContactMap ? (
              <div className="contact-home__map">
                <iframe
                  src={site.contact.mapEmbedUrl}
                  title={`${site.collegeName} location`}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}
    </>
  );
};
