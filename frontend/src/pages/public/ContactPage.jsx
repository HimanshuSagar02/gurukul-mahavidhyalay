import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
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

const sanitizePhoneLink = (value = '') => value.replace(/[^\d+]/g, '');

export const ContactPage = () => {
  const { site } = useOutletContext();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ error: '', success: '', submitting: false });

  if (!site) {
    return <LoadingScreen />;
  }

  const contact = site.contact || {};
  const contactCards = [
    contact.address ? { label: 'Address', value: contact.address } : null,
    contact.phone ? { label: 'Phone', value: contact.phone, href: `tel:${sanitizePhoneLink(contact.phone)}` } : null,
    contact.email ? { label: 'Email', value: contact.email, href: `mailto:${contact.email}` } : null
  ].filter(Boolean);

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
      <PageBanner title="Contact" subtitle="Reach the college for admissions, academic queries, and general support." />

      <section className="section">
        <div className="container contact-page">
          <div>
            <SectionHeading eyebrow="Contact Details" title="Get in touch" description={contact.inquiryText} />

            {contactCards.length ? (
              <div className="contact-grid">
                {contactCards.map((item) => (
                  <article key={item.label} className="content-block">
                    <h3>{item.label}</h3>
                    {item.href ? <a href={item.href}>{item.value}</a> : <p>{item.value}</p>}
                  </article>
                ))}
              </div>
            ) : null}

            {contact.mapEmbedUrl ? (
              <div className="map-frame">
                <iframe src={contact.mapEmbedUrl} title="College location map" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            ) : null}
          </div>

          <form className="admin-card form-card" onSubmit={handleSubmit}>
            <SectionHeading eyebrow="Send a Message" title={contact.inquiryHeadline || 'Send us a message'} />
            <label>
              <span>Name</span>
              <input
                value={form.name}
                autoComplete="name"
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
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
