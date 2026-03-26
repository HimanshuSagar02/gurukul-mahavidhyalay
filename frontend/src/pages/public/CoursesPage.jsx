import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../../api/client';
import { EmptyState } from '../../components/EmptyState';
import { LoadingScreen } from '../../components/LoadingScreen';
import { SectionHeading } from '../../components/SectionHeading';
import { PageBanner } from '../../components/public/PageBanner';

export const CoursesPage = () => {
  const [courses, setCourses] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      const data = await api.get('/public/courses');
      setCourses(data.courses);
    };

    loadCourses();
  }, []);

  if (!courses) {
    return <LoadingScreen />;
  }

  return (
    <>
      <PageBanner title="Courses" subtitle="Current academic offerings and eligibility details." />

      <section className="section">
        <div className="container">
          <SectionHeading eyebrow="Academic Programmes" title="Available courses" />

          {courses.length ? (
            <div className="course-stack">
              {courses.map((course) => (
                <article key={course._id} className="course-sheet">
                  <div>
                    {course.duration ? <span className="course-sheet__meta">{course.duration}</span> : null}
                    <h2>{course.title}</h2>
                    {course.overview ? <p>{course.overview}</p> : null}
                  </div>
                  {(course.eligibility || course.subjects.length) ? (
                    <div className="course-sheet__details">
                      {course.eligibility ? (
                        <div>
                          <h3>Eligibility</h3>
                          <p>{course.eligibility}</p>
                        </div>
                      ) : null}
                      {course.subjects.length ? (
                        <div>
                          <h3>Subjects</h3>
                          <ul className="subject-list subject-list--wide">
                            {course.subjects.map((subject) => (
                              <li key={subject}>{subject}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Courses will be listed soon" description="Please check back for updated programme details." />
          )}

          {courses.length ? (
            <div className="section__actions">
              <Link to="/admissions" className="button">
                Apply for Admission
              </Link>
            </div>
          ) : null}
        </div>
      </section>
    </>
  );
};
