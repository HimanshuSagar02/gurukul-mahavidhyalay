import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Home Page', path: '/admin/home' },
  { label: 'About Page', path: '/admin/about' },
  { label: 'Courses', path: '/admin/courses' },
  { label: 'Notifications', path: '/admin/notifications' },
  { label: 'Gallery', path: '/admin/gallery' },
  { label: 'Contact', path: '/admin/contact' },
  { label: 'Popup', path: '/admin/popup' },
  { label: 'Admissions', path: '/admin/admissions' }
];

export const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <p>Hidden Admin Panel</p>
          <strong>Gurukul Mahavidhyalya</strong>
        </div>
        <nav className="admin-sidebar__nav">
          {adminLinks.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="admin-content">
        <header className="admin-topbar">
          <div>
            <p className="admin-topbar__eyebrow">Authenticated Session</p>
            <h1>{user?.name || 'Administrator'}</h1>
          </div>
          <button
            type="button"
            className="button button--dark"
            onClick={async () => {
              await logout();
              navigate('/login');
            }}
          >
            Logout
          </button>
        </header>
        <Outlet />
      </div>
    </div>
  );
};
