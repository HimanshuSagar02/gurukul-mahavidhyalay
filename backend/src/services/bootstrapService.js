import { Course } from '../models/Course.js';
import { SiteContent } from '../models/SiteContent.js';

const previousDefaultSiteContent = {
  collegeName: 'Gurukul Mahavidyalay',
  announcementTicker:
    'Admissions, notices, and public updates can be managed from the hidden admin panel after initial setup.',
  hero: {
    headline: 'Academic discipline, community trust, and accessible undergraduate learning.',
    subheadline:
      'A grounded college website for admissions, notices, gallery updates, and day-to-day institutional communication.',
    bannerNote: 'Affiliated to Guru Jambheshwar University',
    slides: [
      {
        title: 'Institutional learning environment',
        subtitle: 'A restrained, traditional layout inspired by established college websites.'
      },
      {
        title: 'Admissions and student communication',
        subtitle: 'Important notices and admission details remain immediately visible.'
      },
      {
        title: 'Simple public information flow',
        subtitle: 'Core content stays editable from a secure admin panel.'
      }
    ]
  },
  motivation: {
    text: 'Add a motivating message from the admin panel to inspire students and visitors.'
  },
  about: {
    introduction:
      'Gurukul Mahavidyalay serves students in and around Khusalpur with a focused B.A. programme designed around accessible higher education and disciplined academic practice.',
    mission:
      'To provide value-based undergraduate education with attention to language, society, creativity, and practical life-oriented learning.',
    vision:
      'To become a dependable regional college recognised for academic sincerity, inclusive opportunity, and responsible student development.',
    principalMessage:
      'The college aims to create a disciplined, supportive, and academically sincere environment where students can progress with confidence, dignity, and social awareness.'
  },
  contact: {
    address: 'Gurukul Mahavidyalay, Khusalpur, District Rampur, Teh. Swar',
    inquiryHeadline: 'Admission and General Inquiry',
    inquiryText: 'Use this form for admission support, course details, and general college communication.'
  }
};

const defaultSiteContent = {
  singletonKey: 'site-content',
  collegeName: 'Gurukul Mahavidhyalya',
  location: 'Khusalpur, District Rampur, Teh. Swar',
  affiliation: 'Guru Jambheshwar University',
  announcementTicker:
    'Admissions are open. Explore courses, important updates, campus moments, and contact details in one place.',
  headerLinks: [
    { label: 'Admissions', path: '/admissions' },
    { label: 'Notifications', path: '/notifications' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Contact', path: '/contact' }
  ],
  hero: {
    headline: 'A trusted place for learning, values, and bright futures.',
    subheadline: 'Helping students grow with confidence, knowledge, and strong community support.',
    bannerNote: 'Affiliated with Guru Jambheshwar University',
    primaryCtaLabel: 'Apply Now',
    secondaryCtaLabel: 'Admissions Open',
    tertiaryCtaLabel: 'Contact Us',
    slides: [
      {
        title: 'A welcoming place to learn',
        subtitle: 'A calm and supportive environment for every student.',
        image: '/placeholders/hero-1.svg',
        imagePublicId: ''
      },
      {
        title: 'Simple admission guidance',
        subtitle: 'Important details are easy to find when you need them.',
        image: '/placeholders/hero-2.svg',
        imagePublicId: ''
      },
      {
        title: 'Campus life and achievements',
        subtitle: 'Explore key updates, notices, and memorable moments.',
        image: '/placeholders/hero-3.svg',
        imagePublicId: ''
      }
    ]
  },
  branding: {
    websiteLogoUrl: '/logo-mark.svg',
    websiteLogoPublicId: ''
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    whatsapp: ''
  },
  homepage: {
    facilities: [
      {
        title: 'Library',
        badge: 'LB',
        description:
          'Quiet reading support with reference material, guided study time, and subject access for undergraduate learning.'
      },
      {
        title: 'Labs',
        badge: 'LM',
        description:
          'Practical learning spaces that support subject work, demonstrations, and everyday academic preparation.'
      },
      {
        title: 'Hostel Support',
        badge: 'HS',
        description:
          'Student support services focused on comfort, discipline, and a dependable study environment when needed.'
      },
      {
        title: 'Sports',
        badge: 'SP',
        description:
          'Physical activity, recreation, and participation-focused campus culture to support confidence and wellbeing.'
      }
    ],
    admissionSteps: [
      {
        title: 'Submit Application',
        description: 'Complete the admission form with personal details, marks, subjects, and contact information.'
      },
      {
        title: 'Document Review',
        description: 'The college team reviews eligibility, submitted records, and the selected academic combination.'
      },
      {
        title: 'Confirmation',
        description: 'Applicants receive guidance for the next step, including verification, contact, and admission communication.'
      },
      {
        title: 'Start the Session',
        description: 'Once confirmed, students can follow notices, academic updates, and the beginning of the programme cycle.'
      }
    ],
    testimonials: [
      {
        name: 'Student Voice',
        role: 'Undergraduate Student',
        quote: 'The admission process is simple to follow and the college communication remains clear and dependable.'
      },
      {
        name: 'Parent Feedback',
        role: 'College Community',
        quote: 'Important updates, academic guidance, and contact details are easy to understand and access.'
      },
      {
        name: 'Alumni Perspective',
        role: 'Graduate',
        quote: 'A disciplined environment and consistent guidance help students move forward with confidence.'
      }
    ]
  },
  motivation: {
    enabled: false,
    title: 'Student Motivation',
    text: 'Believe in your potential. Every step you take today shapes a brighter tomorrow.',
    imageUrl: '',
    imagePublicId: ''
  },
  about: {
    introduction:
      'Gurukul Mahavidhyalya supports students in and around Khusalpur with a B.A. course built on learning, values, and confidence.',
    mission: 'To guide students toward strong values, clear thinking, and meaningful growth.',
    vision: 'To be a trusted college known for learning, discipline, and opportunity.',
    principalName: 'Principal',
    principalDesignation: 'Principal',
    principalMessage:
      'We believe every student deserves guidance, respect, and the confidence to move forward in life with purpose.',
    principalImage: '/placeholders/principal-placeholder.svg',
    principalImagePublicId: '',
    ceoName: 'Chief Executive Officer',
    ceoDesignation: 'CEO',
    ceoMessage:
      'Add a dedicated CEO message from the admin panel to highlight leadership, vision, and institutional direction.',
    ceoImage: '',
    ceoImagePublicId: '',
    managementProfiles: []
  },
  contact: {
    address: 'Gurukul Mahavidhyalya, Khusalpur, District Rampur, Teh. Swar',
    phone: '',
    email: '',
    mapEmbedUrl: '',
    inquiryHeadline: 'Send Us a Message',
    inquiryText: 'Share your question and our team will be happy to help.'
  },
  footer: {
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'About', path: '/about' },
      { label: 'Courses', path: '/courses' },
      { label: 'New Admission', path: '/admissions' }
    ],
    exploreLinks: [
      { label: 'Notifications', path: '/notifications' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Contact', path: '/contact' },
      { label: 'Apply Now', path: '/admissions' }
    ]
  }
};

