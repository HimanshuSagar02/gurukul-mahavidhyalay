import { Router } from 'express';
import {
  getAboutPage,
  getContactPage,
  getCoursesPage,
  getGalleryPage,
  getNotificationsPage,
  getPopupAd,
  getPublicHome,
  getSiteDetails,
  submitAdmission,
  submitInquiry
} from '../controllers/publicController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/site', asyncHandler(getSiteDetails));
router.get('/home', asyncHandler(getPublicHome));
router.get('/about', asyncHandler(getAboutPage));
router.get('/courses', asyncHandler(getCoursesPage));
router.get('/notifications', asyncHandler(getNotificationsPage));
router.get('/gallery', asyncHandler(getGalleryPage));
router.get('/contact', asyncHandler(getContactPage));
router.get('/popup', asyncHandler(getPopupAd));
router.post('/admissions', asyncHandler(submitAdmission));
router.post('/inquiries', asyncHandler(submitInquiry));

export default router;
