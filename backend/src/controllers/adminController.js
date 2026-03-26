import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AdmissionSubmission } from '../models/AdmissionSubmission.js';
import { AdminUser } from '../models/AdminUser.js';
import { Course } from '../models/Course.js';
import { GalleryItem } from '../models/GalleryItem.js';
import { Inquiry } from '../models/Inquiry.js';
import { Notification } from '../models/Notification.js';
import { PopupAd } from '../models/PopupAd.js';
import { SiteContent } from '../models/SiteContent.js';
import { decryptValue } from '../utils/crypto.js';
import { deleteUploadedFile } from '../utils/fileStorage.js';
import { uploadImage } from '../utils/mediaStorage.js';

const cookieName = process.env.COOKIE_NAME || 'gurukul_admin_token';

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const createToken = (adminId) =>
  jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });

const getSiteContent = () => SiteContent.findOne({ singletonKey: 'site-content' });
const asPlainObject = (value) => (value?.toObject ? value.toObject() : value || {});

const siteMediaFieldMap = {
  websiteLogo: {
    folderName: 'site-branding',
    urlPath: 'branding.websiteLogoUrl',
    publicIdPath: 'branding.websiteLogoPublicId'
  },
  motivationImage: {
    folderName: 'site-motivation',
    urlPath: 'motivation.imageUrl',
    publicIdPath: 'motivation.imagePublicId'
  },
  principalImage: {
    folderName: 'leadership',
    urlPath: 'about.principalImage',
    publicIdPath: 'about.principalImagePublicId'
  },
  ceoImage: {
    folderName: 'leadership',
    urlPath: 'about.ceoImage',
    publicIdPath: 'about.ceoImagePublicId'
  }
};

const normalizeHeroSlides = (slides = [], currentSlides = []) =>
  slides.map((slide, index) => ({
    title: String(slide?.title || '').trim(),
    subtitle: String(slide?.subtitle || '').trim(),
    image: String(slide?.image ?? currentSlides[index]?.image ?? '').trim(),
    imagePublicId: String(slide?.imagePublicId ?? currentSlides[index]?.imagePublicId ?? '').trim()
  }));

const normalizeFeatureList = (items = []) =>
  items
    .filter((item) => item && (item.title || item.description || item.badge))
    .map((item) => ({
      title: String(item.title || '').trim(),
      description: String(item.description || '').trim(),
      badge: String(item.badge || '').trim().slice(0, 4)
    }));

const normalizeTestimonials = (items = []) =>
  items
    .filter((item) => item && (item.name || item.role || item.quote))
    .map((item) => ({
      name: String(item.name || '').trim(),
      role: String(item.role || '').trim(),
      quote: String(item.quote || '').trim()
    }));

const normalizeManagementProfiles = (profiles = [], currentProfiles = []) => {
  const currentProfilesById = new Map(
    currentProfiles
      .filter((profile) => profile?.id)
      .map((profile) => [profile.id, profile])
  );

  return profiles
    .filter((profile) => profile && profile.id)
    .map((profile, index) => {
      const currentProfile = currentProfilesById.get(profile.id) || {};
      return {
        id: String(profile.id).trim(),
        name: String(profile.name || '').trim(),
        work: String(profile.work ?? profile.designation ?? '').trim(),
        experience: String(profile.experience ?? profile.message ?? '').trim(),
        imageUrl: String(profile.imageUrl ?? currentProfile.imageUrl ?? '').trim(),
        imagePublicId: String(profile.imagePublicId ?? currentProfile.imagePublicId ?? '').trim(),
        displayOrder: Number.isFinite(Number(profile.displayOrder)) ? Number(profile.displayOrder) : index
      };
    });
};

