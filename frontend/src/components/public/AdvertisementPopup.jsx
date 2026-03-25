import { useEffect, useMemo, useState } from 'react';
import { resolveMediaUrl } from '../../api/client';

export const AdvertisementPopup = ({ popup }) => {
  const [dismissed, setDismissed] = useState(false);
  const storageKey = useMemo(() => {
    if (!popup?._id && !popup?.updatedAt) {
      return 'gurukul-popup-default';
    }

    return `gurukul-popup-${popup?._id || popup?.updatedAt}`;
  }, [popup?._id, popup?.updatedAt]);

  useEffect(() => {
    if (!popup?.isActive || !popup?.imageUrl) {
      setDismissed(true);
      return;
    }

    const isDismissed = window.localStorage.getItem(storageKey) === 'closed';
    setDismissed(isDismissed);
  }, [popup, storageKey]);

  if (!popup?.isActive || !popup?.imageUrl || dismissed) {
    return null;
  }

  const content = (
    <div className="popup">
      <button
        type="button"
        className="popup__close"
        onClick={() => {
          window.localStorage.setItem(storageKey, 'closed');
          setDismissed(true);
        }}
      >
        ×
      </button>
      <div className="popup__body">
        <span className="popup__label">{popup.title || 'Important Update'}</span>
        <img src={resolveMediaUrl(popup.imageUrl)} alt={popup.title || 'Advertisement'} />
      </div>
    </div>
  );

  return (
    <div className="popup-overlay">
      {popup.redirectUrl ? (
        <a href={popup.redirectUrl} target="_blank" rel="noreferrer" className="popup__link">
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};
