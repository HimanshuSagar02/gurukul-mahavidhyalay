import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SectionHeading } from '../../components/SectionHeading';
import { PageBanner } from '../../components/public/PageBanner';

const initialForm = {
  name: '',
  fatherName: '',
  mobileNumber: '',
  aadhaarNumber: '',
  marksPercentage: '',
  selectedSubjects: [],
  address: ''
};

export const AdmissionsPage = () => {
  const [courses, setCourses] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ error: '', success: '', submitting: false });

  useEffect(() => {
    const loadCourses = async () => {
      const data = await api.get('/public/courses');
      setCourses(data.courses);
    };

    loadCourses();
  }, []);

  if (!courses) {
    return <LoadingScreen label="Please wait..." />;
  }

  const subjects = courses[0]?.subjects || [];

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubjectToggle = (subject) => {
    setForm((current) => ({
      ...current,
      selectedSubjects: current.selectedSubjects.includes(subject)
        ? current.selectedSubjects.filter((item) => item !== subject)
        : [...current.selectedSubjects, subject]
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', submitting: true });

    try {
      const response = await api.post('/public/admissions', form);
      setStatus({ error: '', success: response.message, submitting: false });
      setForm(initialForm);
    } catch (error) {
      setStatus({ error: error.message, success: '', submitting: false });
    }
  };

  return (
    <>
      <PageBanner
        title="Apply for Admission"
        subtitle="Share your details to begin the admission process."
      />

      <section className="section">
        <div className="container admission-layout">
          <div>
            <SectionHeading
              eyebrow="How to Apply"
              title="Application Details"
              description="Complete the form below and we will review your request."
            />
            <div className="content-block">
              <h3>Course</h3>
              <p>{courses[0]?.title}</p>
              <h3>Eligibility</h3>
              <p>{courses[0]?.eligibility}</p>
            </div>
          </div>

          <form className="admin-card form-card" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                <span>Name</span>
                <input name="name" value={form.name} onChange={handleChange} required />
              </label>
              <label>
                <span>Father's Name</span>
                <input name="fatherName" value={form.fatherName} onChange={handleChange} required />
              </label>
              <label>
                <span>Mobile Number</span>
                <input name="mobileNumber" value={form.mobileNumber} onChange={handleChange} required maxLength={10} />
              </label>
              <label>
                <span>Aadhaar Number</span>
                <input name="aadhaarNumber" value={form.aadhaarNumber} onChange={handleChange} required maxLength={12} />
              </label>
              <label>
                <span>Class 12 Marks / Percentage</span>
                <input name="marksPercentage" value={form.marksPercentage} onChange={handleChange} required />
              </label>
              <label className="form-grid__full">
                <span>Address</span>
                <textarea name="address" value={form.address} onChange={handleChange} rows="4" required />
              </label>
            </div>

            <div className="checkbox-group">
              <span>Choose Subjects</span>
              <div className="checkbox-group__grid">
                {subjects.map((subject) => (
                  <label key={subject} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={form.selectedSubjects.includes(subject)}
                      onChange={() => handleSubjectToggle(subject)}
                    />
                    <span>{subject}</span>
                  </label>
                ))}
              </div>
            </div>

            {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
            {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

            <button type="submit" className="button" disabled={status.submitting}>
              {status.submitting ? 'Sending...' : 'Send Application'}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};
