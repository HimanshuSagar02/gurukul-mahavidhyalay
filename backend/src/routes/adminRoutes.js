import { Router } from 'express';
import {
  createCourse,
  createGalleryItem,
  createNotification,
  deleteCourse,
  deleteGalleryItem,
  deleteNotification,
  getAdminSiteContent,
  getCurrentAdmin,
  getDashboard,
  getPopup,
  listAdmissions,
  listCourses,
  listGalleryItems,
  listInquiries,
  listNotifications,
  loginAdmin,
  logoutAdmin,
  updateAboutContent,
  updateContactContent,
  updateCourse,
  updateGeneralContent,
  updateNotification,
  uploadSiteMedia,
  upsertPopup
} from '../controllers/adminController.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { createImageUpload } from '../middleware/upload.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
const galleryUpload = createImageUpload();
const popupUpload = createImageUpload();
const siteMediaUpload = createImageUpload();

router.post('/auth/login', asyncHandler(loginAdmin));
router.post('/auth/logout', asyncHandler(logoutAdmin));
router.get('/auth/me', requireAdminAuth, asyncHandler(getCurrentAdmin));

router.get('/dashboard', requireAdminAuth, asyncHandler(getDashboard));

router.get('/site', requireAdminAuth, asyncHandler(getAdminSiteContent));
router.put('/site/general', requireAdminAuth, asyncHandler(updateGeneralContent));
router.post('/site/media', requireAdminAuth, siteMediaUpload.single('image'), asyncHandler(uploadSiteMedia));
router.put('/site/about', requireAdminAuth, asyncHandler(updateAboutContent));
router.put('/site/contact', requireAdminAuth, asyncHandler(updateContactContent));

router.get('/courses', requireAdminAuth, asyncHandler(listCourses));
router.post('/courses', requireAdminAuth, asyncHandler(createCourse));
router.put('/courses/:id', requireAdminAuth, asyncHandler(updateCourse));
router.delete('/courses/:id', requireAdminAuth, asyncHandler(deleteCourse));

router.get('/notifications', requireAdminAuth, asyncHandler(listNotifications));
router.post('/notifications', requireAdminAuth, asyncHandler(createNotification));
router.put('/notifications/:id', requireAdminAuth, asyncHandler(updateNotification));
router.delete('/notifications/:id', requireAdminAuth, asyncHandler(deleteNotification));

router.get('/gallery', requireAdminAuth, asyncHandler(listGalleryItems));
router.post('/gallery', requireAdminAuth, galleryUpload.single('image'), asyncHandler(createGalleryItem));
router.delete('/gallery/:id', requireAdminAuth, asyncHandler(deleteGalleryItem));

router.get('/admissions', requireAdminAuth, asyncHandler(listAdmissions));
router.get('/inquiries', requireAdminAuth, asyncHandler(listInquiries));

router.get('/popup', requireAdminAuth, asyncHandler(getPopup));
router.put('/popup', requireAdminAuth, popupUpload.single('image'), asyncHandler(upsertPopup));

export default router;
