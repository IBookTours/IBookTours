// ============================================
// ITRAVEL - Help Center Data (CMS Ready)
// ============================================
// This file contains FAQ and help content with i18n support.
// Replace with Sanity fetches when CMS is connected:
// const helpData = await sanityClient.fetch<FAQCategory[]>(helpQuery);

import type { LocalizedString, Locale } from '@/types/cms';

// ============================================
// INTERFACES
// ============================================

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface FAQCategory {
  id: string;
  name: string;
  icon: string;
  items: FAQItem[];
}

// CMS-Ready interfaces with i18n support
export interface CMSFAQItem {
  _id: string;
  _type: 'faqItem';
  id: string;
  question: LocalizedString;
  answer: LocalizedString;
  order?: number;
}

export interface CMSFAQCategory {
  _id: string;
  _type: 'faqCategory';
  id: string;
  name: LocalizedString;
  icon: string;
  items: CMSFAQItem[];
  order: number;
}

// ============================================
// CMS-READY FAQ DATA (i18n)
// ============================================

export const cmsFAQCategories: CMSFAQCategory[] = [
  {
    _id: 'faq-booking',
    _type: 'faqCategory',
    id: 'booking',
    name: {
      en: 'Booking & Reservations',
      he: 'הזמנות ורזרבציות',
    },
    icon: 'calendar',
    order: 1,
    items: [
      {
        _id: 'faq-how-to-book',
        _type: 'faqItem',
        id: 'how-to-book',
        question: {
          en: 'How do I book a tour?',
          he: 'איך אני מזמין טיול?',
        },
        answer: {
          en: 'Browse our tours page, select your preferred package, choose your date and number of travelers, then proceed to checkout. You can pay securely with credit card. You will receive a confirmation email within minutes.',
          he: 'דפדפו בדף הטיולים שלנו, בחרו את החבילה המועדפת, בחרו תאריך ומספר מטיילים, ואז המשיכו לתשלום. תוכלו לשלם בצורה מאובטחת בכרטיס אשראי. תקבלו אימייל אישור תוך דקות.',
        },
        order: 1,
      },
      {
        _id: 'faq-group-booking',
        _type: 'faqItem',
        id: 'group-booking',
        question: {
          en: 'Can I book for a large group?',
          he: 'האם אפשר להזמין לקבוצה גדולה?',
        },
        answer: {
          en: 'Yes! We offer group discounts for parties of 6 or more. Contact us directly for custom group arrangements and special pricing.',
          he: 'כן! אנו מציעים הנחות לקבוצות של 6 או יותר. צרו איתנו קשר ישירות לסידורים מותאמים אישית ומחירים מיוחדים.',
        },
        order: 2,
      },
      {
        _id: 'faq-booking-confirmation',
        _type: 'faqItem',
        id: 'booking-confirmation',
        question: {
          en: 'When will I receive my booking confirmation?',
          he: 'מתי אקבל את אישור ההזמנה?',
        },
        answer: {
          en: 'You will receive an instant confirmation email after completing your booking. If you do not receive it within 15 minutes, please check your spam folder or contact us.',
          he: 'תקבלו אימייל אישור מיידי לאחר השלמת ההזמנה. אם לא קיבלתם תוך 15 דקות, בדקו את תיקיית הספאם או צרו איתנו קשר.',
        },
        order: 3,
      },
      {
        _id: 'faq-modify-booking',
        _type: 'faqItem',
        id: 'modify-booking',
        question: {
          en: 'Can I modify my booking after it is made?',
          he: 'האם אפשר לשנות את ההזמנה לאחר שבוצעה?',
        },
        answer: {
          en: 'Yes, you can modify your booking up to 30 days before the tour date at no extra charge. Changes within 30 days may incur a modification fee. Contact us to make changes.',
          he: 'כן, תוכלו לשנות את ההזמנה עד 30 יום לפני תאריך הטיול ללא תשלום נוסף. שינויים תוך 30 יום עשויים לכלול עמלה. צרו איתנו קשר לביצוע שינויים.',
        },
        order: 4,
      },
    ],
  },
  {
    _id: 'faq-payment',
    _type: 'faqCategory',
    id: 'payment',
    name: {
      en: 'Payment & Pricing',
      he: 'תשלום ומחירים',
    },
    icon: 'credit-card',
    order: 2,
    items: [
      {
        _id: 'faq-payment-methods',
        _type: 'faqItem',
        id: 'payment-methods',
        question: {
          en: 'What payment methods do you accept?',
          he: 'אילו אמצעי תשלום אתם מקבלים?',
        },
        answer: {
          en: 'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. All payments are encrypted and secure.',
          he: 'אנו מקבלים את כל כרטיסי האשראי המובילים (ויזה, מאסטרקארד, אמריקן אקספרס) דרך מעבד התשלומים המאובטח שלנו, Stripe. כל התשלומים מוצפנים ומאובטחים.',
        },
        order: 1,
      },
      {
        _id: 'faq-currency',
        _type: 'faqItem',
        id: 'currency',
        question: {
          en: 'What currency are prices shown in?',
          he: 'באיזה מטבע מוצגים המחירים?',
        },
        answer: {
          en: 'All prices are displayed in Euros (EUR). Your credit card company will convert this to your local currency at their current exchange rate.',
          he: 'כל המחירים מוצגים באירו (EUR). חברת כרטיס האשראי שלכם תמיר זאת למטבע המקומי שלכם לפי שער החליפין הנוכחי.',
        },
        order: 2,
      },
      {
        _id: 'faq-hidden-fees',
        _type: 'faqItem',
        id: 'hidden-fees',
        question: {
          en: 'Are there any hidden fees?',
          he: 'האם יש עמלות נסתרות?',
        },
        answer: {
          en: 'No hidden fees! The price you see includes all tour services, guide fees, and applicable taxes. Some tours may have optional add-ons which are clearly marked.',
          he: 'אין עמלות נסתרות! המחיר שאתם רואים כולל את כל שירותי הטיול, דמי המדריך והמיסים החלים. לחלק מהטיולים עשויות להיות תוספות אופציונליות שמסומנות בבירור.',
        },
        order: 3,
      },
      {
        _id: 'faq-children-pricing',
        _type: 'faqItem',
        id: 'children-pricing',
        question: {
          en: 'Do children get a discount?',
          he: 'האם ילדים מקבלים הנחה?',
        },
        answer: {
          en: 'Yes! Children under 12 receive a 50% discount on most tours. Some tours may have different age policies which will be noted on the tour page.',
          he: 'כן! ילדים מתחת לגיל 12 מקבלים הנחה של 50% ברוב הטיולים. לחלק מהטיולים עשויות להיות מדיניות גיל שונה שתצוין בדף הטיול.',
        },
        order: 4,
      },
    ],
  },
  {
    _id: 'faq-cancellation',
    _type: 'faqCategory',
    id: 'cancellation',
    name: {
      en: 'Cancellations & Refunds',
      he: 'ביטולים והחזרים',
    },
    icon: 'x-circle',
    order: 3,
    items: [
      {
        _id: 'faq-cancel-policy',
        _type: 'faqItem',
        id: 'cancel-policy',
        question: {
          en: 'What is your cancellation policy?',
          he: 'מהי מדיניות הביטולים שלכם?',
        },
        answer: {
          en: 'Our policies vary by product type. Vacation Packages: 14+ days = full refund, 7-13 days = 50%, <7 days = no refund. Day Tours: 48+ hours = full, 24-48h = 50%, <24h = no refund. See our Cancellation Policy page for full details.',
          he: 'המדיניות שלנו משתנה לפי סוג המוצר. חבילות נופש: 14+ ימים = החזר מלא, 7-13 ימים = 50%, פחות מ-7 ימים = ללא החזר. טיולי יום: 48+ שעות = מלא, 24-48 שעות = 50%, פחות מ-24 שעות = ללא החזר. ראו את דף מדיניות הביטולים לפרטים מלאים.',
        },
        order: 1,
      },
      {
        _id: 'faq-how-to-cancel',
        _type: 'faqItem',
        id: 'how-to-cancel',
        question: {
          en: 'How do I cancel my booking?',
          he: 'איך אני מבטל את ההזמנה?',
        },
        answer: {
          en: 'Email us at bookings@itravel.com with your booking reference, or call our customer service. Cancellations are processed within 48 hours.',
          he: 'שלחו לנו אימייל ל-bookings@itravel.com עם מספר ההזמנה, או התקשרו לשירות הלקוחות שלנו. ביטולים מעובדים תוך 48 שעות.',
        },
        order: 2,
      },
      {
        _id: 'faq-refund-time',
        _type: 'faqItem',
        id: 'refund-time',
        question: {
          en: 'How long does it take to receive a refund?',
          he: 'כמה זמן לוקח לקבל החזר?',
        },
        answer: {
          en: 'Refunds are processed within 5-7 business days. Depending on your bank, it may take an additional 5-10 days to appear in your account.',
          he: 'החזרים מעובדים תוך 5-7 ימי עסקים. בהתאם לבנק שלכם, עשוי לקחת עוד 5-10 ימים עד שיופיע בחשבון.',
        },
        order: 3,
      },
      {
        _id: 'faq-weather-cancellation',
        _type: 'faqItem',
        id: 'weather-cancellation',
        question: {
          en: 'What happens if a tour is cancelled due to weather?',
          he: 'מה קורה אם טיול מבוטל בגלל מזג אוויר?',
        },
        answer: {
          en: 'If we cancel a tour due to weather or safety concerns, you will receive a full refund or the option to reschedule at no extra cost.',
          he: 'אם אנחנו מבטלים טיול בגלל מזג אוויר או בעיות בטיחות, תקבלו החזר מלא או אפשרות לתזמן מחדש ללא עלות נוספת.',
        },
        order: 4,
      },
    ],
  },
  {
    _id: 'faq-tours',
    _type: 'faqCategory',
    id: 'tours',
    name: {
      en: 'During Your Tour',
      he: 'במהלך הטיול',
    },
    icon: 'map',
    order: 4,
    items: [
      {
        _id: 'faq-what-to-bring',
        _type: 'faqItem',
        id: 'what-to-bring',
        question: {
          en: 'What should I bring on a tour?',
          he: 'מה צריך להביא לטיול?',
        },
        answer: {
          en: 'We recommend comfortable walking shoes, weather-appropriate clothing, sunscreen, water, and a camera. Specific requirements are listed on each tour page.',
          he: 'אנו ממליצים על נעלי הליכה נוחות, ביגוד מתאים למזג האוויר, קרם הגנה, מים ומצלמה. דרישות ספציפיות מופיעות בדף כל טיול.',
        },
        order: 1,
      },
      {
        _id: 'faq-meeting-point',
        _type: 'faqItem',
        id: 'meeting-point',
        question: {
          en: 'Where do tours start?',
          he: 'היכן הטיולים מתחילים?',
        },
        answer: {
          en: 'Meeting points vary by tour. You will receive detailed instructions including address and map in your confirmation email 24 hours before the tour.',
          he: 'נקודות המפגש משתנות לפי הטיול. תקבלו הוראות מפורטות כולל כתובת ומפה באימייל האישור 24 שעות לפני הטיול.',
        },
        order: 2,
      },
      {
        _id: 'faq-language',
        _type: 'faqItem',
        id: 'language',
        question: {
          en: 'What language are tours conducted in?',
          he: 'באיזו שפה מתנהלים הטיולים?',
        },
        answer: {
          en: 'All our tours are conducted in English. We can arrange private tours in other languages with advance notice.',
          he: 'כל הטיולים שלנו מתנהלים באנגלית. אנחנו יכולים לסדר טיולים פרטיים בשפות אחרות עם הודעה מראש.',
        },
        order: 3,
      },
      {
        _id: 'faq-accessibility',
        _type: 'faqItem',
        id: 'accessibility',
        question: {
          en: 'Are tours accessible for people with disabilities?',
          he: 'האם הטיולים נגישים לאנשים עם מוגבלויות?',
        },
        answer: {
          en: 'Accessibility varies by tour. Please contact us before booking to discuss your specific needs and we will do our best to accommodate you.',
          he: 'הנגישות משתנה לפי הטיול. אנא צרו איתנו קשר לפני ההזמנה כדי לדון בצרכים הספציפיים שלכם ונעשה כמיטב יכולתנו להתאים.',
        },
        order: 4,
      },
    ],
  },
  {
    _id: 'faq-account',
    _type: 'faqCategory',
    id: 'account',
    name: {
      en: 'Account & Support',
      he: 'חשבון ותמיכה',
    },
    icon: 'user',
    order: 5,
    items: [
      {
        _id: 'faq-create-account',
        _type: 'faqItem',
        id: 'create-account',
        question: {
          en: 'Do I need an account to book?',
          he: 'האם אני צריך חשבון כדי להזמין?',
        },
        answer: {
          en: 'You can book as a guest, but creating an account makes it easier to manage your bookings, save favorites, and receive personalized recommendations.',
          he: 'תוכלו להזמין כאורחים, אבל יצירת חשבון מקלה על ניהול ההזמנות, שמירת מועדפים וקבלת המלצות מותאמות אישית.',
        },
        order: 1,
      },
      {
        _id: 'faq-forgot-password',
        _type: 'faqItem',
        id: 'forgot-password',
        question: {
          en: 'I forgot my password. What do I do?',
          he: 'שכחתי את הסיסמה. מה לעשות?',
        },
        answer: {
          en: 'Click "Forgot Password" on the login page. We will send a reset link to your email. If you do not receive it, check spam or contact support.',
          he: 'לחצו על "שכחתי סיסמה" בדף ההתחברות. נשלח לכם קישור לאיפוס לאימייל. אם לא קיבלתם, בדקו בספאם או צרו קשר עם התמיכה.',
        },
        order: 2,
      },
      {
        _id: 'faq-contact-support',
        _type: 'faqItem',
        id: 'contact-support',
        question: {
          en: 'How can I contact customer support?',
          he: 'איך אפשר ליצור קשר עם התמיכה?',
        },
        answer: {
          en: 'Email us at support@itravel.com, call +972 50-656-6211, or use the WhatsApp button on our website. We typically respond within 24 hours.',
          he: 'שלחו לנו אימייל ל-support@itravel.com, התקשרו ל-+972 50-656-6211, או השתמשו בכפתור הוואטסאפ באתר. אנחנו בדרך כלל משיבים תוך 24 שעות.',
        },
        order: 3,
      },
      {
        _id: 'faq-business-hours',
        _type: 'faqItem',
        id: 'business-hours',
        question: {
          en: 'What are your business hours?',
          he: 'מהן שעות הפעילות שלכם?',
        },
        answer: {
          en: 'Our office is open Monday-Friday 9:00-18:00 CET. For emergencies during tours, we have a 24/7 hotline available to all booked customers.',
          he: 'המשרד שלנו פתוח ימים ראשון עד חמישי 9:00-18:00 שעון ישראל. לשעת חירום במהלך טיולים, יש לנו קו חם 24/7 לכל הלקוחות שהזמינו.',
        },
        order: 4,
      },
    ],
  },
];

