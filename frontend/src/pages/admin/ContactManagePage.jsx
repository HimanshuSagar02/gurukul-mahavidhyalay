import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

export const ContactManagePage = () => {
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '', saving: false });

  useEffect(() => {
    const loadSite = async () => {
      const response = await api.get('/admin/site');
      setForm(response.contact);
    };

    loadSite();
  }, []);

  if (!form) {
    return <LoadingScreen label="Loading contact details..." />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      await api.put('/admin/site/contact', form);
      setStatus({ error: '', success: 'Contact details updated successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Contact</p>
        <h2>Manage address, phone, email, and inquiry text</h2>
      </div>

      <form className="admin-card form-card" onSubmit={handleSubmit}>
        <label>
          <span>Address</span>
          <textarea rows="4" value={form.address} onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))} />
        </label>
        <div className="form-grid">
          <label>
            <span>Phone</span>
            <input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
          </label>
          <label>
            <span>Email</span>
            <input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
          </label>
          <label className="form-grid__full">
            <span>Map Embed URL</span>
            <input value={form.mapEmbedUrl} onChange={(event) => setForm((current) => ({ ...current, mapEmbedUrl: event.target.value }))} />
          </label>
          <label>
            <span>Inquiry Heading</span>
            <input value={form.inquiryHeadline} onChange={(event) => setForm((current) => ({ ...current, inquiryHeadline: event.target.value }))} />
          </label>
          <label className="form-grid__full">
            <span>Inquiry Text</span>
            <textarea rows="4" value={form.inquiryText} onChange={(event) => setForm((current) => ({ ...current, inquiryText: event.target.value }))} />
          </label>
        </div>

        {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
        {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

        <button type="submit" className="button" disabled={status.saving}>
          {status.saving ? 'Saving...' : 'Save Contact Details'}
        </button>
      </form>
    </div>
  );
};
