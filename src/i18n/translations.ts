export interface TranslationSchema {
  nav: {
    home: string;
    ourStory: string;
    products: string;
    whyArema: string;
    certificates: string;
    blog: string;
    contact: string;
    menu: string;
    close: string;
    getInTouch: string;
  };
  hero: {
    scrubText1: string;
    scrubText2: string;
    scrubText3: string;
    scrollCue: string;
  };
  founder: {
    eyebrow: string;
    heading: string;
    description: string;
    conceptDescription: string;
  };
  globalReach: {
    eyebrow: string;
    heading: string;
    body: string;
    cta: string;
    countries: string;
    certified: string;
    direct: string;
    packaging: string;
  };
  whyArema: {
    eyebrow: string;
    heading: string;
    pillars: { title: string; desc: string }[];
  };
  products: {
    eyebrow: string;
    heading: string;
    body: string;
    viewDetails: string;
    viewMore: string;
  };
  palakkad: {
    eyebrow: string;
    heading: string;
    advantages: { title: string; desc: string }[];
  };
  blog: {
    eyebrow: string;
    heading: string;
    viewAll: string;
    readMore: string;
  };
  cta: {
    heading: string;
    btnPrimary: string;
    btnSecondary: string;
  };
  footer: {
    tagline: string;
    navigate: string;
    products: string;
    contact: string;
    mattaRice: string;
    whiteRice: string;
    aromaticRice: string;
    valueAdded: string;
    rights: string;
    privacy: string;
    terms: string;
  };
  ourStoryPage: {
    heroLabel: string;
    heroHeadline: string;
    heroHeadlineEm: string;
    heroDesc: string;
    heroScroll: string;
    aboutUs: string;
    statementLead: string;
    statementLeadEm: string;
    statementText1: string;
    statementText2: string;
    badgeGI: string;
    badgeFSSAI: string;
    badgeAPEDA: string;
    badgeTraceable: string;
    founderEyebrow: string;
    founderHeading: string;
    founderHeadingEm: string;
    founderTitle: string;
    founderDegree: string;
    founderPara1: string;
    founderPara2: string;
    founderPara3: string;
    founderQuote: string;
    founderBadgeFounded: string;
    founderBadgeCertified: string;
    founderBadgeAPEDA: string;
    stripCap1: string;
    stripCap2: string;
    stripCap3: string;
    visionMissionTitle: string;
    visionMissionTitleEm: string;
    visionMissionNote: string;
    visionTitle: string;
    visionHeading: string;
    visionBody: string;
    missionTitle: string;
    missionHeading: string;
    missionBody: string;
    missionHighlight: string;
    fieldQuote: string;
    fieldQuoteAttr: string;
    beliefsTitle: string;
    beliefsHeading: string;
    beliefsHeadingEm: string;
    beliefs: { title: string; body: string }[];
    stat1Label: string;
    stat1Desc: string;
    stat2Label: string;
    stat2Desc: string;
    stat3Label: string;
    stat3Desc: string;
    stat4Label: string;
    stat4Desc: string;
    reachLabel: string;
    reachTitle: string;
    reachTitleEm: string;
    reachBody: string;
    route1Code: string;
    route1Region: string;
    route1Ports: string;
    route2Code: string;
    route2Region: string;
    route2Ports: string;
    route3Code: string;
    route3Region: string;
    route3Ports: string;
    routeStatus: string;
    closingQuote: string;
    closingAttr: string;
    closingCta: string;
  };
  whyAremaPage: {
    heroLabel: string;
    heroTitle: string;
    heroTitleEm: string;
    heroDesc: string;
    valuesLabel: string;
    valuesHeading: string;
    valuesHeadingEm: string;
    pillars: { title: string; body?: string; desc?: string }[];
    featureTitle: string;
    featureTitleEm: string;
    featureBody: string;
    featureList: string[];
  };
  productsPage: {
    heroLabel: string;
    heroTitle: string;
    heroSubtitle: string;
    viewSpecs: string;
  };
  productDetail: {
    keyChars: string;
    specTitle: string;
    wholesaleTitle: string;
    wholesaleDesc: string;
    btnEnquiry: string;
    exploreOther: string;
    allProducts: string;
    scrollDiscover: string;
  };
  contactPage: {
    heroLabel: string;
    heroTitle: string;
    heroTitleEm: string;
    heroDesc: string;
    address: string;
    contact: string;
    exportInq: string;
    hoursTitle: string;
    hoursDays: string;
    hoursTime: string;
    successTitle: string;
    successBody: string;
    formName: string;
    formCompany: string;
    formEmail: string;
    formPhone: string;
    formInquiryType: string;
    formInquiryWholesale: string;
    formInquiryPartner: string;
    formInquiryLabel: string;
    formInquiryRetail: string;
    formInquiryMedia: string;
    formInquiryOther: string;
    formMessage: string;
    formMessagePlaceholder: string;
    formSubmit: string;
  };
  certsPage: {
    eyebrow: string;
    heading: string;
    headingEm: string;
    desc: string;
    viewDoc: string;
    docName: string;
  };
  blogPage: {
    eyebrow: string;
    title: string;
    titleEm: string;
    articlesCount: string;
    filter: string;
    featuredLabel: string;
    readArticle: string;
    moreStories: string;
    newsletterEyebrow: string;
    newsletterTitle: string;
    newsletterBody: string;
    newsletterPlaceholder: string;
    newsletterSubmit: string;
    privacyNote: string;
    backToBlog: string;
  };
  productsData: Record<string, {
    name: string;
    category: string;
    tagline: string;
    description: string;
    highlights: string[];
    specs: { label: string; value: string }[];
  }>;
  blogData: Record<string, {
    category: string;
    readTime: string;
    date: string;
    title: string;
    excerpt: string;
    body: string[];
  }>;
  seo?: {
    home: { title: string; description: string; keywords: string };
    ourStory: { title: string; description: string; keywords: string };
    whyArema: { title: string; description: string; keywords: string };
    certificates: { title: string; description: string; keywords: string };
    blog: { title: string; description: string; keywords: string };
    contact: { title: string; description: string; keywords: string };
    products: { title: string; description: string; keywords: string };
  };
}

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪', dir: 'rtl' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', dir: 'ltr' },
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹', dir: 'ltr' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱', dir: 'ltr' },
  { code: 'ja', name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  { code: 'ko', name: '한국어', flag: '🇰🇷', dir: 'ltr' },
  { code: 'zh', name: '中文', flag: '🇨🇳', dir: 'ltr' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', dir: 'ltr' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳', dir: 'ltr' },
  { code: 'es', name: 'Español', flag: '🇪🇸', dir: 'ltr' },
] as const;

export type LanguageCode = typeof LANGUAGES[number]['code'];

// Load translations from external chunks or direct configurations to maintain clean structure.
// Due to size and exact matching requirement, let's export the translations dictionary directly.
// This contains carefully selected translation strings.
import { en } from './locales/en';
import { ar } from './locales/ar';
import { de } from './locales/de';
import { fr } from './locales/fr';
import { it } from './locales/it';
import { nl } from './locales/nl';
import { ja } from './locales/ja';
import { ko } from './locales/ko';
import { zh } from './locales/zh';
import { ru } from './locales/ru';
import { hi } from './locales/hi';
import { ta } from './locales/ta';
import { es } from './locales/es';

export const translations: Record<LanguageCode, TranslationSchema> = {
  en, ar, de, fr, it, nl, ja, ko, zh, ru, hi, ta, es
};
