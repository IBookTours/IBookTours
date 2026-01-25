// ============================================
// ITRAVEL - Legal Pages Data (CMS Ready)
// ============================================
// This file contains all legal content with i18n support.
// Replace with Sanity fetches when CMS is connected:
// const privacyPage = await sanityClient.fetch<LegalPage>(privacyQuery);

import type { ProductType, LocalizedString, LocalizedText, Locale } from '@/types/cms';

// ============================================
// INTERFACES
// ============================================

export interface LegalSection {
  id: string;
  title: string;
  content: string[];
  collapsible?: boolean;
}

export interface LegalPageContent {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

// CMS-Ready interfaces with i18n support
export interface CMSLegalSection {
  id: string;
  title: LocalizedString;
  content: LocalizedText;
  collapsible?: boolean;
}

export interface CMSLegalPage {
  _id: string;
  _type: 'legalPage';
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  lastUpdated: string;
  sections: CMSLegalSection[];
}

// ============================================
// CANCELLATION POLICIES (Product-Specific)
// ============================================

export interface CancellationTier {
  daysRange: { min: number; max: number | null }; // null = no upper limit
  refundPercent: number;
  label: LocalizedString;
}

export interface ProductCancellationPolicy {
  _id: string;
  _type: 'cancellationPolicy';
  productType: ProductType;
  name: LocalizedString;
  policyCode: 'flexible' | 'standard' | 'strict' | 'custom';
  description: LocalizedString;
  tiers: CancellationTier[];
  notes: LocalizedString;
}

// Product-specific cancellation policies for a small travel agency
export const cancellationPolicies: ProductCancellationPolicy[] = [
  {
    _id: 'policy-vacation-package',
    _type: 'cancellationPolicy',
    productType: 'vacation-package',
    name: {
      en: 'Flexible Policy',
      he: 'מדיניות גמישה',
    },
    policyCode: 'flexible',
    description: {
      en: 'Our vacation packages include flights and hotels, so we offer generous cancellation windows to give you peace of mind when booking.',
      he: 'חבילות הנופש שלנו כוללות טיסות ומלונות, לכן אנו מציעים חלונות ביטול נדיבים כדי לתת לכם שקט נפשי בעת ההזמנה.',
    },
    tiers: [
      {
        daysRange: { min: 14, max: null },
        refundPercent: 100,
        label: {
          en: '14+ days before departure',
          he: '14+ ימים לפני היציאה',
        },
      },
      {
        daysRange: { min: 7, max: 13 },
        refundPercent: 50,
        label: {
          en: '7-13 days before departure',
          he: '7-13 ימים לפני היציאה',
        },
      },
      {
        daysRange: { min: 0, max: 6 },
        refundPercent: 0,
        label: {
          en: 'Less than 7 days before departure',
          he: 'פחות מ-7 ימים לפני היציאה',
        },
      },
    ],
    notes: {
      en: 'Flight tickets may have separate airline cancellation policies. Non-refundable deposits, if any, will be deducted from refunds.',
      he: 'כרטיסי טיסה עשויים להיות כפופים למדיניות ביטול נפרדת של חברת התעופה. פיקדונות שאינם ניתנים להחזר, אם ישנם, ינוכו מההחזרים.',
    },
  },
  {
    _id: 'policy-day-tour',
    _type: 'cancellationPolicy',
    productType: 'day-tour',
    name: {
      en: 'Standard Policy',
      he: 'מדיניות רגילה',
    },
    policyCode: 'standard',
    description: {
      en: 'Day tours are easier to reschedule, so we offer shorter but fair cancellation windows.',
      he: 'טיולי יום קל יותר לתזמן מחדש, לכן אנו מציעים חלונות ביטול קצרים יותר אך הוגנים.',
    },
    tiers: [
      {
        daysRange: { min: 2, max: null },
        refundPercent: 100,
        label: {
          en: '48+ hours before tour',
          he: '48+ שעות לפני הטיול',
        },
      },
      {
        daysRange: { min: 1, max: 1 },
        refundPercent: 50,
        label: {
          en: '24-48 hours before tour',
          he: '24-48 שעות לפני הטיול',
        },
      },
      {
        daysRange: { min: 0, max: 0 },
        refundPercent: 0,
        label: {
          en: 'Less than 24 hours before tour',
          he: 'פחות מ-24 שעות לפני הטיול',
        },
      },
    ],
    notes: {
      en: 'If minimum group size is not met, we will offer a full refund or alternative date. Weather cancellations by us are fully refundable.',
      he: 'אם גודל הקבוצה המינימלי לא מתקיים, נציע החזר מלא או תאריך חלופי. ביטולים בגלל מזג אוויר על ידנו זכאים להחזר מלא.',
    },
  },
  {
    _id: 'policy-event-ticket',
    _type: 'cancellationPolicy',
    productType: 'event-ticket',
    name: {
      en: 'Strict Policy',
      he: 'מדיניות קפדנית',
    },
    policyCode: 'strict',
    description: {
      en: 'Event tickets are often limited and non-transferable. We have a stricter policy to ensure fair access for all customers.',
      he: 'כרטיסים לאירועים לרוב מוגבלים ואינם ניתנים להעברה. יש לנו מדיניות קפדנית יותר כדי להבטיח גישה הוגנת לכל הלקוחות.',
    },
    tiers: [
      {
        daysRange: { min: 7, max: null },
        refundPercent: 100,
        label: {
          en: '7+ days before event',
          he: '7+ ימים לפני האירוע',
        },
      },
      {
        daysRange: { min: 0, max: 6 },
        refundPercent: 0,
        label: {
          en: 'Less than 7 days before event',
          he: 'פחות מ-7 ימים לפני האירוע',
        },
      },
    ],
    notes: {
      en: 'Event cancellations by organizers will be fully refunded. Tickets may be transferable to another person with advance notice.',
      he: 'ביטולי אירועים על ידי המארגנים יוחזרו במלואם. ניתן להעביר כרטיסים לאדם אחר בהודעה מראש.',
    },
  },
  {
    _id: 'policy-private-tour',
    _type: 'cancellationPolicy',
    productType: 'private-tour',
    name: {
      en: 'Custom Policy',
      he: 'מדיניות מותאמת',
    },
    policyCode: 'custom',
    description: {
      en: 'Private tours require significant planning and resource allocation. Our tiered refund structure reflects this investment.',
      he: 'טיולים פרטיים דורשים תכנון משמעותי והקצאת משאבים. מבנה ההחזרים המדורג שלנו משקף השקעה זו.',
    },
    tiers: [
      {
        daysRange: { min: 30, max: null },
        refundPercent: 100,
        label: {
          en: '30+ days before tour',
          he: '30+ ימים לפני הטיול',
        },
      },
      {
        daysRange: { min: 14, max: 29 },
        refundPercent: 75,
        label: {
          en: '14-29 days before tour',
          he: '14-29 ימים לפני הטיול',
        },
      },
      {
        daysRange: { min: 7, max: 13 },
        refundPercent: 50,
        label: {
          en: '7-13 days before tour',
          he: '7-13 ימים לפני הטיול',
        },
      },
      {
        daysRange: { min: 0, max: 6 },
        refundPercent: 0,
        label: {
          en: 'Less than 7 days before tour',
          he: 'פחות מ-7 ימים לפני הטיול',
        },
      },
    ],
    notes: {
      en: 'Private tours can often be rescheduled instead of cancelled. Contact us to discuss options. Custom itinerary changes may incur fees.',
      he: 'לעתים קרובות ניתן לתזמן מחדש טיולים פרטיים במקום לבטל. צרו איתנו קשר לדיון באפשרויות. שינויים במסלול מותאם אישית עשויים לכלול עמלות.',
    },
  },
];

// Helper function to get policy by product type
export function getCancellationPolicy(
  productType: ProductType
): ProductCancellationPolicy | undefined {
  return cancellationPolicies.find((p) => p.productType === productType);
}

// Helper function to get refund percentage for a specific product and days before
export function getRefundPercent(productType: ProductType, daysBeforeStart: number): number {
  const policy = getCancellationPolicy(productType);
  if (!policy) return 0;

  for (const tier of policy.tiers) {
    const matchesMin = daysBeforeStart >= tier.daysRange.min;
    const matchesMax = tier.daysRange.max === null || daysBeforeStart <= tier.daysRange.max;
    if (matchesMin && matchesMax) {
      return tier.refundPercent;
    }
  }
  return 0;
}

// Helper function to get localized policy content
export function getLocalizedPolicy(
  productType: ProductType,
  locale: Locale
): {
  name: string;
  description: string;
  tiers: { label: string; refundPercent: number }[];
  notes: string;
} | null {
  const policy = getCancellationPolicy(productType);
  if (!policy) return null;

  return {
    name: policy.name[locale],
    description: policy.description[locale],
    tiers: policy.tiers.map((tier) => ({
      label: tier.label[locale],
      refundPercent: tier.refundPercent,
    })),
    notes: policy.notes[locale],
  };
}

// ============================================
// LEGACY FORMAT (for backward compatibility)
// ============================================
// These maintain the current component interface while being CMS-ready

export const privacyContent: LegalPageContent = {
  title: 'Privacy Policy',
  description: 'Learn how ITravel collects, uses, and protects your personal information.',
  lastUpdated: 'January 2026',
  sections: [
    {
      id: 'collection',
      title: 'Information We Collect',
      content: [
        'When you book a tour or create an account, we collect personal information including your name, email address, phone number, and payment details.',
        'We automatically collect certain information when you visit our website, including your IP address, browser type, device information, and pages visited.',
        'If you contact us, we keep records of our correspondence to improve our services.',
      ],
    },
    {
      id: 'usage',
      title: 'How We Use Your Information',
      content: [
        'We use your information to process bookings, manage your account, and provide customer support.',
        'We may send you marketing communications about our tours and offers. You can opt out at any time.',
        'We analyze usage patterns to improve our website and services.',
        'We may share your information with tour operators and partners to fulfill your booking.',
      ],
    },
    {
      id: 'protection',
      title: 'How We Protect Your Data',
      content: [
        'We use industry-standard encryption (SSL/TLS) to protect data transmission.',
        'Payment information is processed securely through Stripe and is never stored on our servers.',
        'We implement access controls to limit who can access your personal data.',
        'We regularly review and update our security practices.',
      ],
    },
    {
      id: 'rights',
      title: 'Your Rights',
      content: [
        'You have the right to access, correct, or delete your personal data.',
        'You can request a copy of all data we hold about you.',
        'You can withdraw consent for marketing communications at any time.',
        'You have the right to lodge a complaint with a data protection authority.',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies',
      content: [
        'We use cookies to enhance your browsing experience and analyze website traffic.',
        'You can manage cookie preferences through our cookie consent banner.',
        'For more details, please see our Cookie Policy.',
      ],
    },
    {
      id: 'contact',
      title: 'Contact Us',
      content: [
        'If you have questions about this Privacy Policy or your personal data, contact us at:',
        'Email: privacy@itravel.com',
        'Phone: +972 50-656-6211',
        'Address: Tirana, Albania',
      ],
    },
  ],
};

export const termsContent: LegalPageContent = {
  title: 'Terms of Service',
  description: 'Read the terms and conditions that govern your use of ITravel services.',
  lastUpdated: 'January 2026',
  sections: [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      content: [
        'By accessing or using ITravel services, you agree to be bound by these Terms of Service.',
        'If you do not agree with any part of these terms, you may not use our services.',
        'We may update these terms from time to time. Continued use constitutes acceptance of changes.',
      ],
    },
    {
      id: 'booking',
      title: 'Booking and Payment',
      content: [
        'All bookings are subject to availability and confirmation.',
        'Prices are displayed in EUR and include applicable taxes unless otherwise stated.',
        'Full payment is required at the time of booking unless otherwise specified.',
        'You are responsible for ensuring all booking details are accurate.',
      ],
    },
    {
      id: 'cancellation',
      title: 'Cancellation Policy',
      content: [
        'Cancellation policies vary by product type. Please review the specific policy for your booking.',
        'Vacation Packages: 14+ days = full refund, 7-13 days = 50%, <7 days = no refund.',
        'Day Tours: 48+ hours = full refund, 24-48 hours = 50%, <24 hours = no refund.',
        'Event Tickets: 7+ days = full refund, <7 days = no refund.',
        'Private Tours: 30+ days = full, 14-29 days = 75%, 7-13 days = 50%, <7 days = no refund.',
        'We reserve the right to cancel tours due to insufficient participants or force majeure.',
      ],
    },
    {
      id: 'responsibilities',
      title: 'Your Responsibilities',
      content: [
        'You must be at least 18 years old to make a booking.',
        'You are responsible for ensuring you have valid travel documents and insurance.',
        'You must follow tour guide instructions and local laws during tours.',
        'You are liable for any damage caused by your actions during tours.',
      ],
    },
    {
      id: 'liability',
      title: 'Limitation of Liability',
      content: [
        'ITravel acts as an intermediary between you and tour operators.',
        'We are not liable for actions or omissions of third-party service providers.',
        'Our liability is limited to the amount paid for the tour in question.',
        'We are not responsible for circumstances beyond our control (weather, political unrest, etc.).',
      ],
    },
    {
      id: 'disputes',
      title: 'Dispute Resolution',
      content: [
        'Any disputes arising from these terms shall be resolved through negotiation first.',
        'If negotiation fails, disputes will be submitted to binding arbitration.',
        'These terms are governed by the laws of Albania.',
      ],
    },
  ],
};

export const cookiesContent: LegalPageContent = {
  title: 'Cookie Policy',
  description: 'Understand how ITravel uses cookies and similar technologies.',
  lastUpdated: 'January 2026',
  sections: [
    {
      id: 'what-are-cookies',
      title: 'What Are Cookies?',
      content: [
        'Cookies are small text files stored on your device when you visit websites.',
        'They help websites remember your preferences and understand how you use the site.',
        'Cookies can be "session" (deleted when you close your browser) or "persistent" (remain until they expire).',
      ],
    },
    {
      id: 'cookies-we-use',
      title: 'Cookies We Use',
      content: [
        'Essential cookies: Required for the website to function properly (e.g., login sessions, shopping cart).',
        'Analytics cookies: Help us understand how visitors use our website (Google Analytics).',
        'Marketing cookies: Used to deliver relevant advertisements.',
        'Preference cookies: Remember your settings (language, accessibility preferences).',
      ],
    },
    {
      id: 'third-party',
      title: 'Third-Party Cookies',
      content: [
        'We use services from third parties that may set their own cookies.',
        'Google Analytics for website traffic analysis.',
        'Stripe for secure payment processing.',
        'Social media platforms for sharing features.',
      ],
    },
    {
      id: 'managing',
      title: 'Managing Cookies',
      content: [
        'You can manage cookie preferences through our cookie consent banner.',
        'Most browsers allow you to block or delete cookies in their settings.',
        'Blocking cookies may affect website functionality.',
        'You can opt out of Google Analytics at tools.google.com/dlpage/gaoptout.',
      ],
    },
    {
      id: 'updates',
      title: 'Policy Updates',
      content: [
        'We may update this Cookie Policy to reflect changes in our practices.',
        'We encourage you to review this policy periodically.',
        'Continued use of our website after changes constitutes acceptance.',
      ],
    },
  ],
};

export const safetyContent: LegalPageContent = {
  title: 'Safety Information',
  description: 'Important safety guidelines and information for travelers with ITravel.',
  lastUpdated: 'January 2026',
  sections: [
    {
      id: 'travel-safety',
      title: 'General Travel Safety',
      content: [
        'Albania is generally a safe destination for tourists with low crime rates.',
        'Always keep your belongings secure and be aware of your surroundings.',
        'Use official taxis or ride-sharing services for transportation.',
        'Keep copies of important documents (passport, booking confirmations) separately from originals.',
      ],
    },
    {
      id: 'health',
      title: 'Health Precautions',
      content: [
        'No special vaccinations are required for Albania, but routine vaccines should be up to date.',
        'Tap water is generally safe in major cities, but bottled water is recommended in rural areas.',
        'Bring any prescription medications you need, along with a copy of the prescription.',
        'We recommend comprehensive travel insurance that covers medical emergencies.',
      ],
    },
    {
      id: 'tour-safety',
      title: 'During Tours',
      content: [
        'Always follow instructions from your tour guide.',
        'Wear appropriate footwear and clothing for activities.',
        'Inform your guide of any medical conditions or physical limitations.',
        'Stay with your group and do not wander off during excursions.',
      ],
    },
    {
      id: 'emergency',
      title: 'Emergency Contacts',
      content: [
        'Emergency Services (Police, Fire, Ambulance): 112',
        'ITravel 24/7 Emergency Line: +972 50-656-6211',
        'US Embassy in Tirana: +355 4 224 7285',
        'UK Embassy in Tirana: +355 4 223 4973',
      ],
    },
    {
      id: 'insurance',
      title: 'Travel Insurance',
      content: [
        'We strongly recommend purchasing comprehensive travel insurance.',
        'Insurance should cover medical emergencies, trip cancellation, and lost belongings.',
        'Check that your policy covers adventure activities if you plan to participate.',
        'Keep insurance documents accessible during your trip.',
      ],
    },
  ],
};

export const cancellationContent: LegalPageContent = {
  title: 'Cancellation & Refund Policy',
  description: 'Understand our cancellation windows, refund process, and modification policies.',
  lastUpdated: 'January 2026',
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      content: [
        'Our cancellation policies are designed to be fair while covering our operational costs.',
        'Different products have different cancellation windows based on their nature.',
        'We always try to accommodate changes when possible.',
      ],
    },
    {
      id: 'vacation-packages',
      title: 'Vacation Packages (Flexible)',
      content: [
        '14+ days before departure: Full refund',
        '7-13 days before departure: 50% refund',
        'Less than 7 days before departure: No refund',
        'Note: Flight tickets may have separate airline cancellation policies.',
      ],
    },
    {
      id: 'day-tours',
      title: 'Day Tours (Standard)',
      content: [
        '48+ hours before tour: Full refund',
        '24-48 hours before tour: 50% refund',
        'Less than 24 hours before tour: No refund',
        'Weather cancellations by us are always fully refundable.',
      ],
    },
    {
      id: 'event-tickets',
      title: 'Event Tickets (Strict)',
      content: [
        '7+ days before event: Full refund',
        'Less than 7 days before event: No refund',
        'Tickets may be transferable to another person with advance notice.',
      ],
    },
    {
      id: 'private-tours',
      title: 'Private Tours (Custom)',
      content: [
        '30+ days before tour: Full refund',
        '14-29 days before tour: 75% refund',
        '7-13 days before tour: 50% refund',
        'Less than 7 days before tour: No refund',
        'Private tours can often be rescheduled instead of cancelled.',
      ],
    },
    {
      id: 'how-to-cancel',
      title: 'How to Cancel',
      content: [
        'Contact us via email at bookings@itravel.com with your booking reference.',
        'Call our customer service at +972 50-656-6211.',
        'Cancellations are processed based on the date we receive your request.',
        'You will receive confirmation of cancellation within 48 hours.',
      ],
    },
    {
      id: 'refund-process',
      title: 'Refund Process',
      content: [
        'Refunds are processed to the original payment method.',
        'Credit card refunds typically appear within 5-10 business days.',
        'Bank transfer refunds may take up to 14 business days.',
        'You will receive email confirmation when your refund is processed.',
      ],
    },
    {
      id: 'modifications',
      title: 'Booking Modifications',
      content: [
        'Date changes are subject to availability and may incur fees.',
        'Changes requested 30+ days before tour are usually free.',
        'Changes within 30 days may incur a modification fee.',
        'Contact us as soon as possible if you need to modify your booking.',
      ],
    },
    {
      id: 'our-cancellations',
      title: 'Cancellations by ITravel',
      content: [
        'If we cancel a tour, you will receive a full refund.',
        'Alternatively, you may transfer your booking to another date at no extra cost.',
        'We are not liable for additional expenses (flights, accommodation) due to cancellation.',
        'Tours may be cancelled due to weather, minimum participant requirements, or safety concerns.',
      ],
    },
    {
      id: 'force-majeure',
      title: 'Force Majeure',
      content: [
        'In cases of extraordinary circumstances beyond our control, standard cancellation policies may not apply.',
        'Force majeure includes natural disasters, pandemics, war, and government restrictions.',
        'We will work with you to reschedule or provide credit for future bookings.',
        'Travel insurance is strongly recommended to cover such circumstances.',
      ],
    },
  ],
};