// ============================================
// LEGACY FORMAT (for backward compatibility)
// ============================================
// These maintain the current component interface

export const helpCategories: FAQCategory[] = [
  {
    id: 'booking',
    name: 'Booking & Reservations',
    icon: 'calendar',
    items: [
      {
        id: 'how-to-book',
        question: 'How do I book a tour?',
        answer:
          'Browse our tours page, select your preferred package, choose your date and number of travelers, then proceed to checkout. You can pay securely with credit card. You will receive a confirmation email within minutes.',
      },
      {
        id: 'group-booking',
        question: 'Can I book for a large group?',
        answer:
          'Yes! We offer group discounts for parties of 6 or more. Contact us directly for custom group arrangements and special pricing.',
      },
      {
        id: 'booking-confirmation',
        question: 'When will I receive my booking confirmation?',
        answer:
          'You will receive an instant confirmation email after completing your booking. If you do not receive it within 15 minutes, please check your spam folder or contact us.',
      },
      {
        id: 'modify-booking',
        question: 'Can I modify my booking after it is made?',
        answer:
          'Yes, you can modify your booking up to 30 days before the tour date at no extra charge. Changes within 30 days may incur a modification fee. Contact us to make changes.',
      },
    ],
  },
  {
    id: 'payment',
    name: 'Payment & Pricing',
    icon: 'credit-card',
    items: [
      {
        id: 'payment-methods',
        question: 'What payment methods do you accept?',
        answer:
          'We accept all major credit cards (Visa, Mastercard, American Express) through our secure payment processor, Stripe. All payments are encrypted and secure.',
      },
      {
        id: 'currency',
        question: 'What currency are prices shown in?',
        answer:
          'All prices are displayed in Euros (EUR). Your credit card company will convert this to your local currency at their current exchange rate.',
      },
      {
        id: 'hidden-fees',
        question: 'Are there any hidden fees?',
        answer:
          'No hidden fees! The price you see includes all tour services, guide fees, and applicable taxes. Some tours may have optional add-ons which are clearly marked.',
      },
      {
        id: 'children-pricing',
        question: 'Do children get a discount?',
        answer:
          'Yes! Children under 12 receive a 50% discount on most tours. Some tours may have different age policies which will be noted on the tour page.',
      },
    ],
  },
  {
    id: 'cancellation',
    name: 'Cancellations & Refunds',
    icon: 'x-circle',
    items: [
      {
        id: 'cancel-policy',
        question: 'What is your cancellation policy?',
        answer:
          'Our policies vary by product type. Vacation Packages: 14+ days = full refund, 7-13 days = 50%, <7 days = no refund. Day Tours: 48+ hours = full, 24-48h = 50%, <24h = no refund. See our Cancellation Policy page for full details.',
      },
      {
        id: 'how-to-cancel',
        question: 'How do I cancel my booking?',
        answer:
          'Email us at bookings@itravel.com with your booking reference, or call our customer service. Cancellations are processed within 48 hours.',
      },
      {
        id: 'refund-time',
        question: 'How long does it take to receive a refund?',
        answer:
          'Refunds are processed within 5-7 business days. Depending on your bank, it may take an additional 5-10 days to appear in your account.',
      },
      {
        id: 'weather-cancellation',
        question: 'What happens if a tour is cancelled due to weather?',
        answer:
          'If we cancel a tour due to weather or safety concerns, you will receive a full refund or the option to reschedule at no extra cost.',
      },
    ],
  },
  {
    id: 'tours',
    name: 'During Your Tour',
    icon: 'map',
    items: [
      {
        id: 'what-to-bring',
        question: 'What should I bring on a tour?',
        answer:
          'We recommend comfortable walking shoes, weather-appropriate clothing, sunscreen, water, and a camera. Specific requirements are listed on each tour page.',
      },
      {
        id: 'meeting-point',
        question: 'Where do tours start?',
        answer:
          'Meeting points vary by tour. You will receive detailed instructions including address and map in your confirmation email 24 hours before the tour.',
      },
      {
        id: 'language',
        question: 'What language are tours conducted in?',
        answer:
          'All our tours are conducted in English. We can arrange private tours in other languages with advance notice.',
      },
      {
        id: 'accessibility',
        question: 'Are tours accessible for people with disabilities?',
        answer:
          'Accessibility varies by tour. Please contact us before booking to discuss your specific needs and we will do our best to accommodate you.',
      },
    ],
  },
  {
    id: 'account',
    name: 'Account & Support',
    icon: 'user',
    items: [
      {
        id: 'create-account',
        question: 'Do I need an account to book?',
        answer:
          'You can book as a guest, but creating an account makes it easier to manage your bookings, save favorites, and receive personalized recommendations.',
      },
      {
        id: 'forgot-password',
        question: 'I forgot my password. What do I do?',
        answer:
          'Click "Forgot Password" on the login page. We will send a reset link to your email. If you do not receive it, check spam or contact support.',
      },
      {
        id: 'contact-support',
        question: 'How can I contact customer support?',
        answer:
          'Email us at support@itravel.com, call +972 50-656-6211, or use the WhatsApp button on our website. We typically respond within 24 hours.',
      },
      {
        id: 'business-hours',
        question: 'What are your business hours?',
        answer:
          'Our office is open Monday-Friday 9:00-18:00 CET. For emergencies during tours, we have a 24/7 hotline available to all booked customers.',
      },
    ],
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

// Get localized FAQ categories
export function getLocalizedFAQCategories(locale: Locale): FAQCategory[] {
  return cmsFAQCategories.map((category) => ({
    id: category.id,
    name: category.name[locale],
    icon: category.icon,
    items: category.items.map((item) => ({
      id: item.id,
      question: item.question[locale],
      answer: item.answer[locale],
    })),
  }));
}

// Get a specific FAQ category by ID
export function getFAQCategory(id: string): FAQCategory | undefined {
  return helpCategories.find((cat) => cat.id === id);
}

// Get localized FAQ category by ID
export function getLocalizedFAQCategory(
  id: string,
  locale: Locale
): FAQCategory | undefined {
  const category = cmsFAQCategories.find((cat) => cat.id === id);
  if (!category) return undefined;

  return {
    id: category.id,
    name: category.name[locale],
    icon: category.icon,
    items: category.items.map((item) => ({
      id: item.id,
      question: item.question[locale],
      answer: item.answer[locale],
    })),
  };
}

// Search FAQs by keyword
export function searchFAQs(
  keyword: string,
  locale: Locale = 'en'
): { category: string; item: FAQItem }[] {
  const results: { category: string; item: FAQItem }[] = [];
  const searchTerm = keyword.toLowerCase();

  for (const category of cmsFAQCategories) {
    for (const item of category.items) {
      const question = item.question[locale].toLowerCase();
      const answer = item.answer[locale].toLowerCase();

      if (question.includes(searchTerm) || answer.includes(searchTerm)) {
        results.push({
          category: category.name[locale],
          item: {
            id: item.id,
            question: item.question[locale],
            answer: item.answer[locale],
          },
        });
      }
    }
  }

  return results;
}
