import { useEffect, useState } from 'react';
import { api, formatDate } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

export const DashboardPage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      const response = await api.get('/admin/dashboard');
      setData(response);
    };

    loadDashboard();
  }, []);

  if (!data) {
    return <LoadingScreen label="Loading dashboard..." />;
  }

  const { stats, recentAdmissions, recentNotices, recentInquiries } = data;

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Dashboard</p>
        <h2>Overview</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span>Admissions</span>
          <strong>{stats.admissions}</strong>
        </div>
        <div className="stat-card">
          <span>Notifications</span>
          <strong>{stats.notifications}</strong>
        </div>
        <div className="stat-card">
          <span>Gallery Images</span>
          <strong>{stats.galleryItems}</strong>
        </div>
        <div className="stat-card">
          <span>Inquiries</span>
          <strong>{stats.inquiries}</strong>
        </div>
      </div>

      <div className="admin-grid">
        <section className="admin-card">
          <h3>Recent Admissions</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAdmissions.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.mobileNumber}</td>
                    <td>{formatDate(item.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-card">
          <h3>Recent Notifications</h3>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentNotices.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.category}</td>
                    <td>{formatDate(item.publishedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <section className="admin-card">
        <h3>Recent Inquiries</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentInquiries.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.message}</td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
