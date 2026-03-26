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
    return <LoadingScreen />;
  }

  return (
    <>
      <PageBanner title="Notifications" subtitle="Official notices, updates, and announcements." />

      <section className="section">
        <div className="container">
          {notifications.length ? (
            <div className="notice-table">
              {notifications.map((notice) => (
                <article key={notice._id} className="notice-table__row">
                  <div className="notice-table__date">
                    <strong>{formatDate(notice.publishedAt)}</strong>
                    {notice.category ? <span>{notice.category}</span> : null}
                  </div>
                  <div className="notice-table__content">
                    <h3>{notice.title}</h3>
                    {notice.description ? <p>{notice.description}</p> : null}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No notifications available" description="Current notices will appear here as soon as they are published." />
          )}
        </div>
      </section>
    </>
  );
};
