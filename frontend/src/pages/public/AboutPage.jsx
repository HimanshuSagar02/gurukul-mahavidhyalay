import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { isPlaceholderMedia, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SectionHeading } from '../../components/SectionHeading';
import { PageBanner } from '../../components/public/PageBanner';

export const AboutPage = () => {
  const { site } = useOutletContext();
  const [activeManagementSlide, setActiveManagementSlide] = useState(0);

  const leadershipCards = [
    {
      key: 'principal',
      eyebrow: 'Principal',
      title: site.about?.principalName || 'Principal',
      designation: site.about?.principalDesignation,
      message: site.about?.principalMessage,
      imageUrl: isPlaceholderMedia(site.about?.principalImage) ? '' : site.about?.principalImage
    },
    {
      key: 'ceo',
      eyebrow: 'CEO',
      title: site.about?.ceoName || 'Chief Executive Officer',
      designation: site.about?.ceoDesignation,
      message: site.about?.ceoMessage,
      imageUrl: isPlaceholderMedia(site.about?.ceoImage) ? '' : site.about?.ceoImage
    }
  ].filter((item) => item.designation || item.message || item.imageUrl);

  const managementProfiles = [...(site?.about?.managementProfiles || [])]
    .filter((profile) => {
      const hasImage = profile?.imageUrl && !isPlaceholderMedia(profile.imageUrl);
      return profile?.name || profile?.work || profile?.experience || hasImage;
    })
    .sort((first, second) => Number(first.displayOrder || 0) - Number(second.displayOrder || 0));

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

  if (!site) {
    return <LoadingScreen />;
  }

  return (
    <>
      <PageBanner title="About the College" subtitle="Institutional vision, academic purpose, and leadership." />

      {site.about?.introduction ? (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Overview" title={site.collegeName} description={site.affiliation || site.location} />
            <p className="lead-copy">{site.about.introduction}</p>
          </div>
        </section>
      ) : null}

      {site.about?.mission || site.about?.vision ? (
        <section className="section section--warm">
          <div className="container dual-copy">
            {site.about?.mission ? (
              <article className="content-block">
                <h3>Mission</h3>
                <p>{site.about.mission}</p>
              </article>
            ) : null}
            {site.about?.vision ? (
              <article className="content-block">
                <h3>Vision</h3>
                <p>{site.about.vision}</p>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {leadershipCards.length ? (
        <section className="section">
          <div className="container">
            <SectionHeading eyebrow="Leadership" title="Institutional leadership" description="Messages from the people guiding the college." />
            <div className="leadership-spotlights">
              {leadershipCards.map((card) => (
                <article
                  key={card.key}
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
              eyebrow="Management Leadership"
              title="Additional Senior Management Profiles"
              description="Management staff profiles appear in a separate rotating slider below the static Principal and CEO section."
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
    </>
  );
};