const previousDefaultCourse = {
  overview:
    'A broad undergraduate programme designed to strengthen language skills, social understanding, creative awareness, and foundational humanities learning.'
};

const defaultCourses = [
  {
    title: 'Bachelor of Arts (B.A.)',
    slug: 'ba',
    overview: 'A well-rounded B.A. course that builds language skills, confidence, creativity, and social understanding.',
    duration: '3 Years',
    eligibility: '10+2 or equivalent from a recognised board.',
    subjects: ['English', 'Hindi', 'Drawing', 'Home Science', 'Sociology']
  }
];

const useFreshCopy = (currentValue, oldValue, newValue) => {
  if (currentValue === undefined || currentValue === null || currentValue === '') {
    return newValue;
  }

  if (currentValue === oldValue) {
    return newValue;
  }

  return currentValue;
};

const updateExistingSiteCopy = async (siteContent) => {
  let changed = false;

  const topLevelFields = ['collegeName', 'announcementTicker'];
  for (const field of topLevelFields) {
    const nextValue = useFreshCopy(siteContent[field], previousDefaultSiteContent[field], defaultSiteContent[field]);
    if (nextValue !== siteContent[field]) {
      siteContent[field] = nextValue;
      changed = true;
    }
  }

  const heroFields = ['headline', 'subheadline', 'bannerNote'];
  for (const field of heroFields) {
    const nextValue = useFreshCopy(
      siteContent.hero?.[field],
      previousDefaultSiteContent.hero[field],
      defaultSiteContent.hero[field]
    );
    if (nextValue !== siteContent.hero?.[field]) {
      siteContent.hero[field] = nextValue;
      changed = true;
    }
  }

  const heroPresenceFields = ['primaryCtaLabel', 'secondaryCtaLabel', 'tertiaryCtaLabel'];
  for (const field of heroPresenceFields) {
    const nextValue = useFreshCopy(siteContent.hero?.[field], field === 'secondaryCtaLabel' ? 'View Courses' : '', defaultSiteContent.hero[field]);
    if (nextValue !== siteContent.hero?.[field]) {
      siteContent.hero[field] = nextValue;
      changed = true;
    }
  }

  defaultSiteContent.hero.slides.forEach((slide, index) => {
    const currentSlide = siteContent.hero?.slides?.[index];
    const previousSlide = previousDefaultSiteContent.hero.slides[index];

    if (!currentSlide) {
      siteContent.hero.slides.push(slide);
      changed = true;
      return;
    }

    ['title', 'subtitle'].forEach((field) => {
      const nextValue = useFreshCopy(currentSlide[field], previousSlide[field], slide[field]);
      if (nextValue !== currentSlide[field]) {
        currentSlide[field] = nextValue;
        changed = true;
      }
    });

    if (!currentSlide.image) {
      currentSlide.image = slide.image;
      changed = true;
    }

    if (currentSlide.imagePublicId === undefined) {
      currentSlide.imagePublicId = '';
      changed = true;
    }
  });

  const aboutFields = ['introduction', 'mission', 'vision', 'principalMessage'];
  for (const field of aboutFields) {
    const nextValue = useFreshCopy(
      siteContent.about?.[field],
      previousDefaultSiteContent.about[field],
      defaultSiteContent.about[field]
    );
    if (nextValue !== siteContent.about?.[field]) {
      siteContent.about[field] = nextValue;
      changed = true;
    }
  }

  const principalFields = ['principalName', 'principalDesignation'];
  for (const field of principalFields) {
    if (!siteContent.about?.[field]) {
      siteContent.about[field] = defaultSiteContent.about[field];
      changed = true;
    }
  }

  const aboutPresenceFields = [
    'principalImage',
    'principalImagePublicId',
    'ceoName',
    'ceoDesignation',
    'ceoMessage',
    'ceoImage',
    'ceoImagePublicId'
  ];
  for (const field of aboutPresenceFields) {
    if (siteContent.about?.[field] === undefined) {
      siteContent.about[field] = defaultSiteContent.about[field];
      changed = true;
    }
  }

  if (!Array.isArray(siteContent.about?.managementProfiles)) {
    siteContent.about.managementProfiles = [];
    changed = true;
  } else {
    siteContent.about.managementProfiles = siteContent.about.managementProfiles.map((profile, index) => {
      const nextProfile = {
        ...profile.toObject?.(),
        ...profile,
        work: profile.work ?? profile.designation ?? '',
        experience: profile.experience ?? profile.message ?? '',
        displayOrder: Number.isFinite(Number(profile.displayOrder)) ? Number(profile.displayOrder) : index
      };

      if (nextProfile.work !== profile.work || nextProfile.experience !== profile.experience) {
        changed = true;
      }

      return nextProfile;
    });
  }

  const contactFields = ['address', 'inquiryHeadline', 'inquiryText'];
  for (const field of contactFields) {
    const nextValue = useFreshCopy(
      siteContent.contact?.[field],
      previousDefaultSiteContent.contact[field],
      defaultSiteContent.contact[field]
    );
    if (nextValue !== siteContent.contact?.[field]) {
      siteContent.contact[field] = nextValue;
      changed = true;
    }
  }

  if (!siteContent.branding) {
    siteContent.branding = defaultSiteContent.branding;
    changed = true;
  }

  if (!siteContent.socialLinks) {
    siteContent.socialLinks = defaultSiteContent.socialLinks;
    changed = true;
  }

  if (!siteContent.homepage) {
    siteContent.homepage = defaultSiteContent.homepage;
    changed = true;
  } else {
    if (!Array.isArray(siteContent.homepage.facilities)) {
      siteContent.homepage.facilities = defaultSiteContent.homepage.facilities;
      changed = true;
    }

    if (!Array.isArray(siteContent.homepage.admissionSteps)) {
      siteContent.homepage.admissionSteps = defaultSiteContent.homepage.admissionSteps;
      changed = true;
    }

    if (!Array.isArray(siteContent.homepage.testimonials)) {
      siteContent.homepage.testimonials = defaultSiteContent.homepage.testimonials;
      changed = true;
    }
  }

  if (!siteContent.motivation) {
    siteContent.motivation = defaultSiteContent.motivation;
    changed = true;
  } else {
    if (!siteContent.motivation.title) {
      siteContent.motivation.title = defaultSiteContent.motivation.title;
      changed = true;
    }

    const nextMotivationText = useFreshCopy(
      siteContent.motivation.text,
      previousDefaultSiteContent.motivation.text,
      defaultSiteContent.motivation.text
    );
    if (nextMotivationText !== siteContent.motivation.text) {
      siteContent.motivation.text = nextMotivationText;
      changed = true;
    }
  }

  if (changed) {
    await siteContent.save();
  }
};

const updateExistingCourseCopy = async () => {
  const baCourse = await Course.findOne({ slug: 'ba' });

  if (!baCourse) {
    return;
  }

  let changed = false;

  const nextOverview = useFreshCopy(baCourse.overview, previousDefaultCourse.overview, defaultCourses[0].overview);
  if (nextOverview !== baCourse.overview) {
    baCourse.overview = nextOverview;
    changed = true;
  }

  if (changed) {
    await baCourse.save();
  }
};

export const bootstrapSiteData = async () => {
  const siteContent = await SiteContent.findOne({ singletonKey: 'site-content' });
  if (!siteContent) {
    await SiteContent.create(defaultSiteContent);
  } else {
    await updateExistingSiteCopy(siteContent);
  }

  const courseCount = await Course.countDocuments();
  if (courseCount === 0) {
    await Course.insertMany(defaultCourses);
  } else {
    await updateExistingCourseCopy();
  }
};
