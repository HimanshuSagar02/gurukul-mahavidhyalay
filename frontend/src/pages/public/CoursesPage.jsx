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
    return <LoadingScreen label="Please wait..." />;
  }

  return (
    <>
      <PageBanner
        title="Courses"
        subtitle="Course details, subjects, and entry requirements."
      />

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Course Details"
            title="Explore what we offer"
            description="See the course structure, subjects, and entry requirements."
          />

          {courses.length ? (
            <div className="course-stack">
              {courses.map((course) => (
                <article key={course._id} className="course-sheet">
                  <div>
                    <span className="course-sheet__meta">{course.duration || 'Full Course Details'}</span>
                    <h2>{course.title}</h2>
                    <p>{course.overview}</p>
                  </div>
                  <div className="course-sheet__details">
                    <div>
                      <h3>Eligibility</h3>
                      <p>{course.eligibility}</p>
                    </div>
                    <div>
                      <h3>Subjects</h3>
                      <ul className="subject-list subject-list--wide">
                        {course.subjects.map((subject) => (
                          <li key={subject}>{subject}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="Course details coming soon"
              description="Please check back soon for the latest course information."
            />
          )}

          <div className="section__actions">
            <Link to="/admissions" className="button">
              Apply Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
