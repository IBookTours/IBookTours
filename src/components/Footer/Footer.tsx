'use client';

import { useState, useEffect } from 'react';
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

// Custom TikTok icon
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const socialIcons: Record<string, React.ReactNode> = {
  facebook: <Facebook size={18} />,
  instagram: <Instagram size={18} />,
  tiktok: <TikTokIcon />,
  youtube: <Youtube size={18} />,
};

export default function Footer({ content, siteName }: FooterProps) {
  const t = useTranslations('footer');
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [faqRef, isFaqInView] = useInView<HTMLDivElement>({
    threshold: ANIMATION.THRESHOLD_LIGHT,
    triggerOnce: true,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleFaq = (id: string) => {
    setOpenFaq((prev) => (prev === id ? null : id));
  };

  const toggleSection = (id: string) => {
    if (isMobile) {
      setOpenSection((prev) => (prev === id ? null : id));
    }
  };

  return (
    <footer className={styles.footer} id="contact" role="contentinfo">
      <div className={styles.container}>
        {/* FAQ Section - Hidden on mobile */}
        <div ref={faqRef} className={`${styles.faqSection} ${isFaqInView ? styles.visible : ''}`}>
          <div className={styles.faqHeader}>
            <h2 className={styles.faqTitle}>{t('faqTitle')}</h2>
            <p className={styles.faqSubtitle}>{t('faqSubtitle')}</p>
          </div>

          <div className={styles.faqs}>
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

        {/* Main Footer - Compact on mobile */}
        <div className={styles.main}>
          {/* Brand section */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              <Image src="/logo.svg" alt={siteName} width={100} height={32} className={styles.logoImage} />
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

          {/* Link sections - Collapsible on mobile */}
          <div className={styles.linkSections}>
            {content.sections.map((section) => (
              <div key={section.id} className={styles.linkSection}>
                <button
                  className={`${styles.sectionHeader} ${openSection === section.id ? styles.open : ''}`}
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={!isMobile || openSection === section.id}
                >
                  <h4>{section.title}</h4>
                  <ChevronDown className={styles.chevron} aria-hidden="true" />
                </button>
                <div className={`${styles.links} ${!isMobile || openSection === section.id ? styles.expanded : ''}`}>
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
          <p className={styles.copyright}>{content.copyright}</p>
          <div className={styles.legalLinks}>
            <Link href="/terms">{t('termsOfService')}</Link>
            <span className={styles.separator}>·</span>
            <Link href="/privacy">{t('privacyPolicy')}</Link>
          </div>
          <p className={styles.developer}>{t('developedBy')} Mahdy Gribkov</p>
        </div>
      </div>
    </footer>
  );
}
