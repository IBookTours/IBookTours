'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Compass, Headphones, Shield, ArrowRight } from 'lucide-react';
import { AboutContent } from '@/types';
import { useInView } from '@/hooks';
import styles from './AboutSection.module.scss';

interface AboutSectionProps {
  content: AboutContent;
}

const iconMap: Record<string, React.ReactNode> = {
  compass: <Compass />,
  headphones: <Headphones />,
  shield: <Shield />,
};

export default function AboutSection({ content }: AboutSectionProps) {
  const [sectionRef, isInView] = useInView<HTMLElement>({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section ref={sectionRef} className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={`${styles.images} ${isInView ? styles.visible : ''}`}>
            {content.images.map((image, index) => (
              <div key={index} className={styles.imageWrapper}>
                <Image
                  src={image}
                  alt={`About us ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
            ))}

            <div className={styles.badge}>
              <span className={styles.value}>{content.statsHighlight.value}</span>
              <span className={styles.label}>{content.statsHighlight.label}</span>
            </div>
          </div>

          <div className={`${styles.content} ${isInView ? styles.visible : ''}`}>
            <span className={styles.sectionLabel}>{content.badge}</span>
            <h2 className={styles.title}>{content.title}</h2>
            <p className={styles.description}>{content.description}</p>

            <div className={styles.features}>
              {content.features.map((feature) => (
                <div key={feature.id} className={styles.feature}>
                  <div className={styles.featureIcon}>
                    {iconMap[feature.icon]}
                  </div>
                  <div className={styles.featureContent}>
                    <h4>{feature.title}</h4>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/about" className={styles.cta}>
              Learn More
              <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
