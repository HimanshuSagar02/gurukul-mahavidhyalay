import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SectionHeading } from '../../components/SectionHeading';
import { PageBanner } from '../../components/public/PageBanner';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: ''
};

export const ContactPage = () => {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ error: '', success: '', submitting: false });

  useEffect(() => {
    const loadContact = async () => {
      const response = await api.get('/public/contact');
      setData(response);
    };

    loadContact();
  }, []);

  if (!data) {
    return <LoadingScreen label="Please wait..." />;
  }

  const { contact } = data;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', submitting: true });

    try {
      const response = await api.post('/public/inquiries', form);
      setStatus({ error: '', success: response.message, submitting: false });
      setForm(initialForm);
    } catch (error) {
      setStatus({ error: error.message, success: '', submitting: false });
    }
  };

  return (
    <>
      <PageBanner
        title="Contact"
        subtitle="We are here to help with admissions and general questions."
      />

      <section className="section">
        <div className="container contact-page">
          <div>
            <SectionHeading eyebrow="Contact Details" title="Get in Touch" description={contact.inquiryText} />
            <div className="contact-grid">
              <article className="content-block">
                <h3>Address</h3>
                <p>{contact.address}</p>
              </article>
              <article className="content-block">
                <h3>Phone</h3>
                <p>{contact.phone || 'Coming soon'}</p>
              </article>
              <article className="content-block">
                <h3>Email</h3>
                <p>{contact.email || 'Coming soon'}</p>
              </article>
            </div>

            {contact.mapEmbedUrl ? (
              <div className="map-frame">
                <iframe src={contact.mapEmbedUrl} title="College location map" loading="lazy" />
              </div>
            ) : (
              <div className="content-block">
                <h3>Location</h3>
                <p>Location details will be shared here soon.</p>
              </div>
            )}
          </div>

          <form className="admin-card form-card" onSubmit={handleSubmit}>
            <SectionHeading eyebrow="Send a Message" title={contact.inquiryHeadline} />
            <label>
              <span>Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                value={form.phone}
                onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              />
            </label>
            <label>
              <span>Message</span>
              <textarea
                rows="6"
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                required
              />
            </label>

            {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
            {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

            <button type="submit" className="button" disabled={status.submitting}>
              {status.submitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
