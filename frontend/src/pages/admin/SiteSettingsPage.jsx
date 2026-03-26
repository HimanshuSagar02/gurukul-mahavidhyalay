import { useEffect, useState } from 'react';
import { acceptedImageTypes, api, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

const createFeatureItem = () => ({
  title: '',
  description: '',
  badge: ''
});

const createTestimonial = () => ({
  name: '',
  role: '',
  quote: ''
});

const mapSiteToForm = (site) => ({
  collegeName: site.collegeName || '',
  location: site.location || '',
  affiliation: site.affiliation || 'Guru Jambheshwar University',
  announcementTicker: site.announcementTicker || '',
  hero: {
    headline: site.hero?.headline || '',
    subheadline: site.hero?.subheadline || '',
    bannerNote: site.hero?.bannerNote || '',
    primaryCtaLabel: site.hero?.primaryCtaLabel || 'Apply Now',
    secondaryCtaLabel: site.hero?.secondaryCtaLabel || 'Admissions Open',
    tertiaryCtaLabel: site.hero?.tertiaryCtaLabel || 'Contact Us'
  },
  branding: {
    websiteLogoUrl: site.branding?.websiteLogoUrl || '/logo-mark.svg'
  },
  socialLinks: {
    facebook: site.socialLinks?.facebook || '',
    instagram: site.socialLinks?.instagram || '',
    youtube: site.socialLinks?.youtube || '',
    whatsapp: site.socialLinks?.whatsapp || ''
  },
  homepage: {
    facilities: (site.homepage?.facilities || []).map((item) => ({
      title: item.title || '',
      description: item.description || '',
      badge: item.badge || ''
    })),
    admissionSteps: (site.homepage?.admissionSteps || []).map((item) => ({
      title: item.title || '',
      description: item.description || '',
      badge: item.badge || ''
    })),
    testimonials: (site.homepage?.testimonials || []).map((item) => ({
      name: item.name || '',
      role: item.role || '',
      quote: item.quote || ''
    }))
  }
});

export const SiteSettingsPage = () => {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '', saving: false });
  const [mediaStatus, setMediaStatus] = useState({ error: '', success: '', uploading: '' });

  useEffect(() => {
    const loadSite = async () => {
      const response = await api.get('/admin/site');
      setForm(mapSiteToForm(response));
    };

    loadSite();
  }, []);

  if (!form) {
    return <LoadingScreen label="Loading site settings..." />;
  }

  const handleMediaUpload = async (field, file, extraFields = {}) => {
    if (!file) {
      return;
    }

    setMediaStatus({ error: '', success: '', uploading: field });

    try {
      const payload = new FormData();
      payload.append('field', field);
      payload.append('image', file);
      Object.entries(extraFields).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      const response = await api.post('/admin/site/media', payload);
      setForm(mapSiteToForm(response.site));
      setMediaStatus({ error: '', success: 'Image uploaded successfully.', uploading: '' });
    } catch (error) {
      setMediaStatus({ error: error.message, success: '', uploading: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      const response = await api.put('/admin/site/general', form);
      setForm(mapSiteToForm(response));
      setStatus({ error: '', success: 'Home page content updated successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Home Page</p>
        <h2>Home page content and visible sections</h2>
      </div>

      <form className="admin-card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>College Name</span>
            <input
              value={form.collegeName}
              onChange={(event) => setForm((current) => ({ ...current, collegeName: event.target.value }))}
            />
          </label>
          <label>
            <span>Location</span>
            <input
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
            />
          </label>
          <label className="form-grid__full">
            <span>Affiliation</span>
            <input
              value={form.affiliation}
              onChange={(event) => setForm((current) => ({ ...current, affiliation: event.target.value }))}
            />
          </label>
          <label className="form-grid__full">
            <span>Announcement Text</span>
            <textarea
              rows="3"
              value={form.announcementTicker}
              onChange={(event) => setForm((current) => ({ ...current, announcementTicker: event.target.value }))}
            />
          </label>
          <label className="form-grid__full">
            <span>Hero Headline</span>
            <textarea
              rows="3"
              value={form.hero.headline}
              onChange={(event) =>
                setForm((current) => ({ ...current, hero: { ...current.hero, headline: event.target.value } }))
              }
            />
          </label>
          <label className="form-grid__full">
            <span>Hero Subheadline</span>
            <textarea
              rows="3"
              value={form.hero.subheadline}
              onChange={(event) =>
                setForm((current) => ({ ...current, hero: { ...current.hero, subheadline: event.target.value } }))
              }
            />
          </label>
          <label>
            <span>Banner Note</span>
            <input
              value={form.hero.bannerNote}
              onChange={(event) =>
                setForm((current) => ({ ...current, hero: { ...current.hero, bannerNote: event.target.value } }))
              }
            />
          </label>
          <label>
            <span>Primary Button Label</span>
            <input
              value={form.hero.primaryCtaLabel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  hero: { ...current.hero, primaryCtaLabel: event.target.value }
                }))
              }
            />
          </label>
          <label>
            <span>Secondary Button Label</span>
            <input
              value={form.hero.secondaryCtaLabel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  hero: { ...current.hero, secondaryCtaLabel: event.target.value }
                }))
              }
            />
          </label>
          <label>
            <span>Contact Button Label</span>
            <input
              value={form.hero.tertiaryCtaLabel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  hero: { ...current.hero, tertiaryCtaLabel: event.target.value }
                }))
              }
            />
          </label>
        </div>

        <div className="stacked-fields">
          <h3>Branding and Footer Social Links</h3>

          <div className="form-grid">
            <div className="form-grid__full media-upload-grid media-upload-grid--single">
              <div className="media-upload-card">
                <span>Website Logo</span>
                <div className="media-upload-card__preview">
                  <img src={resolveMediaUrl(form.branding.websiteLogoUrl)} alt="Website logo preview" />
                </div>
                <input
                  type="file"
                  accept={acceptedImageTypes}
                  disabled={Boolean(mediaStatus.uploading)}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    await handleMediaUpload('websiteLogo', file);
                    event.target.value = '';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="form-grid">
            <label>
              <span>Facebook Link</span>
              <input
                value={form.socialLinks.facebook}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    socialLinks: { ...current.socialLinks, facebook: event.target.value }
                  }))
                }
              />
            </label>
            <label>
              <span>Instagram Link</span>
              <input
                value={form.socialLinks.instagram}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    socialLinks: { ...current.socialLinks, instagram: event.target.value }
                  }))
                }
              />
            </label>
            <label>
              <span>YouTube Link</span>
              <input
                value={form.socialLinks.youtube}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    socialLinks: { ...current.socialLinks, youtube: event.target.value }
                  }))
                }
              />
            </label>
            <label>
              <span>WhatsApp Link</span>
              <input
                value={form.socialLinks.whatsapp}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    socialLinks: { ...current.socialLinks, whatsapp: event.target.value }
                  }))
                }
              />
            </label>
          </div>
        </div>

        <div className="stacked-fields">
          <div className="stacked-list__row stacked-list__row--start">
            <div>
              <h3>Facilities Section</h3>
              <p className="admin-helper-text">These facility cards are shown on the home page.</p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    facilities: [...current.homepage.facilities, createFeatureItem()]
                  }
                }))
              }
            >
              Add Facility
            </button>
          </div>

          {form.homepage.facilities.length ? (
            form.homepage.facilities.map((item, index) => (
              <div key={`facility-${index}`} className="admin-subcard form-card">
                <div className="stacked-list__row stacked-list__row--start">
                  <h3>Facility {index + 1}</h3>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        homepage: {
                          ...current.homepage,
                          facilities: current.homepage.facilities.filter((_, itemIndex) => itemIndex !== index)
                        }
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="form-grid">
                  <label>
                    <span>Badge</span>
                    <input
                      maxLength={4}
                      value={item.badge}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            facilities: current.homepage.facilities.map((facility, itemIndex) =>
                              itemIndex === index ? { ...facility, badge: event.target.value } : facility
                            )
                          }
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Title</span>
                    <input
                      value={item.title}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            facilities: current.homepage.facilities.map((facility, itemIndex) =>
                              itemIndex === index ? { ...facility, title: event.target.value } : facility
                            )
                          }
                        }))
                      }
                    />
                  </label>
                  <label className="form-grid__full">
                    <span>Description</span>
                    <textarea
                      rows="4"
                      value={item.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            facilities: current.homepage.facilities.map((facility, itemIndex) =>
                              itemIndex === index ? { ...facility, description: event.target.value } : facility
                            )
                          }
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p className="admin-helper-text">No facilities added yet.</p>
          )}
        </div>

        <div className="stacked-fields">
          <div className="stacked-list__row stacked-list__row--start">
            <div>
              <h3>Admission Process</h3>
              <p className="admin-helper-text">These steps appear in the admission process section on the home page.</p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    admissionSteps: [...current.homepage.admissionSteps, createFeatureItem()]
                  }
                }))
              }
            >
              Add Step
            </button>
          </div>

          {form.homepage.admissionSteps.length ? (
            form.homepage.admissionSteps.map((item, index) => (
              <div key={`step-${index}`} className="admin-subcard form-card">
                <div className="stacked-list__row stacked-list__row--start">
                  <h3>Step {index + 1}</h3>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        homepage: {
                          ...current.homepage,
                          admissionSteps: current.homepage.admissionSteps.filter((_, itemIndex) => itemIndex !== index)
                        }
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="form-grid">
                  <label>
                    <span>Step Title</span>
                    <input
                      value={item.title}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            admissionSteps: current.homepage.admissionSteps.map((step, itemIndex) =>
                              itemIndex === index ? { ...step, title: event.target.value } : step
                            )
                          }
                        }))
                      }
                    />
                  </label>
                  <label className="form-grid__full">
                    <span>Step Description</span>
                    <textarea
                      rows="4"
                      value={item.description}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            admissionSteps: current.homepage.admissionSteps.map((step, itemIndex) =>
                              itemIndex === index ? { ...step, description: event.target.value } : step
                            )
                          }
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p className="admin-helper-text">No admission steps added yet.</p>
          )}
        </div>

        <div className="stacked-fields">
          <div className="stacked-list__row stacked-list__row--start">
            <div>
              <h3>Testimonials Section</h3>
              <p className="admin-helper-text">Student or alumni testimonials shown on the home page can be managed here.</p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  homepage: {
                    ...current.homepage,
                    testimonials: [...current.homepage.testimonials, createTestimonial()]
                  }
                }))
              }
            >
              Add Testimonial
            </button>
          </div>

          {form.homepage.testimonials.length ? (
            form.homepage.testimonials.map((item, index) => (
              <div key={`testimonial-${index}`} className="admin-subcard form-card">
                <div className="stacked-list__row stacked-list__row--start">
                  <h3>Testimonial {index + 1}</h3>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        homepage: {
                          ...current.homepage,
                          testimonials: current.homepage.testimonials.filter((_, itemIndex) => itemIndex !== index)
                        }
                      }))
                    }
                  >
                    Remove
                  </button>
                </div>
                <div className="form-grid">
                  <label>
                    <span>Name</span>
                    <input
                      value={item.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            testimonials: current.homepage.testimonials.map((testimonial, itemIndex) =>
                              itemIndex === index ? { ...testimonial, name: event.target.value } : testimonial
                            )
                          }
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Role / Identity</span>
                    <input
                      value={item.role}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            testimonials: current.homepage.testimonials.map((testimonial, itemIndex) =>
                              itemIndex === index ? { ...testimonial, role: event.target.value } : testimonial
                            )
                          }
                        }))
                      }
                    />
                  </label>
                  <label className="form-grid__full">
                    <span>Quote</span>
                    <textarea
                      rows="4"
                      value={item.quote}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          homepage: {
                            ...current.homepage,
                            testimonials: current.homepage.testimonials.map((testimonial, itemIndex) =>
                              itemIndex === index ? { ...testimonial, quote: event.target.value } : testimonial
                            )
                          }
                        }))
                      }
                    />
                  </label>
                </div>
              </div>
            ))
          ) : (
            <p className="admin-helper-text">No testimonials added yet.</p>
          )}
        </div>

        {mediaStatus.error ? <p className="form-message form-message--error">{mediaStatus.error}</p> : null}
        {mediaStatus.success ? <p className="form-message form-message--success">{mediaStatus.success}</p> : null}
        {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
        {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

        <button type="submit" className="button" disabled={status.saving}>
          {status.saving ? 'Saving...' : 'Save Home Page Content'}
        </button>
      </form>
    </div>
  );
};
