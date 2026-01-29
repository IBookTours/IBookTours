'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { LegalPageContent } from '@/data/legalPages';
import styles from './LegalPage.module.scss';

interface LegalPageProps {
  content: LegalPageContent;
}

export default function LegalPage({ content }: LegalPageProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(content.sections.map((s) => s.id))
  );

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedSections(new Set(content.sections.map((s) => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.brandHeader}>
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="IBookTours"
              width={140}
              height={40}
              className={styles.logo}
            />
          </Link>
        </div>

        <Link href="/" className={styles.backLink}>
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        <header className={styles.header}>
          <h1>{content.title}</h1>
          <p className={styles.description}>{content.description}</p>
          <p className={styles.updated}>Last updated: {content.lastUpdated}</p>
        </header>

        <div className={styles.controls}>
          <button onClick={expandAll} className={styles.controlBtn}>
            Expand All
          </button>
          <button onClick={collapseAll} className={styles.controlBtn}>
            Collapse All
          </button>
        </div>

        <nav className={styles.toc} aria-label="Table of contents">
          <h2>Contents</h2>
          <ul>
            {content.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`}>{section.title}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.content}>
          {content.sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className={styles.section}
            >
              <button
                className={styles.sectionHeader}
                onClick={() => toggleSection(section.id)}
                aria-expanded={expandedSections.has(section.id)}
                aria-controls={`section-content-${section.id}`}
              >
                <h2>{section.title}</h2>
                {expandedSections.has(section.id) ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>

              {expandedSections.has(section.id) && (
                <div
                  id={`section-content-${section.id}`}
                  className={styles.sectionContent}
                >
                  {section.content.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        <footer className={styles.footer}>
          <p>
            If you have any questions about this policy, please{' '}
            <Link href="/contact">contact us</Link>.
          </p>
        </footer>
      </div>
    </div>
  );
}
