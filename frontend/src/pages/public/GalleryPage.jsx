import { useEffect, useState } from 'react';
import { api, resolveMediaUrl } from '../../api/client';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { PageBanner } from '../../components/public/PageBanner';

export const GalleryPage = () => {
  const [gallery, setGallery] = useState(null);

  useEffect(() => {
    const loadGallery = async () => {
      const data = await api.get('/public/gallery');
      setGallery(data.gallery);
    };

    loadGallery();
  }, []);

  if (!gallery) {
    return <LoadingScreen />;
  }

  return (
    <>
      <PageBanner title="Gallery" subtitle="Selected moments from academic and campus life." />

      <section className="section">
        <div className="container">
          {gallery.length ? (
            <div className="gallery-grid">
              {gallery.map((item) => (
                <figure key={item._id} className="gallery-grid__item">
                  <img src={resolveMediaUrl(item.imageUrl)} alt={item.caption || 'Gallery item'} loading="lazy" decoding="async" />
                  {(item.caption || item.category || item.photoOf) ? (
                    <figcaption>
                      {item.category ? <span className="gallery-card__eyebrow">{item.category}</span> : null}
                      {item.caption ? <strong>{item.caption}</strong> : null}
                      {item.photoOf ? <p className="gallery-card__detail">Featuring: {item.photoOf}</p> : null}
                    </figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          ) : (
            <EmptyState title="Gallery is being updated" description="New campus photographs will be published here." />
          )}
        </div>
      </section>
    </>
  );
};