const getDynamicSiteMediaField = (siteContent, field, body) => {
  const staticField = siteMediaFieldMap[field];
  if (staticField) {
    return {
      folderName: staticField.folderName,
      currentImageUrl: siteContent.get(staticField.urlPath),
      currentPublicId: siteContent.get(staticField.publicIdPath),
      applyUpload: (uploadedImage) => {
        siteContent.set(staticField.urlPath, uploadedImage.imageUrl);
        siteContent.set(staticField.publicIdPath, uploadedImage.publicId);
      }
    };
  }

  if (field === 'heroSlideImage') {
    const slideIndex = Number.parseInt(body.slideIndex, 10);
    if (Number.isNaN(slideIndex) || slideIndex < 0 || slideIndex >= siteContent.hero.slides.length) {
      return null;
    }

    const slide = siteContent.hero.slides[slideIndex];
    return {
      folderName: 'hero-slides',
      currentImageUrl: slide.image,
      currentPublicId: slide.imagePublicId,
      applyUpload: (uploadedImage) => {
        slide.image = uploadedImage.imageUrl;
        slide.imagePublicId = uploadedImage.publicId;
      }
    };
  }

  if (field === 'managementProfileImage') {
    const memberId = String(body.memberId || '').trim();
    const profile = siteContent.about.managementProfiles.find((item) => item.id === memberId);

    if (!profile) {
      return null;
    }

    return {
      folderName: 'leadership',
      currentImageUrl: profile.imageUrl,
      currentPublicId: profile.imagePublicId,
      applyUpload: (uploadedImage) => {
        profile.imageUrl = uploadedImage.imageUrl;
        profile.imagePublicId = uploadedImage.publicId;
      }
    };
  }

  return null;
};

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  const adminUser = await AdminUser.findOne({ email: email.toLowerCase().trim() });

  if (!adminUser) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const passwordMatches = await bcrypt.compare(password, adminUser.passwordHash);

  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  const token = createToken(adminUser._id.toString());
  res.cookie(cookieName, token, cookieOptions);

  res.json({
    user: {
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email
    }
  });
};

export const logoutAdmin = async (req, res) => {
  res.clearCookie(cookieName, cookieOptions);
  res.json({ message: 'Logged out successfully.' });
};

export const getCurrentAdmin = async (req, res) => {
  res.json({ user: req.adminUser });
};

export const getDashboard = async (req, res) => {
  const [admissions, notifications, galleryItems, inquiries, popupAd] = await Promise.all([
    AdmissionSubmission.countDocuments(),
    Notification.countDocuments(),
    GalleryItem.countDocuments(),
    Inquiry.countDocuments(),
    PopupAd.findOne().sort({ updatedAt: -1 })
  ]);

  const [recentAdmissions, recentNotices, recentInquiries] = await Promise.all([
    AdmissionSubmission.find().sort({ createdAt: -1 }).limit(5),
    Notification.find().sort({ publishedAt: -1 }).limit(5),
    Inquiry.find().sort({ createdAt: -1 }).limit(5)
  ]);

  res.json({
    stats: {
      admissions,
      notifications,
      galleryItems,
      inquiries,
      popupActive: Boolean(popupAd?.isActive && popupAd?.imageUrl)
    },
    recentAdmissions,
    recentNotices,
    recentInquiries
  });
};

export const getAdminSiteContent = async (req, res) => {
  const siteContent = await getSiteContent();
  res.json(siteContent);
};

export const updateGeneralContent = async (req, res) => {
  const siteContent = await getSiteContent();
  const currentHero = asPlainObject(siteContent.hero);
  const currentBranding = asPlainObject(siteContent.branding);
  const currentSocialLinks = asPlainObject(siteContent.socialLinks);
  const currentHomepage = asPlainObject(siteContent.homepage);
  const currentMotivation = asPlainObject(siteContent.motivation);
  const nextHero = req.body.hero || {};
  const nextHomepage = req.body.homepage || {};

  Object.assign(siteContent, {
    collegeName: req.body.collegeName?.trim() || siteContent.collegeName,
    location: req.body.location?.trim() || siteContent.location,
    affiliation: req.body.affiliation?.trim() || siteContent.affiliation,
    announcementTicker: req.body.announcementTicker?.trim() ?? siteContent.announcementTicker,
    headerLinks: Array.isArray(req.body.headerLinks) ? req.body.headerLinks : siteContent.headerLinks,
    footer: req.body.footer || siteContent.footer,
    hero: {
      ...currentHero,
      ...nextHero,
      slides: Array.isArray(nextHero.slides) ? normalizeHeroSlides(nextHero.slides, currentHero.slides) : currentHero.slides
    },
    branding: {
      ...currentBranding,
      ...req.body.branding
    },
    socialLinks: {
      ...currentSocialLinks,
      ...req.body.socialLinks
    },
    homepage: {
      ...currentHomepage,
      ...nextHomepage,
      facilities: Array.isArray(nextHomepage.facilities)
        ? normalizeFeatureList(nextHomepage.facilities)
        : currentHomepage.facilities,
      admissionSteps: Array.isArray(nextHomepage.admissionSteps)
        ? normalizeFeatureList(nextHomepage.admissionSteps)
        : currentHomepage.admissionSteps,
      testimonials: Array.isArray(nextHomepage.testimonials)
        ? normalizeTestimonials(nextHomepage.testimonials)
        : currentHomepage.testimonials
    },
    motivation: {
      ...currentMotivation,
      ...req.body.motivation
    }
  });

  await siteContent.save();
  res.json(siteContent);
};

