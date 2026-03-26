import { useEffect, useState } from 'react';
import { api, formatDate } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

export const AdmissionsManagePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadRecords = async () => {
      const [admissions, inquiries] = await Promise.all([api.get('/admin/admissions'), api.get('/admin/inquiries')]);
      setData({ admissions, inquiries });
    };

    loadRecords();
  }, []);

  if (!data) {
    return <LoadingScreen label="Loading admissions..." />;
  }

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Admissions</p>
        <h2>Submitted admission forms and inquiries</h2>
      </div>

      <section className="admin-card">
        <h3>Admission Submissions</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Father Name</th>
                <th>Mobile</th>
                <th>Gmail / Email</th>
                <th>Aadhaar</th>
                <th>Marks</th>
                <th>Subjects</th>
                <th>Address</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.admissions.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.fatherName}</td>
                  <td>{item.mobileNumber}</td>
                  <td>{item.email}</td>
                  <td>{item.aadhaarNumber}</td>
                  <td>{item.marksPercentage}</td>
                  <td>{item.selectedSubjects.join(', ') || '-'}</td>
                  <td>{item.address}</td>
                  <td>{formatDate(item.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-card">
        <h3>Inquiry Submissions</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {data.inquiries.map((item) => (
                <tr key={item._id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.phone || '-'}</td>
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
