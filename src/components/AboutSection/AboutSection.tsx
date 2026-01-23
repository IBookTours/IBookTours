'use client';

import Image from 'next/image';
import { Compass, Headphones, Shield, ArrowRight } from 'lucide-react';
import { AboutContent } from '@/types';
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
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.images}>
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

          <div className={styles.content}>
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

            <button className={styles.cta}>
              Learn More
              <ArrowRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
