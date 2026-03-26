import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen';

const lazyImport = (factory, exportName) =>
  lazy(async () => {
    const module = await factory();
    return { default: module[exportName] };
  });

const ProtectedRoute = lazyImport(() => import('./components/admin/ProtectedRoute'), 'ProtectedRoute');
const AdminLayout = lazyImport(() => import('./layouts/AdminLayout'), 'AdminLayout');
const PublicLayout = lazyImport(() => import('./layouts/PublicLayout'), 'PublicLayout');
const AboutManagePage = lazyImport(() => import('./pages/admin/AboutManagePage'), 'AboutManagePage');
const AdmissionsManagePage = lazyImport(() => import('./pages/admin/AdmissionsManagePage'), 'AdmissionsManagePage');
const ContactManagePage = lazyImport(() => import('./pages/admin/ContactManagePage'), 'ContactManagePage');
const CoursesManagePage = lazyImport(() => import('./pages/admin/CoursesManagePage'), 'CoursesManagePage');
const DashboardPage = lazyImport(() => import('./pages/admin/DashboardPage'), 'DashboardPage');
const GalleryManagePage = lazyImport(() => import('./pages/admin/GalleryManagePage'), 'GalleryManagePage');
const LoginPage = lazyImport(() => import('./pages/admin/LoginPage'), 'LoginPage');
const NotificationsManagePage = lazyImport(() => import('./pages/admin/NotificationsManagePage'), 'NotificationsManagePage');
const PopupManagePage = lazyImport(() => import('./pages/admin/PopupManagePage'), 'PopupManagePage');
const SiteSettingsPage = lazyImport(() => import('./pages/admin/SiteSettingsPage'), 'SiteSettingsPage');
const AboutPage = lazyImport(() => import('./pages/public/AboutPage'), 'AboutPage');
const AdmissionsPage = lazyImport(() => import('./pages/public/AdmissionsPage'), 'AdmissionsPage');
const ContactPage = lazyImport(() => import('./pages/public/ContactPage'), 'ContactPage');
const CoursesPage = lazyImport(() => import('./pages/public/CoursesPage'), 'CoursesPage');
const GalleryPage = lazyImport(() => import('./pages/public/GalleryPage'), 'GalleryPage');
const HomePage = lazyImport(() => import('./pages/public/HomePage'), 'HomePage');
const NotificationsPage = lazyImport(() => import('./pages/public/NotificationsPage'), 'NotificationsPage');

const renderLazy = (Component, label) => (
  <Suspense fallback={<LoadingScreen label={label} />}>
    <Component />
  </Suspense>
);

const adminRoutes = (
  <Suspense fallback={<LoadingScreen label="Loading admin..." />}>
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  </Suspense>
);

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={renderLazy(LoginPage, 'Loading login...')} />
      <Route path="/admin/login" element={renderLazy(LoginPage, 'Loading login...')} />

      <Route path="/" element={renderLazy(PublicLayout, 'Loading website...')}>
        <Route index element={renderLazy(HomePage, 'Loading home...')} />
        <Route path="about" element={renderLazy(AboutPage, 'Loading about...')} />
        <Route path="courses" element={renderLazy(CoursesPage, 'Loading courses...')} />
        <Route path="admissions" element={renderLazy(AdmissionsPage, 'Loading admissions...')} />
        <Route path="notifications" element={renderLazy(NotificationsPage, 'Loading notifications...')} />
        <Route path="gallery" element={renderLazy(GalleryPage, 'Loading gallery...')} />
        <Route path="contact" element={renderLazy(ContactPage, 'Loading contact...')} />
      </Route>

      <Route path="/admin" element={adminRoutes}>
        <Route index element={<Navigate to="/admin/home" replace />} />
        <Route path="dashboard" element={renderLazy(DashboardPage, 'Loading dashboard...')} />
        <Route path="home" element={renderLazy(SiteSettingsPage, 'Loading home page settings...')} />
        <Route path="site" element={<Navigate to="/admin/home" replace />} />
        <Route path="about" element={renderLazy(AboutManagePage, 'Loading about settings...')} />
        <Route path="courses" element={renderLazy(CoursesManagePage, 'Loading courses...')} />
        <Route path="notifications" element={renderLazy(NotificationsManagePage, 'Loading notifications...')} />
        <Route path="gallery" element={renderLazy(GalleryManagePage, 'Loading gallery...')} />
        <Route path="contact" element={renderLazy(ContactManagePage, 'Loading contact...')} />
        <Route path="popup" element={renderLazy(PopupManagePage, 'Loading popup...')} />
        <Route path="admissions" element={renderLazy(AdmissionsManagePage, 'Loading admissions...')} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
