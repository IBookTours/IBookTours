'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Facebook, Instagram, Youtube } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { FooterContent } from '@/types';
import { useInView } from '@/hooks';
import { ANIMATION } from '@/lib/constants';
import styles from './Footer.module.scss';

interface FooterProps {
  content: FooterContent;
  siteName: string;
}

// Custom TikTok icon (not available in lucide-react)
const TikTokIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="24"
    height="24"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook />,
  instagram: <Instagram />,
  tiktok: <TikTokIcon />,
  youtube: <Youtube />,
};

export default function Footer({ content, siteName }: FooterProps) {
  const t = useTranslations('footer');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [faqRef, isFaqInView] = useInView<HTMLDivElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  return (
    <footer className={styles.footer} id="contact" role="contentinfo">
      <div className={styles.container}>
        {/* FAQ Section */}
        <div ref={faqRef} className={`${styles.faqSection} ${isFaqInView ? styles.visible : ''}`}>
          <div className={styles.faqHeader}>
            <h2 className={styles.faqTitle}>{t('faqTitle')}</h2>
            <p className={styles.faqSubtitle}>
              {t('faqSubtitle')}
            </p>
          </div>

          <div className={styles.faqs}>
            {/* Limit to 4 FAQs for compact 2-column layout */}
            {content.faqs.slice(0, 4).map((faq) => (
              <div key={faq.id} className={styles.faqItem}>
                <button
                  className={`${styles.faqQuestion} ${openFaq === faq.id ? styles.open : ''}`}
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={openFaq === faq.id}
                  aria-controls={`faq-answer-${faq.id}`}
                >
                  {faq.question}
                  <ChevronDown aria-hidden="true" />
                </button>
                <div
                  id={`faq-answer-${faq.id}`}
                  className={`${styles.faqAnswer} ${openFaq === faq.id ? styles.open : ''}`}
                >
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer */}
        <div className={styles.main}>
          <div className={styles.grid}>
            <div className={styles.brand}>
              <Link href="/" className={styles.logo}>
                <Image
                  src="/logo.svg"
                  alt={siteName}
                  width={140}
                  height={40}
                  className={styles.logoImage}
                />
              </Link>
              <p className={styles.tagline}>{content.tagline}</p>

              <div className={styles.social}>
                {content.socialLinks.map((link) => (
                  <a
                    key={link.platform}
                    href={link.url}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                  >
                    {socialIcons[link.icon]}
                  </a>
                ))}
              </div>
            </div>

            {content.sections.map((section) => (
              <div key={section.id} className={styles.linkSection}>
                <h4>{section.title}</h4>
                <div className={styles.links}>
                  {section.links.map((link) => (
                    <Link key={link.id} href={link.href} className={styles.link}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={styles.bottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>{content.copyright}</p>
            <div className={styles.legalLinks}>
              <Link href="/terms" className={styles.legalLink}>
                {t('termsOfService')}
              </Link>
              <Link href="/privacy" className={styles.legalLink}>
                {t('privacyPolicy')}
              </Link>
            </div>
          </div>
          <p className={styles.developer}>
            {t('developedBy')} Mahdy Gribkov
          </p>
        </div>
      </div>
    </footer>
  );
}
