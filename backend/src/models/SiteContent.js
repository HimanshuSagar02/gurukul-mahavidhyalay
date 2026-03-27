import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, required: true },
    path: { type: String, trim: true, required: true }
  },
  { _id: false }
);

const heroSlideSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, required: true },
    subtitle: { type: String, trim: true, default: '' },
    image: { type: String, trim: true, required: true },
    imagePublicId: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const leadershipProfileSchema = new mongoose.Schema(
  {
    id: { type: String, trim: true, required: true },
    name: { type: String, trim: true, default: '' },
    work: { type: String, trim: true, default: '' },
    experience: { type: String, trim: true, default: '' },
    imageUrl: { type: String, trim: true, default: '' },
    imagePublicId: { type: String, trim: true, default: '' },
    displayOrder: { type: Number, default: 0 }
  },
  { _id: false }
);

const featureItemSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    badge: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const metricItemSchema = new mongoose.Schema(
  {
    value: { type: String, trim: true, default: '' },
    label: { type: String, trim: true, default: '' },
    detail: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: '' },
    role: { type: String, trim: true, default: '' },
    quote: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const socialLinksSchema = new mongoose.Schema(
  {
    facebook: { type: String, trim: true, default: '' },
    instagram: { type: String, trim: true, default: '' },
    youtube: { type: String, trim: true, default: '' },
    whatsapp: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const siteContentSchema = new mongoose.Schema(
  {
    singletonKey: {
      type: String,
      unique: true,
      default: 'site-content'
    },
    collegeName: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    affiliation: {
      type: String,
      required: true,
      trim: true
    },
    announcementTicker: {
      type: String,
      trim: true,
      default: ''
    },
    headerLinks: {
      type: [linkSchema],
      default: []
    },
    hero: {
      headline: { type: String, trim: true, required: true },
      subheadline: { type: String, trim: true, default: '' },
      bannerNote: { type: String, trim: true, default: '' },
      primaryCtaLabel: { type: String, trim: true, default: 'Apply Now' },
      secondaryCtaLabel: { type: String, trim: true, default: 'Admissions Open' },
      tertiaryCtaLabel: { type: String, trim: true, default: 'Contact Us' },
      slides: {
        type: [heroSlideSchema],
        default: []
      }
    },
    branding: {
      websiteLogoUrl: { type: String, trim: true, default: '/logo-mark.svg' },
      websiteLogoPublicId: { type: String, trim: true, default: '' }
    },
    socialLinks: {
      type: socialLinksSchema,
      default: () => ({})
    },
    homepage: {
      highlights: {
        type: [metricItemSchema],
        default: []
      },
      facilities: {
        type: [featureItemSchema],
        default: []
      },
      admissionSteps: {
        type: [featureItemSchema],
        default: []
      },
      testimonials: {
        type: [testimonialSchema],
        default: []
      }
    },
    motivation: {
      enabled: { type: Boolean, default: false },
      title: { type: String, trim: true, default: 'Student Motivation' },
      text: {
        type: String,
        trim: true,
        default: 'Add a motivating message from the admin panel to inspire students and visitors.'
      },
      imageUrl: { type: String, trim: true, default: '' },
      imagePublicId: { type: String, trim: true, default: '' }
    },
    about: {
      introduction: { type: String, trim: true, default: '' },
      mission: { type: String, trim: true, default: '' },
      vision: { type: String, trim: true, default: '' },
      principalName: { type: String, trim: true, default: '' },
      principalDesignation: { type: String, trim: true, default: '' },
      principalMessage: { type: String, trim: true, default: '' },
      principalImage: { type: String, trim: true, default: '/placeholders/principal-placeholder.svg' },
      principalImagePublicId: { type: String, trim: true, default: '' },
      ceoName: { type: String, trim: true, default: '' },
      ceoDesignation: { type: String, trim: true, default: '' },
      ceoMessage: { type: String, trim: true, default: '' },
      ceoImage: { type: String, trim: true, default: '' },
      ceoImagePublicId: { type: String, trim: true, default: '' },
      managementProfiles: {
        type: [leadershipProfileSchema],
        default: []
      }
    },
    contact: {
      address: { type: String, trim: true, default: '' },
      phone: { type: String, trim: true, default: '' },
      email: { type: String, trim: true, default: '' },
      mapEmbedUrl: { type: String, trim: true, default: '' },
      inquiryHeadline: { type: String, trim: true, default: 'Send an Inquiry' },
      inquiryText: {
        type: String,
        trim: true,
        default: 'Use the contact form for admission assistance, subject queries, and institutional communication.'
      }
    },
    footer: {
      quickLinks: {
        type: [linkSchema],
        default: []
      },
      exploreLinks: {
        type: [linkSchema],
        default: []
      }
    }
  },
  { timestamps: true }
);

export const SiteContent = mongoose.model('SiteContent', siteContentSchema);