// ============================================
// CMS-READY LEGAL PAGES (i18n)
// ============================================
// These are the fully i18n-ready versions for when CMS is connected

export const cmsLegalPages: CMSLegalPage[] = [
  {
    _id: 'legal-privacy',
    _type: 'legalPage',
    slug: 'privacy',
    title: {
      en: 'Privacy Policy',
      he: 'מדיניות פרטיות',
    },
    description: {
      en: 'Learn how ITravel collects, uses, and protects your personal information.',
      he: 'למדו כיצד ITravel אוספת, משתמשת ומגינה על המידע האישי שלכם.',
    },
    lastUpdated: 'January 2026',
    sections: [
      {
        id: 'collection',
        title: {
          en: 'Information We Collect',
          he: 'מידע שאנו אוספים',
        },
        content: {
          en: [
            'When you book a tour or create an account, we collect personal information including your name, email address, phone number, and payment details.',
            'We automatically collect certain information when you visit our website, including your IP address, browser type, device information, and pages visited.',
            'If you contact us, we keep records of our correspondence to improve our services.',
          ],
          he: [
            'כאשר אתם מזמינים טיול או יוצרים חשבון, אנו אוספים מידע אישי כולל שם, כתובת אימייל, מספר טלפון ופרטי תשלום.',
            'אנו אוספים אוטומטית מידע מסוים כאשר אתם מבקרים באתר שלנו, כולל כתובת IP, סוג דפדפן, מידע על המכשיר ודפים שבהם ביקרתם.',
            'אם אתם יוצרים איתנו קשר, אנו שומרים רשומות של ההתכתבות שלנו כדי לשפר את השירותים שלנו.',
          ],
        },
      },
      {
        id: 'usage',
        title: {
          en: 'How We Use Your Information',
          he: 'כיצד אנו משתמשים במידע שלכם',
        },
        content: {
          en: [
            'We use your information to process bookings, manage your account, and provide customer support.',
            'We may send you marketing communications about our tours and offers. You can opt out at any time.',
            'We analyze usage patterns to improve our website and services.',
          ],
          he: [
            'אנו משתמשים במידע שלכם לעיבוד הזמנות, ניהול החשבון שלכם ומתן תמיכת לקוחות.',
            'אנו עשויים לשלוח לכם תקשורת שיווקית על הטיולים וההצעות שלנו. תוכלו לבטל את ההרשמה בכל עת.',
            'אנו מנתחים דפוסי שימוש כדי לשפר את האתר והשירותים שלנו.',
          ],
        },
      },
      {
        id: 'protection',
        title: {
          en: 'How We Protect Your Data',
          he: 'כיצד אנו מגינים על המידע שלכם',
        },
        content: {
          en: [
            'We use industry-standard encryption (SSL/TLS) to protect data transmission.',
            'Payment information is processed securely through Stripe and is never stored on our servers.',
            'We implement access controls to limit who can access your personal data.',
          ],
          he: [
            'אנו משתמשים בהצפנה תקנית (SSL/TLS) כדי להגן על העברת נתונים.',
            'מידע תשלום מעובד בצורה מאובטחת דרך Stripe ולעולם לא נשמר בשרתים שלנו.',
            'אנו מיישמים בקרות גישה כדי להגביל מי יכול לגשת למידע האישי שלכם.',
          ],
        },
      },
      {
        id: 'rights',
        title: {
          en: 'Your Rights',
          he: 'הזכויות שלכם',
        },
        content: {
          en: [
            'You have the right to access, correct, or delete your personal data.',
            'You can request a copy of all data we hold about you.',
            'You have the right to lodge a complaint with a data protection authority.',
          ],
          he: [
            'יש לכם זכות לגשת, לתקן או למחוק את המידע האישי שלכם.',
            'תוכלו לבקש עותק של כל המידע שאנו מחזיקים עליכם.',
            'יש לכם זכות להגיש תלונה לרשות להגנת מידע.',
          ],
        },
      },
      {
        id: 'contact',
        title: {
          en: 'Contact Us',
          he: 'צרו קשר',
        },
        content: {
          en: [
            'Email: privacy@itravel.com',
            'Phone: +972 50-656-6211',
            'Address: Tirana, Albania',
          ],
          he: [
            'אימייל: privacy@itravel.com',
            'טלפון: +972 50-656-6211',
            'כתובת: טירנה, אלבניה',
          ],
        },
      },
    ],
  },
];

// Helper to get localized legal page content
export function getLocalizedLegalPage(
  slug: string,
  locale: Locale
): LegalPageContent | null {
  const page = cmsLegalPages.find((p) => p.slug === slug);
  if (!page) return null;

  return {
    title: page.title[locale],
    description: page.description[locale],
    lastUpdated: page.lastUpdated,
    sections: page.sections.map((s) => ({
      id: s.id,
      title: s.title[locale],
      content: s.content[locale],
    })),
  };
}
