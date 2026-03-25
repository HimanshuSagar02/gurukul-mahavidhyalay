import { AdmissionSubmission } from '../models/AdmissionSubmission.js';
import { Course } from '../models/Course.js';
import { GalleryItem } from '../models/GalleryItem.js';
import { Inquiry } from '../models/Inquiry.js';
import { Notification } from '../models/Notification.js';
import { PopupAd } from '../models/PopupAd.js';
import { SiteContent } from '../models/SiteContent.js';
import { encryptValue } from '../utils/crypto.js';

const getSiteContent = () => SiteContent.findOne({ singletonKey: 'site-content' });

export const getSiteDetails = async (req, res) => {
  const site = await getSiteContent();
  res.json({ site });
};

export const getPublicHome = async (req, res) => {
  const [site, courses, notifications, gallery, popup] = await Promise.all([
    getSiteContent(),
    Course.find().sort({ createdAt: 1 }),
    Notification.find().sort({ publishedAt: -1 }).limit(4),
    GalleryItem.find().sort({ displayOrder: 1, createdAt: -1 }).limit(6),
    PopupAd.findOne({ isActive: true }).sort({ updatedAt: -1 })
  ]);

  res.json({
    site,
    courses,
    notifications,
    gallery,
    popup
  });
};

export const getAboutPage = async (req, res) => {
  const site = await getSiteContent();
  res.json({ site });
};

export const getCoursesPage = async (req, res) => {
  const courses = await Course.find().sort({ createdAt: 1 });
  res.json({ courses });
};

export const getNotificationsPage = async (req, res) => {
  const notifications = await Notification.find().sort({ publishedAt: -1 });
  res.json({ notifications });
};

export const getGalleryPage = async (req, res) => {
  const gallery = await GalleryItem.find().sort({ displayOrder: 1, createdAt: -1 });
  res.json({ gallery });
};

export const getContactPage = async (req, res) => {
  const site = await getSiteContent();
  res.json({ contact: site.contact, site });
};

export const getPopupAd = async (req, res) => {
  const popup = await PopupAd.findOne({ isActive: true }).sort({ updatedAt: -1 });
  res.json({ popup });
};

export const submitAdmission = async (req, res) => {
  const { name, fatherName, mobileNumber, aadhaarNumber, marksPercentage, selectedSubjects, address } = req.body;

  if (!name || !fatherName || !mobileNumber || !aadhaarNumber || !marksPercentage || !address) {
    return res.status(400).json({ message: 'All required admission fields must be completed.' });
  }

  if (!/^\d{10}$/.test(String(mobileNumber))) {
    return res.status(400).json({ message: 'Mobile number must contain 10 digits.' });
  }

  if (!/^\d{12}$/.test(String(aadhaarNumber))) {
    return res.status(400).json({ message: 'Aadhaar number must contain 12 digits.' });
  }

  const submission = await AdmissionSubmission.create({
    name: String(name).trim(),
    fatherName: String(fatherName).trim(),
    mobileNumber: String(mobileNumber).trim(),
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
