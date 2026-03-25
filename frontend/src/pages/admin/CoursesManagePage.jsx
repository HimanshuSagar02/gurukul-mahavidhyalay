import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { LoadingScreen } from '../../components/LoadingScreen';

const initialCourse = {
  title: '',
  slug: '',
  overview: '',
  duration: '',
  eligibility: '',
  subjectsText: ''
};

const mapCourseToForm = (course) => ({
  title: course.title,
  slug: course.slug,
  overview: course.overview,
  duration: course.duration,
  eligibility: course.eligibility,
  subjectsText: course.subjects.join(', ')
});

const normaliseCoursePayload = (form) => ({
  title: form.title,
  slug: form.slug,
  overview: form.overview,
  duration: form.duration,
  eligibility: form.eligibility,
  subjects: form.subjectsText
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
});

export const CoursesManagePage = () => {
  const [courses, setCourses] = useState(null);
  const [form, setForm] = useState(initialCourse);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ error: '', success: '', saving: false });

  const loadCourses = async () => {
    const response = await api.get('/admin/courses');
    setCourses(response);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  if (!courses) {
    return <LoadingScreen label="Loading courses..." />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus({ error: '', success: '', saving: true });

    try {
      if (editingId) {
        await api.put(`/admin/courses/${editingId}`, normaliseCoursePayload(form));
      } else {
        await api.post('/admin/courses', normaliseCoursePayload(form));
      }

      await loadCourses();
      setForm(initialCourse);
      setEditingId(null);
      setStatus({ error: '', success: 'Course information saved successfully.', saving: false });
    } catch (error) {
      setStatus({ error: error.message, success: '', saving: false });
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-section-heading">
        <p>Courses</p>
        <h2>Manage academic programme details</h2>
      </div>

      <div className="admin-grid">
        <form className="admin-card form-card" onSubmit={handleSubmit}>
          <h3>{editingId ? 'Edit Course' : 'Add Course'}</h3>
          <div className="form-grid">
            <label>
              <span>Title</span>
              <input value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} />
            </label>
            <label>
              <span>Slug</span>
              <input value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
            </label>
            <label className="form-grid__full">
              <span>Overview</span>
              <textarea rows="4" value={form.overview} onChange={(event) => setForm((current) => ({ ...current, overview: event.target.value }))} />
            </label>
            <label>
              <span>Duration</span>
              <input value={form.duration} onChange={(event) => setForm((current) => ({ ...current, duration: event.target.value }))} />
            </label>
            <label>
              <span>Eligibility</span>
              <input value={form.eligibility} onChange={(event) => setForm((current) => ({ ...current, eligibility: event.target.value }))} />
            </label>
            <label className="form-grid__full">
              <span>Subjects (comma separated)</span>
              <textarea
                rows="3"
                value={form.subjectsText}
                onChange={(event) => setForm((current) => ({ ...current, subjectsText: event.target.value }))}
              />
            </label>
          </div>

          {status.error ? <p className="form-message form-message--error">{status.error}</p> : null}
          {status.success ? <p className="form-message form-message--success">{status.success}</p> : null}

          <div className="button-row">
            <button type="submit" className="button" disabled={status.saving}>
              {status.saving ? 'Saving...' : editingId ? 'Update Course' : 'Add Course'}
            </button>
            {editingId ? (
              <button
                type="button"
                className="button button--secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm(initialCourse);
                }}
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>

        <section className="admin-card">
          <h3>Existing Courses</h3>
          <div className="stacked-list">
            {courses.map((course) => (
              <div key={course._id} className="admin-subcard">
                <div className="stacked-list__row">
                  <div>
                    <strong>{course.title}</strong>
                    <p>{course.overview}</p>
                  </div>
                  <div className="button-row">
                    <button
                      type="button"
                      className="button button--secondary"
                      onClick={() => {
                        setEditingId(course._id);
                        setForm(mapCourseToForm(course));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button--danger"
                      onClick={async () => {
                        if (!window.confirm('Delete this course?')) {
                          return;
                        }

                        await api.delete(`/admin/courses/${course._id}`);
                        await loadCourses();
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
