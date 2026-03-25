import { Course } from '../models/Course.js';
import { SiteContent } from '../models/SiteContent.js';

const previousDefaultSiteContent = {
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
    inquiryHeadline: 'Admission and General Inquiry',
    inquiryText: 'Use this form for admission support, course details, and general college communication.'
  }
};

const defaultSiteContent = {
  singletonKey: 'site-content',
  collegeName: 'Gurukul Mahavidyalay',
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
    secondaryCtaLabel: 'View Courses',
    slides: [
      {
        title: 'A welcoming place to learn',
        subtitle: 'A calm and supportive environment for every student.',
        image: '/placeholders/hero-1.svg'
      },
      {
        title: 'Simple admission guidance',
        subtitle: 'Important details are easy to find when you need them.',
        image: '/placeholders/hero-2.svg'
      },
      {
        title: 'Campus life and achievements',
        subtitle: 'Explore key updates, notices, and memorable moments.',
        image: '/placeholders/hero-3.svg'
      }
    ]
  },
  branding: {
    websiteLogoUrl: '/logo-mark.svg',
    websiteLogoPublicId: '',
    managementLogoUrl: '',
    managementLogoPublicId: '',
    managementLogoTitle: 'Management Logo'
  },
  socialLinks: {
    facebook: '',
    instagram: '',
    youtube: '',
    whatsapp: ''
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
      'Gurukul Mahavidyalay supports students in and around Khusalpur with a B.A. course built on learning, values, and confidence.',
    mission: 'To guide students toward strong values, clear thinking, and meaningful growth.',
    vision: 'To be a trusted college known for learning, discipline, and opportunity.',
    principalName: 'Principal',
    principalDesignation: 'Principal',
    principalMessage:
      'We believe every student deserves guidance, respect, and the confidence to move forward in life with purpose.',
    principalImage: '/placeholders/principal-placeholder.svg'
  },
  contact: {
    address: 'Gurukul Mahavidyalay, Khusalpur, District Rampur, Teh. Swar',
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

  const topLevelFields = ['announcementTicker'];
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

  const contactFields = ['inquiryHeadline', 'inquiryText'];
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
