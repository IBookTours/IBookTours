export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

export interface LegalPageContent {
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
}

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
        'Free cancellation is available up to 30 days before the tour start date.',
        'Cancellations made 15-30 days before receive a 50% refund.',
        'Cancellations made less than 15 days before are non-refundable.',
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
      id: 'cancellation-windows',
      title: 'Cancellation Windows',
      content: [
        '30+ days before tour: Full refund (minus any non-refundable deposits).',
        '15-30 days before tour: 50% refund.',
        '7-14 days before tour: 25% refund.',
        'Less than 7 days before tour: No refund available.',
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
