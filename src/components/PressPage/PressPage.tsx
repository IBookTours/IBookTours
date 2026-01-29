'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronDown,
  Download,
  FileText,
  Image as ImageIcon,
  Mail,
  Phone,
  Calendar,
  Building2,
  Users,
  Star,
  Globe,
  MapPin,
} from 'lucide-react';
import {
  PressRelease,
  MediaKit,
  MediaContact,
} from '@/data/pressData';
import styles from './PressPage.module.scss';

interface PressPageProps {
  pressReleases: PressRelease[];
  mediaKit: MediaKit[];
  contact: MediaContact;
  facts: {
    founded: string;
    headquarters: string;
    employees: string;
    toursOffered: string;
    countriesServed: string;
    customersServed: string;
    rating: string;
    reviews: string;
  };
}

const fileIcons: Record<string, React.ReactNode> = {
  ZIP: <ImageIcon size={20} />,
  PDF: <FileText size={20} />,
};

export default function PressPage({
  pressReleases,
  mediaKit,
  contact,
  facts,
}: PressPageProps) {
  const [expandedRelease, setExpandedRelease] = useState<string | null>(null);

  const toggleRelease = (id: string) => {
    setExpandedRelease(expandedRelease === id ? null : id);
  };

  return (
    <div className={styles.press}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        <header className={styles.header}>
          <h1>Press & Media</h1>
          <p>
            News, press releases, and media resources about IBookTours.
          </p>
        </header>

        <div className={styles.grid}>
          <div className={styles.mainContent}>
            <section className={styles.releasesSection}>
              <h2>Press Releases</h2>
              <div className={styles.releasesList}>
                {pressReleases.map((release) => (
                  <article key={release.id} className={styles.releaseCard}>
                    <button
                      className={styles.releaseHeader}
                      onClick={() => toggleRelease(release.id)}
                      aria-expanded={expandedRelease === release.id}
                    >
                      <div className={styles.releaseInfo}>
                        <span className={styles.releaseDate}>
                          <Calendar size={14} />
                          {release.date}
                        </span>
                        <h3>{release.title}</h3>
                        <p className={styles.releaseExcerpt}>{release.excerpt}</p>
                      </div>
                      <ChevronDown
                        size={20}
                        className={`${styles.chevron} ${expandedRelease === release.id ? styles.rotated : ''}`}
                      />
                    </button>

                    {expandedRelease === release.id && (
                      <div className={styles.releaseContent}>
                        {release.content.split('\n\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>

            <section className={styles.mediaKitSection}>
              <h2>Media Kit</h2>
              <p className={styles.mediaKitIntro}>
                Download brand assets and resources for editorial use.
              </p>
              <div className={styles.mediaKitGrid}>
                {mediaKit.map((item) => (
                  <a
                    key={item.id}
                    href={item.downloadUrl}
                    className={styles.mediaKitCard}
                    download
                  >
                    <div className={styles.mediaKitIcon}>
                      {fileIcons[item.fileType]}
                    </div>
                    <div className={styles.mediaKitInfo}>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                      <span className={styles.fileInfo}>
                        {item.fileType} • {item.fileSize}
                      </span>
                    </div>
                    <Download size={18} className={styles.downloadIcon} />
                  </a>
                ))}
              </div>
            </section>
          </div>

          <aside className={styles.sidebar}>
            <div className={styles.contactCard}>
              <h3>Media Contact</h3>
              <div className={styles.contactInfo}>
                <p className={styles.contactName}>{contact.name}</p>
                <p className={styles.contactTitle}>{contact.title}</p>
                <a href={`mailto:${contact.email}`} className={styles.contactLink}>
                  <Mail size={16} />
                  {contact.email}
                </a>
                <a href={`tel:${contact.phone}`} className={styles.contactLink}>
                  <Phone size={16} />
                  {contact.phone}
                </a>
              </div>
            </div>

            <div className={styles.factsCard}>
              <h3>Company Facts</h3>
              <div className={styles.factsList}>
                <div className={styles.factItem}>
                  <Calendar size={16} />
                  <div>
                    <span className={styles.factLabel}>Founded</span>
                    <span className={styles.factValue}>{facts.founded}</span>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <MapPin size={16} />
                  <div>
                    <span className={styles.factLabel}>Headquarters</span>
                    <span className={styles.factValue}>{facts.headquarters}</span>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <Users size={16} />
                  <div>
                    <span className={styles.factLabel}>Team Size</span>
                    <span className={styles.factValue}>{facts.employees}</span>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <Building2 size={16} />
                  <div>
                    <span className={styles.factLabel}>Tours Offered</span>
                    <span className={styles.factValue}>{facts.toursOffered}</span>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <Globe size={16} />
                  <div>
                    <span className={styles.factLabel}>Countries Served</span>
                    <span className={styles.factValue}>{facts.countriesServed}</span>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <Users size={16} />
                  <div>
                    <span className={styles.factLabel}>Travelers Served</span>
                    <span className={styles.factValue}>{facts.customersServed}</span>
                  </div>
                </div>
                <div className={styles.factItem}>
                  <Star size={16} />
                  <div>
                    <span className={styles.factLabel}>Average Rating</span>
                    <span className={styles.factValue}>{facts.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
