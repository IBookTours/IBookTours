import { Metadata } from 'next';
import Image from 'next/image';
import {
  Compass,
  Headphones,
  Shield,
  Award,
  Users,
  Globe,
  Heart,
  Target,
} from 'lucide-react';
import styles from './about.module.scss';

export const metadata: Metadata = {
  title: 'About Us | ITravel',
  description: 'Learn about our mission to create unforgettable travel experiences for adventurers worldwide.',
};

const stats = [
  { value: '12K+', label: 'Happy Travelers', icon: Users },
  { value: '72', label: 'Destinations', icon: Globe },
  { value: '15+', label: 'Years Experience', icon: Award },
  { value: '94%', label: 'Satisfaction Rate', icon: Heart },
];

const values = [
  {
    id: 'passion',
    icon: Heart,
    title: 'Passion for Travel',
    description: 'We believe travel transforms lives. Every journey we craft is infused with our love for exploration and discovery.',
  },
  {
    id: 'authenticity',
    icon: Compass,
    title: 'Authentic Experiences',
    description: 'We connect you with local cultures, traditions, and hidden gems that make each trip truly unique.',
  },
  {
    id: 'sustainability',
    icon: Globe,
    title: 'Sustainable Tourism',
    description: 'We\'re committed to responsible travel that respects local communities and protects our planet.',
  },
  {
    id: 'excellence',
    icon: Target,
    title: 'Excellence in Service',
    description: 'From planning to return, we ensure every detail exceeds your expectations.',
  },
];

const features = [
  { icon: Compass, title: 'Expert Guides', description: 'Professional local guides with deep knowledge' },
  { icon: Headphones, title: '24/7 Support', description: 'Round-the-clock assistance for travelers' },
  { icon: Shield, title: 'Best Value', description: 'Competitive prices without compromising quality' },
  { icon: Award, title: 'Award Winning', description: 'Recognized for excellence in travel services' },
];

const team = [
  {
    id: 'ceo',
    name: 'Sarah Mitchell',
    role: 'Founder & CEO',
    avatar: 'https://i.pravatar.cc/300?u=sarah-mitchell',
    bio: 'With 20+ years in travel, Sarah founded ITravel to share her passion for exploration.',
  },
  {
    id: 'coo',
    name: 'David Chen',
    role: 'Chief Operations Officer',
    avatar: 'https://i.pravatar.cc/300?u=david-chen',
    bio: 'David ensures every trip runs smoothly with his meticulous attention to detail.',
  },
  {
    id: 'head-exp',
    name: 'Maria Garcia',
    role: 'Head of Experiences',
    avatar: 'https://i.pravatar.cc/300?u=maria-garcia',
    bio: 'Maria curates unique adventures that create lasting memories.',
  },
  {
    id: 'head-dest',
    name: 'James Wilson',
    role: 'Destinations Director',
    avatar: 'https://i.pravatar.cc/300?u=james-wilson-team',
    bio: 'James scouts and develops our global network of extraordinary destinations.',
  },
];

export default function AboutPage() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image
          src="https://picsum.photos/seed/about-hero/1920/800"
          alt="Our team exploring"
          fill
          priority
          quality={90}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.badge}>Our Story</span>
          <h1>Crafting Unforgettable Journeys Since 2010</h1>
          <p>
            We&apos;re more than a travel agency — we&apos;re dreamweavers, adventure architects,
            and your partners in discovery.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            {stats.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <stat.icon className={styles.statIcon} />
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            <div className={styles.missionImages}>
              <div className={styles.imageGroup}>
                <div className={styles.imageLarge}>
                  <Image
                    src="https://picsum.photos/seed/travel-group/600/800"
                    alt="Travel group"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <div className={styles.imageSmall}>
                  <Image
                    src="https://picsum.photos/seed/adventure-hiking/600/400"
                    alt="Adventure hiking"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className={styles.imageSmall}>
                  <Image
                    src="https://picsum.photos/seed/beach-sunset/600/400"
                    alt="Beach sunset"
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              </div>
              <div className={styles.experienceBadge}>
                <span className={styles.badgeValue}>15+</span>
                <span className={styles.badgeLabel}>Years of Excellence</span>
              </div>
            </div>

            <div className={styles.missionContent}>
              <span className={styles.sectionLabel}>Who We Are</span>
              <h2>Passionate About Creating Unforgettable Experiences</h2>
              <p>
                Founded in 2010, ITravel began with a simple vision: to make extraordinary
                travel accessible to everyone. What started as a small team of travel
                enthusiasts has grown into a global community of adventurers, dreamers,
                and explorers.
              </p>
              <p>
                We believe that travel is more than visiting new places — it&apos;s about
                immersing yourself in different cultures, creating meaningful connections,
                and returning home with stories that last a lifetime.
              </p>

              <div className={styles.featuresList}>
                {features.map((feature) => (
                  <div key={feature.title} className={styles.feature}>
                    <div className={styles.featureIcon}>
                      <feature.icon />
                    </div>
                    <div>
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Our Values</span>
            <h2>What Drives Us Forward</h2>
            <p>
              These core values guide everything we do, from planning your first trip
              to welcoming you home.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div key={value.id} className={styles.valueCard}>
                <div className={styles.valueIcon}>
                  <value.icon />
                </div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Our Team</span>
            <h2>Meet the Dreamweavers</h2>
            <p>
              The passionate individuals who make your travel dreams a reality.
            </p>
          </div>

          <div className={styles.teamGrid}>
            {team.map((member) => (
              <div key={member.id} className={styles.teamCard}>
                <div className={styles.teamAvatar}>
                  <Image
                    src={member.avatar}
                    alt={member.name}
                    fill
                    sizes="200px"
                  />
                </div>
                <h3>{member.name}</h3>
                <span className={styles.teamRole}>{member.role}</span>
                <p>{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Start Your Adventure?</h2>
            <p>Join thousands of travelers who trust ITravel for their journeys.</p>
            <a href="/tours" className={styles.ctaButton}>
              Explore Our Tours
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
