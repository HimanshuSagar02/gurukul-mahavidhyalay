import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

export const AboutManagePage = () => {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '', saving: false });

  useEffect(() => {
    const loadSite = async () => {
      const response = await api.get('/admin/site');
      setForm(response.about);
    };

    loadSite();
  }, []);

  if (!form) {
    return <LoadingScreen label="Loading about content..." />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      await api.put('/admin/site/about', form);
      setStatus({ error: '', success: 'About content updated successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>About Management</p>
        <h2>Introduction, mission, vision, and principal message</h2>
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
          <textarea rows="4" value={form.mission} onChange={(event) => setForm((current) => ({ ...current, mission: event.target.value }))} />
        </label>
        <label>
          <span>Vision</span>
          <textarea rows="4" value={form.vision} onChange={(event) => setForm((current) => ({ ...current, vision: event.target.value }))} />
        </label>
        <div className="form-grid">
          <label>
            <span>Principal / Director Name</span>
            <input
              value={form.principalName}
              onChange={(event) => setForm((current) => ({ ...current, principalName: event.target.value }))}
            />
          </label>
          <label>
            <span>Designation</span>
            <input
              value={form.principalDesignation}
              onChange={(event) => setForm((current) => ({ ...current, principalDesignation: event.target.value }))}
            />
          </label>
          <label className="form-grid__full">
            <span>Principal Image URL</span>
            <input
              value={form.principalImage}
              onChange={(event) => setForm((current) => ({ ...current, principalImage: event.target.value }))}
            />
          </label>
        </div>
        <label>
          <span>Principal / Director Message</span>
          <textarea
            rows="5"
            value={form.principalMessage}
            onChange={(event) => setForm((current) => ({ ...current, principalMessage: event.target.value }))}
          />
        </label>

        {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
        {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

        <button type="submit" className="button" disabled={status.saving}>
          {status.saving ? 'Saving...' : 'Save About Content'}
        </button>
      </form>
    </div>
  );
};
