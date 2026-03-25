import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

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
    secondaryCtaLabel: site.hero?.secondaryCtaLabel || 'View Courses',
    slides: site.hero?.slides || []
  },
  branding: {
    websiteLogoUrl: site.branding?.websiteLogoUrl || '/logo-mark.svg',
    managementLogoUrl: site.branding?.managementLogoUrl || '',
    managementLogoTitle: site.branding?.managementLogoTitle || 'Management Logo'
  },
  socialLinks: {
    facebook: site.socialLinks?.facebook || '',
    instagram: site.socialLinks?.instagram || '',
    youtube: site.socialLinks?.youtube || '',
    whatsapp: site.socialLinks?.whatsapp || ''
  },
  motivation: {
    enabled: Boolean(site.motivation?.enabled),
    title: site.motivation?.title || 'Student Motivation',
    text: site.motivation?.text || '',
    imageUrl: site.motivation?.imageUrl || ''
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

  const handleMediaUpload = async (field, file) => {
    if (!file) {
      return;
    }

    setMediaStatus({ error: '', success: '', uploading: field });

    try {
      const payload = new FormData();
      payload.append('field', field);
      payload.append('image', file);

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
      await api.put('/admin/site/general', form);
      setStatus({ error: '', success: 'Site settings updated successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Site Settings</p>
        <h2>General and Homepage Content</h2>
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
            <span>Announcement Ticker</span>
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
            <span>Primary CTA Label</span>
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
            <span>Secondary CTA Label</span>
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
        </div>

        <div className="stacked-fields">
          <h3>Branding and Official Links</h3>

          <div className="form-grid">
            <label>
              <span>Management Logo Title</span>
              <input
                value={form.branding.managementLogoTitle}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    branding: { ...current.branding, managementLogoTitle: event.target.value }
                  }))
                }
              />
            </label>
            <div className="form-grid__full media-upload-grid">
              <div className="media-upload-card">
                <span>Website Logo</span>
                <div className="media-upload-card__preview">
                  <img src={resolveMediaUrl(form.branding.websiteLogoUrl)} alt="Website logo preview" />
                </div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={Boolean(mediaStatus.uploading)}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    await handleMediaUpload('websiteLogo', file);
                    event.target.value = '';
                  }}
                />
              </div>

              <div className="media-upload-card">
                <span>Management Logo</span>
                <div className="media-upload-card__preview">
                  {form.branding.managementLogoUrl ? (
                    <img src={resolveMediaUrl(form.branding.managementLogoUrl)} alt="Management logo preview" />
                  ) : (
                    <p>Upload a management logo to show it on the home page.</p>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  disabled={Boolean(mediaStatus.uploading)}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    await handleMediaUpload('managementLogo', file);
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
          <h3>Motivation Section</h3>

          <label className="checkbox-item">
            <input
              type="checkbox"
              checked={Boolean(form.motivation.enabled)}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  motivation: { ...current.motivation, enabled: event.target.checked }
                }))
              }
            />
            <span>Show motivation block on the home page</span>
          </label>

          <div className="form-grid">
            <label>
              <span>Motivation Title</span>
              <input
                value={form.motivation.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    motivation: { ...current.motivation, title: event.target.value }
                  }))
                }
              />
            </label>
            <label className="form-grid__full">
              <span>Motivation Text</span>
              <textarea
                rows="4"
                value={form.motivation.text}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    motivation: { ...current.motivation, text: event.target.value }
                  }))
                }
              />
            </label>
            <div className="form-grid__full media-upload-card">
              <span>Motivation Image</span>
              <div className="media-upload-card__preview">
                {form.motivation.imageUrl ? (
                  <img src={resolveMediaUrl(form.motivation.imageUrl)} alt="Motivation preview" />
                ) : (
                  <p>Upload an optional motivation image for the home page.</p>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                disabled={Boolean(mediaStatus.uploading)}
                onChange={async (event) => {
                  const file = event.target.files?.[0];
                  await handleMediaUpload('motivationImage', file);
                  event.target.value = '';
                }}
              />
            </div>
          </div>
        </div>

        <div className="stacked-fields">
          <h3>Hero Slides</h3>
          {form.hero.slides.map((slide, index) => (
            <div key={`${slide.image}-${index}`} className="admin-subcard">
              <div className="form-grid">
                <label>
                  <span>Slide Title</span>
                  <input
                    value={slide.title}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          slides: current.hero.slides.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, title: event.target.value } : item
                          )
                        }
                      }))
                    }
                  />
                </label>
                <label>
                  <span>Slide Image URL</span>
                  <input
                    value={slide.image}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          slides: current.hero.slides.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, image: event.target.value } : item
                          )
                        }
                      }))
                    }
                  />
                </label>
                <label className="form-grid__full">
                  <span>Slide Subtitle</span>
                  <input
                    value={slide.subtitle}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        hero: {
                          ...current.hero,
                          slides: current.hero.slides.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, subtitle: event.target.value } : item
                          )
                        }
                      }))
                    }
                  />
                </label>
              </div>
            </div>
          ))}
        </div>

        {mediaStatus.error ? <p className="form-message form-message--error">{mediaStatus.error}</p> : null}
        {mediaStatus.success ? <p className="form-message form-message--success">{mediaStatus.success}</p> : null}
        {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
        {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

        <button type="submit" className="button" disabled={status.saving}>
          {status.saving ? 'Saving...' : 'Save Site Settings'}
        </button>
      </form>
    </div>
  );
};