export const uploadSiteMedia = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Image file is required.' });
  }

  const siteContent = await getSiteContent();
  const mediaField = getDynamicSiteMediaField(siteContent, req.body.field, req.body);

  if (!mediaField) {
    return res.status(400).json({ message: 'Invalid media field.' });
  }

  const uploadedImage = await uploadImage({
    buffer: req.file.buffer,
    mimeType: req.file.mimetype,
    originalName: req.file.originalname,
    folderName: mediaField.folderName
  });

  await deleteUploadedFile(mediaField.currentImageUrl, mediaField.currentPublicId);
  mediaField.applyUpload(uploadedImage);

  await siteContent.save();
  res.json({ site: siteContent });
};

export const updateAboutContent = async (req, res) => {
  const siteContent = await getSiteContent();
  const currentAbout = asPlainObject(siteContent.about);
  const nextProfiles = Array.isArray(req.body.managementProfiles)
    ? normalizeManagementProfiles(req.body.managementProfiles, currentAbout.managementProfiles)
    : currentAbout.managementProfiles;
  const removedProfiles = (currentAbout.managementProfiles || []).filter(
    (profile) => profile?.id && !nextProfiles.some((item) => item.id === profile.id)
  );

  await Promise.all(
    removedProfiles.map((profile) => deleteUploadedFile(profile.imageUrl, profile.imagePublicId))
  );

  siteContent.about = {
    ...currentAbout,
    ...req.body,
    principalImagePublicId: req.body.principalImagePublicId ?? currentAbout.principalImagePublicId ?? '',
    ceoImagePublicId: req.body.ceoImagePublicId ?? currentAbout.ceoImagePublicId ?? '',
    managementProfiles: nextProfiles
  };

  await siteContent.save();
  res.json(siteContent.about);
};

export const updateContactContent = async (req, res) => {
  const siteContent = await getSiteContent();
  siteContent.contact = {
    ...siteContent.contact.toObject(),
    ...req.body
  };

  await siteContent.save();
  res.json(siteContent.contact);
};

export const listCourses = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: 1 });
  res.json(courses);
};

export const createCourse = async (req, res) => {
  const { title, overview, duration, eligibility, subjects } = req.body;

  if (!title || !overview) {
    return res.status(400).json({ message: 'Course title and overview are required.' });
  }

  const slug =
    req.body.slug?.trim().toLowerCase() ||
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const existing = await Course.findOne({ slug });
  if (existing) {
    return res.status(409).json({ message: 'A course with this slug already exists.' });
  }

  const course = await Course.create({
    title: title.trim(),
    slug,
    overview: overview.trim(),
    duration: duration?.trim() || '',
    eligibility: eligibility?.trim() || '',
    subjects: Array.isArray(subjects) ? subjects : []
  });

  res.status(201).json(course);
};

export const updateCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  Object.assign(course, {
    title: req.body.title?.trim() || course.title,
    overview: req.body.overview?.trim() || course.overview,
    duration: req.body.duration?.trim() ?? course.duration,
    eligibility: req.body.eligibility?.trim() ?? course.eligibility,
    subjects: Array.isArray(req.body.subjects) ? req.body.subjects : course.subjects
  });

  await course.save();
  res.json(course);
};

