import { useEffect, useState } from 'react';
import { api, formatDate } from '../../api/client';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { PageBanner } from '../../components/public/PageBanner';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(null);

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await api.get('/public/notifications');
      setNotifications(data.notifications);
    };

    loadNotifications();
  }, []);

  if (!notifications) {
    return <LoadingScreen label="Please wait..." />;
  }

  return (
    <>
      <PageBanner
        title="Notifications"
        subtitle="Latest news, notices, and important updates."
      />

      <section className="section">
        <div className="container">
          {notifications.length ? (
            <div className="notice-table">
              {notifications.map((notice) => (
                <article key={notice._id} className="notice-table__row">
                  <div className="notice-table__date">
                    <strong>{formatDate(notice.publishedAt)}</strong>
                    <span>{notice.category}</span>
                  </div>
                  <div className="notice-table__content">
                    <h3>{notice.title}</h3>
                    <p>{notice.description || 'More details will be shared soon.'}</p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No updates right now"
              description="Fresh updates will appear here soon."
            />
          )}
        </div>
      </section>
    </>
  );
};
