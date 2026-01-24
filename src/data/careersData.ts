export interface JobListing {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  description: string;
  requirements: string[];
  benefits: string[];
}

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export const companyValues: CompanyValue[] = [
  {
    id: 'adventure',
    title: 'Adventure First',
    description:
      'We believe travel should be transformative. Every tour we create is designed to create lasting memories and broaden horizons.',
    icon: 'compass',
  },
  {
    id: 'sustainability',
    title: 'Sustainable Tourism',
    description:
      'We are committed to responsible tourism that benefits local communities and preserves natural and cultural heritage.',
    icon: 'leaf',
  },
  {
    id: 'excellence',
    title: 'Service Excellence',
    description:
      'From booking to departure, we strive to exceed expectations with personalized service and attention to detail.',
    icon: 'award',
  },
  {
    id: 'team',
    title: 'Team Spirit',
    description:
      'We are a diverse team united by our passion for travel. We support each other and celebrate our successes together.',
    icon: 'users',
  },
];

export const benefits = [
  'Competitive salary and performance bonuses',
  'Generous paid time off and flexible working hours',
  'Free tours for you and your family',
  'Professional development opportunities',
  'Health insurance and wellness programs',
  'Modern office in Tirana with remote work options',
  'Team retreats and company events',
  'Travel discounts with partner organizations',
];

export const jobListings: JobListing[] = [
  {
    id: 'tour-guide-senior',
    title: 'Senior Tour Guide',
    department: 'Operations',
    location: 'Tirana, Albania',
    type: 'full-time',
    description:
      'Lead groups on multi-day tours across Albania and the Balkans. You will be responsible for ensuring exceptional guest experiences, managing logistics, and sharing your knowledge of local history and culture.',
    requirements: [
      'Fluent in English and Albanian',
      '3+ years experience as a tour guide',
      'Excellent communication and storytelling skills',
      'First aid certification',
      "Valid driver's license",
      'Knowledge of Albanian history and culture',
    ],
    benefits: [
      'Base salary + tips',
      'Free accommodation during tours',
      'Equipment allowance',
      'Ongoing training',
    ],
  },
  {
    id: 'marketing-manager',
    title: 'Digital Marketing Manager',
    department: 'Marketing',
    location: 'Tirana, Albania (Hybrid)',
    type: 'full-time',
    description:
      'Develop and execute digital marketing strategies to grow our online presence and drive bookings. You will manage SEO, paid advertising, social media, and email marketing campaigns.',
    requirements: [
      'Bachelor degree in Marketing or related field',
      '4+ years digital marketing experience',
      'Experience with Google Ads, Meta Ads, and SEO',
      'Strong analytical skills and data-driven mindset',
      'Excellent written and verbal English',
    ],
    benefits: [
      'Competitive salary',
      'Performance bonus',
      'Marketing budget for experiments',
      'Conference attendance',
    ],
  },
  {
    id: 'customer-service',
    title: 'Customer Service Representative',
    department: 'Customer Success',
    location: 'Remote (Europe)',
    type: 'full-time',
    description:
      'Be the first point of contact for our customers. Handle inquiries, assist with bookings, and resolve issues to ensure every traveler has a great experience.',
    requirements: [
      'Fluent English (additional languages a plus)',
      '2+ years customer service experience',
      'Excellent communication skills',
      'Experience with CRM systems',
      'Patient and empathetic personality',
    ],
    benefits: [
      'Fully remote position',
      'Flexible hours',
      'Training provided',
      'Career growth opportunities',
    ],
  },
  {
    id: 'web-developer',
    title: 'Full-Stack Developer',
    department: 'Technology',
    location: 'Remote (Worldwide)',
    type: 'full-time',
    description:
      'Join our tech team to build and improve our booking platform. Work with modern technologies including Next.js, TypeScript, and headless CMS systems.',
    requirements: [
      '3+ years full-stack development experience',
      'Proficiency in React/Next.js and TypeScript',
      'Experience with databases and APIs',
      'Understanding of web accessibility (WCAG)',
      'Git version control',
    ],
    benefits: [
      'Competitive salary in EUR',
      'Fully remote',
      'Modern tech stack',
      'Conference budget',
      'Home office stipend',
    ],
  },
  {
    id: 'summer-intern',
    title: 'Marketing Intern',
    department: 'Marketing',
    location: 'Tirana, Albania',
    type: 'internship',
    description:
      'A 3-month summer internship perfect for students interested in travel marketing. Learn about content creation, social media management, and digital advertising.',
    requirements: [
      'Currently enrolled in university',
      'Strong interest in travel and tourism',
      'Basic knowledge of social media platforms',
      'Creative mindset',
      'Good English skills',
    ],
    benefits: [
      'Monthly stipend',
      'Flexible schedule for exams',
      'Potential full-time offer',
      'Free tour experience',
    ],
  },
];
