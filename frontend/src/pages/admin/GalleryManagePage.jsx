import { useEffect, useState } from 'react';
import { acceptedImageTypes, api, resolveMediaUrl } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

export const GalleryManagePage = () => {
  const [gallery, setGallery] = useState(null);
  const [form, setForm] = useState({ image: null, category: '', caption: '', photoOf: '', displayOrder: 0 });
  const [status, setStatus] = useState({ error: '', success: '', saving: false });

  const loadGallery = async () => {
    const response = await api.get('/admin/gallery');
    setGallery(response);
  };

  useEffect(() => {
    loadGallery();
  }, []);

  if (!gallery) {
    return <LoadingScreen label="Loading gallery manager..." />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      const payload = new FormData();
      payload.append('image', form.image);
      payload.append('category', form.category);
      payload.append('caption', form.caption);
      payload.append('photoOf', form.photoOf);
      payload.append('displayOrder', String(form.displayOrder || 0));

      await api.post('/admin/gallery', payload);
      await loadGallery();
      setForm({ image: null, category: '', caption: '', photoOf: '', displayOrder: 0 });
      event.target.reset();
      setStatus({ error: '', success: 'Gallery image uploaded successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Gallery</p>
        <h2>Upload and delete gallery images with category details</h2>
      </div>

      <div className="admin-grid">
        <form className="admin-card form-card" onSubmit={handleSubmit}>
          <h3>Upload Gallery Image</h3>
          <label>
            <span>Image File</span>
            <input
              type="file"
              accept={acceptedImageTypes}
              onChange={(event) => setForm((current) => ({ ...current, image: event.target.files?.[0] || null }))}
              required
            />
          </label>
          <label>
            <span>Category</span>
            <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
          </label>
          <label>
            <span>Photo Title</span>
            <input value={form.caption} onChange={(event) => setForm((current) => ({ ...current, caption: event.target.value }))} />
          </label>
          <label>
            <span>Photo Of</span>
            <input value={form.photoOf} onChange={(event) => setForm((current) => ({ ...current, photoOf: event.target.value }))} />
          </label>
          <label>
            <span>Display Order</span>
            <input type="number" value={form.displayOrder} onChange={(event) => setForm((current) => ({ ...current, displayOrder: event.target.value }))} />
          </label>

          {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
          {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

          <button type="submit" className="button" disabled={status.saving}>
            {status.saving ? 'Uploading...' : 'Upload Image'}
          </button>
        </form>

        <section className="admin-card">
          <h3>Current Gallery</h3>
          <div className="gallery-admin-grid">
            {gallery.map((item) => (
              <article key={item._id} className="gallery-admin-item">
                <img src={resolveMediaUrl(item.imageUrl)} alt={item.caption || 'Gallery item'} />
                <div className="gallery-admin-item__meta">
                  <div className="gallery-admin-item__text">
                    <strong>{item.caption || 'Untitled image'}</strong>
                    {item.category ? <span>{item.category}</span> : null}
                    {item.photoOf ? <span>Photo of: {item.photoOf}</span> : null}
                  </div>
                  <button
                    type="button"
                    className="button button--danger"
                    onClick={async () => {
                      if (!window.confirm('Delete this image?')) {
                        return;
                      }

                      await api.delete(`/admin/gallery/${item._id}`);
                      await loadGallery();
                    }}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
