import { useEffect, useState } from 'react';
import { api, formatDate } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

const initialNotice = {
  title: '',
  category: 'General',
  description: '',
  publishedAt: ''
};

const mapNoticeToForm = (notice) => ({
  title: notice.title,
  category: notice.category,
  description: notice.description,
  publishedAt: notice.publishedAt ? notice.publishedAt.slice(0, 10) : ''
});

export const NotificationsManagePage = () => {
  const [notifications, setNotifications] = useState(null);
  const [form, setForm] = useState(initialNotice);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '', saving: false });

  const loadNotifications = async () => {
    const response = await api.get('/admin/notifications');
    setNotifications(response);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  if (!notifications) {
    return <LoadingScreen label="Loading notifications..." />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      if (editingId) {
        await api.put(`/admin/notifications/${editingId}`, form);
      } else {
        await api.post('/admin/notifications', form);
      }

      await loadNotifications();
      setForm(initialNotice);
      setEditingId(null);
      setStatus({ error: '', success: 'Notification saved successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Notifications</p>
        <h2>Publish and manage notices</h2>
      </div>

      <div className="admin-grid">
        <form className="admin-card form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Notification' : 'Add Notification'}</h3>
          <label>
            <span>Title</span>
            <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
          </label>
          <div className="form-grid">
            <label>
              <span>Category</span>
              <input value={form.category} onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))} />
            </label>
            <label>
              <span>Published Date</span>
              <input
                type="date"
                value={form.publishedAt}
                onChange={(event) => setForm((current) => ({ ...current, publishedAt: event.target.value }))}
              />
            </label>
          </div>
          <label>
            <span>Description</span>
            <textarea rows="5" value={form.description} onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))} />
          </label>

          {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
          {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

          <div className="button-row">
            <button type="submit" className="button" disabled={status.saving}>
              {status.saving ? 'Saving...' : editingId ? 'Update Notification' : 'Add Notification'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialNotice);
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <section className="admin-card">
          <h3>Published Notifications</h3>
          <div className="stacked-list">
            {notifications.map((notice) => (
              <div key={notice._id} className="admin-subcard">
                <div className="stacked-list__row">
                  <div>
                    <strong>{notice.title}</strong>
                    <p>{notice.description || 'No description added.'}</p>
                    <small>
                      {notice.category} | {formatDate(notice.publishedAt)}
                    </small>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => {
                        setEditingId(notice._id);
                        setForm(mapNoticeToForm(notice));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={async () => {
                        if (!window.confirm('Delete this notification?')) {
                          return;
                        }

                        await api.delete(`/admin/notifications/${notice._id}`);
                        await loadNotifications();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