export const deleteCourse = async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);

  if (!course) {
    return res.status(404).json({ message: 'Course not found.' });
  }

  res.json({ message: 'Course deleted successfully.' });
};

export const listNotifications = async (req, res) => {
  const notices = await Notification.find().sort({ publishedAt: -1 });
  res.json(notices);
};

export const createNotification = async (req, res) => {
  const { title, description, category, publishedAt } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Notification title is required.' });
  }

  const notification = await Notification.create({
    title: title.trim(),
    description: description?.trim() || '',
    category: category?.trim() || 'General',
    publishedAt: publishedAt || Date.now()
  });

  res.status(201).json(notification);
};

export const updateNotification = async (req, res) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found.' });
  }

  Object.assign(notification, {
    title: req.body.title?.trim() || notification.title,
    description: req.body.description?.trim() ?? notification.description,
    category: req.body.category?.trim() ?? notification.category,
    publishedAt: req.body.publishedAt || notification.publishedAt
  });

  await notification.save();
  res.json(notification);
};

export const deleteNotification = async (req, res) => {
  const notification = await Notification.findByIdAndDelete(req.params.id);

  if (!notification) {
    return res.status(404).json({ message: 'Notification not found.' });
  }

  res.json({ message: 'Notification deleted successfully.' });
};

export const listGalleryItems = async (req, res) => {
  const galleryItems = await GalleryItem.find().sort({ displayOrder: 1, createdAt: -1 });
  res.json(galleryItems);
};

export const createGalleryItem = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Gallery image is required.' });
  }

  const uploadedImage = await uploadImage({
    buffer: req.file.buffer,
    mimeType: req.file.mimetype,
    originalName: req.file.originalname,
    folderName: 'gallery'
  });
  const item = await GalleryItem.create({
    imageUrl: uploadedImage.imageUrl,
    cloudinaryPublicId: uploadedImage.publicId,
    category: req.body.category?.trim() || '',
    caption: req.body.caption?.trim() || '',
    photoOf: req.body.photoOf?.trim() || '',
    displayOrder: Number(req.body.displayOrder || 0)
  });

  res.status(201).json(item);
};

export const deleteGalleryItem = async (req, res) => {
  const item = await GalleryItem.findByIdAndDelete(req.params.id);

  if (!item) {
    return res.status(404).json({ message: 'Gallery image not found.' });
  }

  await deleteUploadedFile(item.imageUrl, item.cloudinaryPublicId);
  res.json({ message: 'Gallery item deleted successfully.' });
};

export const listAdmissions = async (req, res) => {
  const admissions = await AdmissionSubmission.find().sort({ createdAt: -1 }).lean();
  res.json(
    admissions.map((item) => ({
      ...item,
      email: item.email,
      aadhaarNumber: decryptValue(item.aadhaarEncrypted)
    }))
  );
};

export const getPopup = async (req, res) => {
  const popup = await PopupAd.findOne().sort({ updatedAt: -1 });
  res.json(
    popup || {
      title: 'Latest Update',
      imageUrl: '',
      redirectUrl: '',
      isActive: false
    }
  );
};

export const upsertPopup = async (req, res) => {
  let popup = await PopupAd.findOne().sort({ updatedAt: -1 });

  if (!popup) {
    popup = new PopupAd();
  }

  if (req.file) {
    const uploadedImage = await uploadImage({
      buffer: req.file.buffer,
      mimeType: req.file.mimetype,
      originalName: req.file.originalname,
      folderName: 'popup'
    });

    await deleteUploadedFile(popup.imageUrl, popup.cloudinaryPublicId);
    popup.imageUrl = uploadedImage.imageUrl;
    popup.cloudinaryPublicId = uploadedImage.publicId;
  }

  popup.title = req.body.title?.trim() || popup.title || 'Latest Update';
  popup.redirectUrl = req.body.redirectUrl?.trim() || '';
  popup.isActive = req.body.isActive === 'true' || req.body.isActive === true;

  await popup.save();
  res.json(popup);
};

export const listInquiries = async (req, res) => {
  const inquiries = await Inquiry.find().sort({ createdAt: -1 });
  res.json(inquiries);
};
