import { AdmissionSubmission } from '../models/AdmissionSubmission.js';
import { Course } from '../models/Course.js';
import { GalleryItem } from '../models/GalleryItem.js';
import { Inquiry } from '../models/Inquiry.js';
import { Notification } from '../models/Notification.js';
import { PopupAd } from '../models/PopupAd.js';
import { SiteContent } from '../models/SiteContent.js';
import { normalizeCollegeSpellingDeep, normalizeSiteIdentityFields } from '../utils/brandCopy.js';
import { encryptValue } from '../utils/crypto.js';

const getSiteContent = () => SiteContent.findOne({ singletonKey: 'site-content' }).lean();

const sanitizeLinkList = (links = []) =>
  (Array.isArray(links) ? links : [])
    .filter((link) => link?.label && link?.path)
    .map((link) => ({
      label: String(link.label).trim(),
      path: String(link.path).trim()
    }));

const sanitizeFeatureList = (items = []) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item?.title || item?.description || item?.badge)
    .map((item) => ({
      title: String(item.title || '').trim(),
      description: String(item.description || '').trim(),
      badge: String(item.badge || '').trim()
    }));

const sanitizeHighlightList = (items = []) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item?.value || item?.label || item?.detail)
    .map((item) => ({
      value: String(item.value || '').trim(),
      label: String(item.label || '').trim(),
      detail: String(item.detail || '').trim()
    }));

const sanitizeTestimonials = (items = []) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item?.name || item?.role || item?.quote)
    .map((item) => ({
      name: String(item.name || '').trim(),
      role: String(item.role || '').trim(),
      quote: String(item.quote || '').trim()
    }));

const sanitizeManagementProfiles = (profiles = []) =>
  (Array.isArray(profiles) ? profiles : [])
    .filter(
      (profile) =>
        profile?.id &&
        (profile?.name || profile?.work || profile?.designation || profile?.experience || profile?.message || profile?.imageUrl)
    )
    .map((profile) => ({
      id: String(profile.id).trim(),
      name: String(profile.name || '').trim(),
      work: String(profile.work ?? profile.designation ?? '').trim(),
      experience: String(profile.experience ?? profile.message ?? '').trim(),
      imageUrl: String(profile.imageUrl || '').trim(),
      displayOrder: Number.isFinite(Number(profile.displayOrder)) ? Number(profile.displayOrder) : 0
    }))
    .sort((first, second) => first.displayOrder - second.displayOrder);

const sanitizeSite = (site) => {
  const normalizedSite = normalizeCollegeSpellingDeep({
    collegeName: String(site?.collegeName || '').trim(),
    location: String(site?.location || '').trim(),
    affiliation: String(site?.affiliation || '').trim(),
    announcementTicker: String(site?.announcementTicker || '').trim(),
    headerLinks: sanitizeLinkList(site?.headerLinks),
    hero: {
      headline: String(site?.hero?.headline || '').trim(),
      subheadline: String(site?.hero?.subheadline || '').trim(),
      bannerNote: String(site?.hero?.bannerNote || '').trim(),
      primaryCtaLabel: String(site?.hero?.primaryCtaLabel || 'Apply Now').trim(),
      secondaryCtaLabel: String(site?.hero?.secondaryCtaLabel || 'Admissions Open').trim(),
      tertiaryCtaLabel: String(site?.hero?.tertiaryCtaLabel || 'Contact Us').trim()
    },
    branding: {
      websiteLogoUrl: String(site?.branding?.websiteLogoUrl || '/logo-mark.svg').trim()
    },
    socialLinks: {
      facebook: String(site?.socialLinks?.facebook || '').trim(),
      instagram: String(site?.socialLinks?.instagram || '').trim(),
      youtube: String(site?.socialLinks?.youtube || '').trim(),
      whatsapp: String(site?.socialLinks?.whatsapp || '').trim()
    },
    homepage: {
      highlights: sanitizeHighlightList(site?.homepage?.highlights),
      facilities: sanitizeFeatureList(site?.homepage?.facilities),
      admissionSteps: sanitizeFeatureList(site?.homepage?.admissionSteps),
      testimonials: sanitizeTestimonials(site?.homepage?.testimonials)
    },
    motivation: {
      enabled: Boolean(site?.motivation?.enabled),
      title: String(site?.motivation?.title || '').trim(),
      text: String(site?.motivation?.text || '').trim(),
      imageUrl: String(site?.motivation?.imageUrl || '').trim()
    },
    about: {
      introduction: String(site?.about?.introduction || '').trim(),
      mission: String(site?.about?.mission || '').trim(),
      vision: String(site?.about?.vision || '').trim(),
      principalName: String(site?.about?.principalName || '').trim(),
      principalDesignation: String(site?.about?.principalDesignation || '').trim(),
      principalMessage: String(site?.about?.principalMessage || '').trim(),
      principalImage: String(site?.about?.principalImage || '').trim(),
      ceoName: String(site?.about?.ceoName || '').trim(),
      ceoDesignation: String(site?.about?.ceoDesignation || '').trim(),
      ceoMessage: String(site?.about?.ceoMessage || '').trim(),
      ceoImage: String(site?.about?.ceoImage || '').trim(),
      managementProfiles: sanitizeManagementProfiles(site?.about?.managementProfiles)
    },
    contact: {
      address: String(site?.contact?.address || '').trim(),
      phone: String(site?.contact?.phone || '').trim(),
      email: String(site?.contact?.email || '').trim(),
      mapEmbedUrl: String(site?.contact?.mapEmbedUrl || '').trim(),
      inquiryHeadline: String(site?.contact?.inquiryHeadline || 'Send Us a Message').trim(),
      inquiryText: String(site?.contact?.inquiryText || '').trim()
    },
    footer: {
      quickLinks: sanitizeLinkList(site?.footer?.quickLinks),
      exploreLinks: sanitizeLinkList(site?.footer?.exploreLinks)
    }
  });

  return {
    ...normalizedSite,
    ...normalizeSiteIdentityFields(normalizedSite)
  };
};

