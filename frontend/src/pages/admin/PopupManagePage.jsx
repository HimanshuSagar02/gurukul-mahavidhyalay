import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

export const PopupManagePage = () => {
  const [popup, setPopup] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '', saving: false });

  const loadPopup = async () => {
    const response = await api.get('/admin/popup');
    setPopup({ ...response, image: null });
  };

  useEffect(() => {
    loadPopup();
  }, []);

  if (!popup) {
    return <LoadingScreen label="Loading popup settings..." />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      const payload = new FormData();
      if (popup.image) {
        payload.append('image', popup.image);
      }
      payload.append('title', popup.title || 'Latest Update');
      payload.append('redirectUrl', popup.redirectUrl || '');
      payload.append('isActive', String(Boolean(popup.isActive)));

      await api.put('/admin/popup', payload);
      await loadPopup();
      setStatus({ error: '', success: 'Popup settings updated successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Advertisement Popup</p>
        <h2>Manage startup popup image and redirect</h2>
      </div>

      <form className="admin-card form-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          <label>
            <span>Popup Title</span>
            <input value={popup.title || ''} onChange={(event) => setPopup((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <label>
            <span>Redirect Link</span>
            <input
              value={popup.redirectUrl || ''}
              onChange={(event) => setPopup((current) => ({ ...current, redirectUrl: event.target.value }))}
            />
          </label>
          <label className="form-grid__full">
            <span>Upload Poster</span>
            <input type="file" accept="image/*" onChange={(event) => setPopup((current) => ({ ...current, image: event.target.files?.[0] || null }))} />
          </label>
        </div>

        <label className="checkbox-item">
          <input
            type="checkbox"
            checked={Boolean(popup.isActive)}
            onChange={(event) => setPopup((current) => ({ ...current, isActive: event.target.checked }))}
          />
          <span>Show popup on site load</span>
        </label>

        {popup.imageUrl ? (
          <div className="popup-preview">
            <img src={resolveMediaUrl(popup.imageUrl)} alt={popup.title || 'Popup preview'} />
          </div>
        ) : null}

        {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
        {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

        <button type="submit" className="button" disabled={status.saving}>
          {status.saving ? 'Saving...' : 'Save Popup Settings'}
        </button>
      </form>
    </div>
  );
};
