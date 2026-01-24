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
          'Free cancellation up to 30 days before. 50% refund 15-30 days before. 25% refund 7-14 days before. No refund less than 7 days before the tour.',
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