const sanitizeCourses = (courses = []) =>
  normalizeCollegeSpellingDeep(
    courses.map((course) => ({
      _id: course._id,
      title: String(course.title || '').trim(),
      overview: String(course.overview || '').trim(),
      duration: String(course.duration || '').trim(),
      eligibility: String(course.eligibility || '').trim(),
      subjects: Array.isArray(course.subjects) ? course.subjects.map((subject) => String(subject).trim()).filter(Boolean) : []
    }))
  );

const sanitizeNotifications = (notifications = []) =>
  normalizeCollegeSpellingDeep(
    notifications.map((notice) => ({
      _id: notice._id,
      title: String(notice.title || '').trim(),
      description: String(notice.description || '').trim(),
      category: String(notice.category || '').trim(),
      publishedAt: notice.publishedAt
    }))
  );

const sanitizeGallery = (gallery = []) =>
  normalizeCollegeSpellingDeep(
    gallery.map((item) => ({
      _id: item._id,
      imageUrl: String(item.imageUrl || '').trim(),
      category: String(item.category || '').trim(),
      caption: String(item.caption || '').trim(),
      photoOf: String(item.photoOf || '').trim()
    }))
  );

const sanitizePopup = (popup) =>
  popup
    ? normalizeCollegeSpellingDeep({
        _id: popup._id,
        title: String(popup.title || '').trim(),
        imageUrl: String(popup.imageUrl || '').trim(),
        redirectUrl: String(popup.redirectUrl || '').trim(),
        isActive: Boolean(popup.isActive),
        updatedAt: popup.updatedAt
      })
    : null;

export const getSiteDetails = async (req, res) => {
  const site = await getSiteContent();
  res.json({ site: sanitizeSite(site) });
};

export const getPublicHome = async (req, res) => {
  const [site, courses, notifications, gallery, popup] = await Promise.all([
    getSiteContent(),
    Course.find().sort({ createdAt: 1 }).lean(),
    Notification.find().sort({ publishedAt: -1 }).limit(4).lean(),
    GalleryItem.find().sort({ displayOrder: 1, createdAt: -1 }).limit(6).lean(),
    PopupAd.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean()
  ]);

  res.json({
    site: sanitizeSite(site),
    courses: sanitizeCourses(courses),
    notifications: sanitizeNotifications(notifications),
    gallery: sanitizeGallery(gallery),
    popup: sanitizePopup(popup)
  });
};

export const getAboutPage = async (req, res) => {
  const site = await getSiteContent();
  res.json({ site: sanitizeSite(site) });
};

export const getCoursesPage = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: 1 }).lean();
  res.json({ courses: sanitizeCourses(courses) });
};

export const getNotificationsPage = async (req, res) => {
  const notifications = await Notification.find().sort({ publishedAt: -1 }).lean();
  res.json({ notifications: sanitizeNotifications(notifications) });
};

export const getGalleryPage = async (req, res) => {
  const gallery = await GalleryItem.find().sort({ displayOrder: 1, createdAt: -1 }).lean();
  res.json({ gallery: sanitizeGallery(gallery) });
};

export const getContactPage = async (req, res) => {
  const site = await getSiteContent();
  const publicSite = sanitizeSite(site);
  res.json({ contact: publicSite.contact, site: publicSite });
};

export const getPopupAd = async (req, res) => {
  const popup = await PopupAd.findOne({ isActive: true }).sort({ updatedAt: -1 }).lean();
  res.json({ popup: sanitizePopup(popup) });
};

export const submitAdmission = async (req, res) => {
  const { name, fatherName, mobileNumber, email, aadhaarNumber, marksPercentage, selectedSubjects, address } = req.body;

  if (!name || !fatherName || !mobileNumber || !email || !aadhaarNumber || !marksPercentage || !address) {
    return res.status(400).json({ message: 'All required admission fields must be completed.' });
  }

  if (!/^\d{10}$/.test(String(mobileNumber))) {
    return res.status(400).json({ message: 'Mobile number must contain 10 digits.' });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())) {
    return res.status(400).json({ message: 'Please enter a valid email address.' });
  }

  if (!/^\d{12}$/.test(String(aadhaarNumber))) {
    return res.status(400).json({ message: 'Aadhaar number must contain 12 digits.' });
  }

  const submission = await AdmissionSubmission.create({
    name: String(name).trim(),
    fatherName: String(fatherName).trim(),
    mobileNumber: String(mobileNumber).trim(),
    email: String(email).trim().toLowerCase(),
    aadhaarEncrypted: encryptValue(String(aadhaarNumber).trim()),
    marksPercentage: String(marksPercentage).trim(),
    selectedSubjects: Array.isArray(selectedSubjects) ? selectedSubjects : [],
    address: String(address).trim()
  });

  res.status(201).json({
    message: 'Admission form submitted successfully.',
    submission
  });
};

export const submitInquiry = async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  const inquiry = await Inquiry.create({
    name: String(name).trim(),
    email: String(email).trim(),
    phone: String(phone || '').trim(),
    message: String(message).trim()
  });

  res.status(201).json({
    message: 'Inquiry submitted successfully.',
    inquiry
  });
};
