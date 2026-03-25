import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/admin/ProtectedRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { AboutManagePage } from './pages/admin/AboutManagePage';
import { AdmissionsManagePage } from './pages/admin/AdmissionsManagePage';
import { ContactManagePage } from './pages/admin/ContactManagePage';
import { CoursesManagePage } from './pages/admin/CoursesManagePage';
import { DashboardPage } from './pages/admin/DashboardPage';
import { GalleryManagePage } from './pages/admin/GalleryManagePage';
import { LoginPage } from './pages/admin/LoginPage';
import { NotificationsManagePage } from './pages/admin/NotificationsManagePage';
import { PopupManagePage } from './pages/admin/PopupManagePage';
import { SiteSettingsPage } from './pages/admin/SiteSettingsPage';
import { AboutPage } from './pages/public/AboutPage';
import { AdmissionsPage } from './pages/public/AdmissionsPage';
import { ContactPage } from './pages/public/ContactPage';
import { CoursesPage } from './pages/public/CoursesPage';
import { GalleryPage } from './pages/public/GalleryPage';
import { HomePage } from './pages/public/HomePage';
import { NotificationsPage } from './pages/public/NotificationsPage';

const adminRoutes = (
  <ProtectedRoute>
    <AdminLayout />
  </ProtectedRoute>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/login" element={<LoginPage />} />

      <Route path="/" element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="admissions" element={<AdmissionsPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="contact" element={<ContactPage />} />
      </Route>

      <Route path="/admin" element={adminRoutes}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="site" element={<SiteSettingsPage />} />
        <Route path="about" element={<AboutManagePage />} />
        <Route path="courses" element={<CoursesManagePage />} />
        <Route path="notifications" element={<NotificationsManagePage />} />
        <Route path="gallery" element={<GalleryManagePage />} />
        <Route path="contact" element={<ContactManagePage />} />
        <Route path="popup" element={<PopupManagePage />} />
        <Route path="admissions" element={<AdmissionsManagePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
