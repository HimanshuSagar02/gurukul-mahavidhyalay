import { useEffect, useState } from 'react';
import { acceptedImageTypes, api, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

const createProfileId = () =>
  globalThis.crypto?.randomUUID?.() || `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createManagementProfile = (displayOrder = 0) => ({
  id: createProfileId(),
  name: '',
  work: '',
  experience: '',
  imageUrl: '',
  imagePublicId: '',
  displayOrder
});

const mapAboutToForm = (about) => ({
  introduction: about?.introduction || '',
  mission: about?.mission || '',
  vision: about?.vision || '',
  principalName: about?.principalName || '',
  principalDesignation: about?.principalDesignation || '',
  principalMessage: about?.principalMessage || '',
  principalImage: about?.principalImage || '/placeholders/principal-placeholder.svg',
  principalImagePublicId: about?.principalImagePublicId || '',
  ceoName: about?.ceoName || '',
  ceoDesignation: about?.ceoDesignation || '',
  ceoMessage: about?.ceoMessage || '',
  ceoImage: about?.ceoImage || '',
  ceoImagePublicId: about?.ceoImagePublicId || '',
  managementProfiles: (about?.managementProfiles || []).map((profile, index) => ({
    id: profile.id || createProfileId(),
    name: profile.name || '',
    work: profile.work ?? profile.designation ?? '',
    experience: profile.experience ?? profile.message ?? '',
    imageUrl: profile.imageUrl || '',
    imagePublicId: profile.imagePublicId || '',
    displayOrder: Number.isFinite(Number(profile.displayOrder)) ? Number(profile.displayOrder) : index
  }))
});

export const AboutManagePage = () => {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '', saving: false });
  const [mediaStatus, setMediaStatus] = useState({ error: '', success: '', uploading: '' });

  useEffect(() => {
    const loadSite = async () => {
      const response = await api.get('/admin/site');
      setForm(mapAboutToForm(response.about));
    };

    loadSite();
  }, []);

  if (!form) {
    return <LoadingScreen label="Loading about content..." />;
  }

  const persistAboutForm = async (nextForm = form) => {
    const response = await api.put('/admin/site/about', nextForm);
    const nextState = mapAboutToForm(response);
    setForm(nextState);
    return nextState;
  };

  const handleMediaUpload = async (field, file, extraFields = {}, options = {}) => {
    if (!file) {
      return;
    }

    setMediaStatus({ error: '', success: '', uploading: field });

    try {
      if (options.persistBeforeUpload) {
        await persistAboutForm();
      }

      const payload = new FormData();
      payload.append('field', field);
      payload.append('image', file);
      Object.entries(extraFields).forEach(([key, value]) => {
        payload.append(key, String(value));
      });

      const response = await api.post('/admin/site/media', payload);
      setForm(mapAboutToForm(response.site.about));
      setMediaStatus({ error: '', success: 'Image uploaded successfully.', uploading: '' });
    } catch (error) {
      setMediaStatus({ error: error.message, success: '', uploading: '' });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      await persistAboutForm();
      setStatus({ error: '', success: 'About content updated successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>About Page</p>
        <h2>About page content and leadership profiles</h2>
      </div>

      <form className="admin-card form-card" onSubmit={handleSubmit}>
        <label>
          <span>College Introduction</span>
          <textarea
            rows="5"
            value={form.introduction}
            onChange={(event) => setForm((current) => ({ ...current, introduction: event.target.value }))}
          />
        </label>
        <label>
          <span>Mission</span>
          <textarea
            rows="4"
            value={form.mission}
            onChange={(event) => setForm((current) => ({ ...current, mission: event.target.value }))}
          />
        </label>
        <label>
          <span>Vision</span>
          <textarea
            rows="4"
            value={form.vision}
            onChange={(event) => setForm((current) => ({ ...current, vision: event.target.value }))}
          />
        </label>

        <div className="stacked-fields">
          <h3>Principal Spotlight</h3>
          <div className="admin-subcard form-card">
            <div className="form-grid">
              <label>
                <span>Principal Name</span>
                <input
                  value={form.principalName}
                  onChange={(event) => setForm((current) => ({ ...current, principalName: event.target.value }))}
                />
              </label>
              <label>
                <span>Principal Designation</span>
                <input
                  value={form.principalDesignation}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, principalDesignation: event.target.value }))
                  }
                />
              </label>
              <div className="form-grid__full media-upload-card">
                <span>Principal Image</span>
                <div className="media-upload-card__preview media-upload-card__preview--portrait">
                  <img src={resolveMediaUrl(form.principalImage)} alt={form.principalName || 'Principal preview'} />
                </div>
                <input
                  type="file"
                  accept={acceptedImageTypes}
                  disabled={Boolean(mediaStatus.uploading)}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    await handleMediaUpload('principalImage', file);
                    event.target.value = '';
                  }}
                />
              </div>
            </div>
            <label>
              <span>Principal Message</span>
              <textarea
                rows="5"
                value={form.principalMessage}
                onChange={(event) => setForm((current) => ({ ...current, principalMessage: event.target.value }))}
              />
            </label>
          </div>
        </div>

        <div className="stacked-fields">
          <h3>CEO Spotlight</h3>
          <div className="admin-subcard form-card">
            <div className="form-grid">
              <label>
                <span>CEO Name</span>
                <input
                  value={form.ceoName}
                  onChange={(event) => setForm((current) => ({ ...current, ceoName: event.target.value }))}
                />
              </label>
              <label>
                <span>CEO Designation</span>
                <input
                  value={form.ceoDesignation}
                  onChange={(event) => setForm((current) => ({ ...current, ceoDesignation: event.target.value }))}
                />
              </label>
              <div className="form-grid__full media-upload-card">
                <span>CEO Image</span>
                <div className="media-upload-card__preview media-upload-card__preview--portrait">
                  {form.ceoImage ? (
                    <img src={resolveMediaUrl(form.ceoImage)} alt={form.ceoName || 'CEO preview'} />
                  ) : (
                    <p>Upload a CEO image from file chooser when you want to highlight this profile.</p>
                  )}
                </div>
                <input
                  type="file"
                  accept={acceptedImageTypes}
                  disabled={Boolean(mediaStatus.uploading)}
                  onChange={async (event) => {
                    const file = event.target.files?.[0];
                    await handleMediaUpload('ceoImage', file);
                    event.target.value = '';
                  }}
                />
              </div>
            </div>
            <label>
              <span>CEO Message</span>
              <textarea
                rows="5"
                value={form.ceoMessage}
                onChange={(event) => setForm((current) => ({ ...current, ceoMessage: event.target.value }))}
              />
            </label>
          </div>
        </div>

        <div className="stacked-fields">
          <div className="stacked-list__row stacked-list__row--start">
            <div>
              <h3>Additional Management Profiles</h3>
              <p className="admin-helper-text">
                Principal and CEO stay separate. Add other management members here; their name, work, and experience will rotate on the home page and appear on the About page.
              </p>
            </div>
            <button
              type="button"
              className="button button--secondary"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  managementProfiles: [...current.managementProfiles, createManagementProfile(current.managementProfiles.length)]
                }))
              }
            >
              Add Profile
            </button>
          </div>

          {form.managementProfiles.length ? (
            form.managementProfiles.map((profile, index) => (
              <div key={profile.id} className="admin-subcard form-card">
                <div className="stacked-list__row stacked-list__row--start">
                  <h3>Profile {index + 1}</h3>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        managementProfiles: current.managementProfiles.filter((item) => item.id !== profile.id)
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
                      value={profile.name}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          managementProfiles: current.managementProfiles.map((item) =>
                            item.id === profile.id ? { ...item, name: event.target.value } : item
                          )
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Work / Responsibility</span>
                    <input
                      value={profile.work}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          managementProfiles: current.managementProfiles.map((item) =>
                            item.id === profile.id ? { ...item, work: event.target.value } : item
                          )
                        }))
                      }
                    />
                  </label>
                  <label>
                    <span>Display Order</span>
                    <input
                      type="number"
                      value={profile.displayOrder}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          managementProfiles: current.managementProfiles.map((item) =>
                            item.id === profile.id ? { ...item, displayOrder: event.target.value } : item
                          )
                        }))
                      }
                    />
                  </label>
                  <div className="form-grid__full media-upload-card">
                    <span>Profile Image</span>
                    <div className="media-upload-card__preview media-upload-card__preview--portrait">
                      {profile.imageUrl ? (
                        <img src={resolveMediaUrl(profile.imageUrl)} alt={profile.name || `Profile ${index + 1}`} />
                      ) : (
                        <p>Save or keep this profile in the form, then choose an image file here.</p>
                      )}
                    </div>
                    <input
                      type="file"
                      accept={acceptedImageTypes}
                      disabled={Boolean(mediaStatus.uploading)}
                      onChange={async (event) => {
                        const file = event.target.files?.[0];
                        await handleMediaUpload(
                          'managementProfileImage',
                          file,
                          { memberId: profile.id },
                          { persistBeforeUpload: true }
                        );
                        event.target.value = '';
                      }}
                    />
                  </div>
                </div>

                <label>
                  <span>Experience / Profile Summary</span>
                  <textarea
                    rows="4"
                    value={profile.experience}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        managementProfiles: current.managementProfiles.map((item) =>
                          item.id === profile.id ? { ...item, experience: event.target.value } : item
                        )
                      }))
                    }
                  />
                </label>
              </div>
            ))
          ) : (
            <p className="admin-helper-text">No extra management profiles added yet.</p>
          )}
        </div>

        {mediaStatus.error ? <p className="form-message form-message--error">{mediaStatus.error}</p> : null}
        {mediaStatus.success ? <p className="form-message form-message--success">{mediaStatus.success}</p> : null}
        {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
        {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

        <button type="submit" className="button" disabled={status.saving}>
          {status.saving ? 'Saving...' : 'Save About Page Content'}
        </button>
      </form>
    </div>
  );
};
