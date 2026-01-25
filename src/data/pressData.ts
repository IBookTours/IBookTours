export interface PressRelease {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
}

export interface MediaKit {
  id: string;
  title: string;
  description: string;
  downloadUrl: string;
  fileType: string;
  fileSize: string;
}

export interface MediaContact {
  name: string;
  title: string;
  email: string;
  phone: string;
}

export const pressReleases: PressRelease[] = [
  {
    id: 'launch-2026',
    title: 'ITravel Launches New Albanian Adventure Tours for 2026',
    date: 'January 15, 2026',
    excerpt:
      'ITravel announces its expanded tour portfolio featuring unique experiences across Albania, from the Albanian Alps to the stunning Riviera.',
    content: `ITravel, a leading tour operator specializing in Albanian tourism, today announced the launch of its 2026 tour season with an expanded portfolio of adventure experiences.

The new offerings include multi-day treks through the Albanian Alps, food and wine tours along the coast, and UNESCO heritage tours visiting Berat and Gjirokaster.

"Albania is one of Europe's last undiscovered gems," said the ITravel team. "Our mission is to share its incredible natural beauty, rich history, and warm hospitality with travelers from around the world."

The company has also enhanced its booking platform with improved accessibility features and a streamlined checkout process.`,
  },
  {
    id: 'sustainability-initiative',
    title: 'ITravel Commits to Carbon-Neutral Tours by 2027',
    date: 'December 5, 2025',
    excerpt:
      'As part of our sustainability commitment, ITravel announces initiatives to offset carbon emissions from all tour operations.',
    content: `ITravel has announced an ambitious sustainability plan to achieve carbon-neutral tour operations by 2027.

The initiative includes partnerships with local reforestation projects, investment in electric transportation, and support for community-based tourism that directly benefits local residents.

"Sustainable tourism isn't just good for the planet - it's essential for preserving the destinations we love," said the ITravel team. "We're committed to leading by example in the Albanian tourism industry."

The company will also introduce an optional carbon offset contribution for customers at checkout.`,
  },
  {
    id: 'award-recognition',
    title: 'ITravel Named Best Tour Operator in Albania 2025',
    date: 'November 20, 2025',
    excerpt:
      'ITravel receives recognition for excellence in customer service and innovative tour experiences at the Balkans Tourism Awards.',
    content: `ITravel has been named Best Tour Operator in Albania at the 2025 Balkans Tourism Awards, recognizing the company's commitment to quality experiences and customer satisfaction.

The award highlights ITravel's innovative approach to tour design, strong customer reviews, and contribution to sustainable tourism in the region.

"This recognition belongs to our entire team - from our guides on the ground to our customer service representatives," said ITravel representatives. "We're proud to showcase Albania to the world."

The company has grown significantly over the past year, welcoming thousands of visitors from over 50 countries.`,
  },
];

export const mediaKit: MediaKit[] = [
  {
    id: 'logo-pack',
    title: 'ITravel Logo Pack',
    description: 'High-resolution logos in various formats (PNG, SVG, EPS) for print and digital use.',
    downloadUrl: '/downloads/itravel-logo-pack.zip',
    fileType: 'ZIP',
    fileSize: '2.4 MB',
  },
  {
    id: 'brand-guidelines',
    title: 'Brand Guidelines',
    description: 'Complete brand guidelines including colors, typography, and usage rules.',
    downloadUrl: '/downloads/itravel-brand-guidelines.pdf',
    fileType: 'PDF',
    fileSize: '4.1 MB',
  },
  {
    id: 'press-photos',
    title: 'Press Photo Gallery',
    description: 'High-resolution photos from our tours available for editorial use.',
    downloadUrl: '/downloads/itravel-press-photos.zip',
    fileType: 'ZIP',
    fileSize: '45 MB',
  },
  {
    id: 'fact-sheet',
    title: 'Company Fact Sheet',
    description: 'Key facts and figures about ITravel for journalists and partners.',
    downloadUrl: '/downloads/itravel-fact-sheet.pdf',
    fileType: 'PDF',
    fileSize: '1.2 MB',
  },
];

export const mediaContact: MediaContact = {
  name: 'Press Team',
  title: 'Media Relations',
  email: 'press@itravel.com',
  phone: '+972 50-656-6211',
};

export const companyFacts = {
  founded: '2024',
  headquarters: 'Tirana, Albania',
  employees: '25+',
  toursOffered: '15+',
  countriesServed: '50+',
  customersServed: '5,000+',
  rating: '4.9/5',
  reviews: '500+',
};
