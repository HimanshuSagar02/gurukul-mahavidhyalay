import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { api, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SectionHeading } from '../../components/SectionHeading';
import { PageBanner } from '../../components/public/PageBanner';

export const AboutPage = () => {
  const { site: sharedSite } = useOutletContext();
  const [site, setSite] = useState(sharedSite);

  useEffect(() => {
    const loadAbout = async () => {
      const data = await api.get('/public/about');
      setSite(data.site);
    };

    loadAbout();
  }, []);

  if (!site) {
    return <LoadingScreen label="Please wait..." />;
  }

  return (
    <>
      <PageBanner
        title="About the College"
        subtitle="Our values, vision, and a message from the principal."
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Welcome"
            title={site.collegeName}
            description={`${site.affiliation} | ${site.location}`}
          />
          <p className="lead-copy">{site.about.introduction}</p>
        </div>
      </section>

      <section className="section section--warm">
        <div className="container dual-copy">
          <article className="content-block">
            <h3>Mission</h3>
            <p>{site.about.mission}</p>
          </article>
          <article className="content-block">
            <h3>Vision</h3>
            <p>{site.about.vision}</p>
          </article>
        </div>
      </section>

      <section className="section">
        <div className="container feature-split">
          <div className="feature-split__image-wrap">
            <img
              src={resolveMediaUrl(site.about.principalImage)}
              alt={site.about.principalName || 'Principal'}
              className="feature-split__image"
            />
          </div>
          <div className="feature-split__content">
            <SectionHeading
              eyebrow="A Message"
              title={site.about.principalName || 'Principal'}
              description={site.about.principalDesignation}
            />
            <p className="lead-copy">{site.about.principalMessage}</p>
          </div>
        </div>
      </section>
    </>
  );
};
