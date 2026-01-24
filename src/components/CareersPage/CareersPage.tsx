'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronDown,
  MapPin,
  Briefcase,
  Compass,
  Leaf,
  Award,
  Users,
  Check,
} from 'lucide-react';
import { JobListing, CompanyValue } from '@/data/careersData';
import styles from './CareersPage.module.scss';

interface CareersPageProps {
  values: CompanyValue[];
  benefits: string[];
  jobs: JobListing[];
}

const valueIcons: Record<string, React.ReactNode> = {
  compass: <Compass size={24} />,
  leaf: <Leaf size={24} />,
  award: <Award size={24} />,
  users: <Users size={24} />,
};

const typeLabels: Record<string, string> = {
  'full-time': 'Full-time',
  'part-time': 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
};

export default function CareersPage({ values, benefits, jobs }: CareersPageProps) {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const filteredJobs = filter === 'all' ? jobs : jobs.filter((job) => job.type === filter);

  const toggleJob = (id: string) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  return (
    <div className={styles.careers}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        <header className={styles.header}>
          <h1>Join Our Team</h1>
          <p>
            Help travelers discover the beauty of Albania. We&apos;re looking for passionate people
            to join our growing team.
          </p>
        </header>

        <section className={styles.valuesSection}>
          <h2>Our Values</h2>
          <div className={styles.valuesGrid}>
            {values.map((value) => (
              <div key={value.id} className={styles.valueCard}>
                <div className={styles.valueIcon}>{valueIcons[value.icon]}</div>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.benefitsSection}>
          <h2>Why Work With Us</h2>
          <div className={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefitItem}>
                <Check size={18} className={styles.checkIcon} />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.jobsSection}>
          <div className={styles.jobsHeader}>
            <h2>Open Positions</h2>
            <div className={styles.filters}>
              <button
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'full-time' ? styles.active : ''}`}
                onClick={() => setFilter('full-time')}
              >
                Full-time
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'internship' ? styles.active : ''}`}
                onClick={() => setFilter('internship')}
              >
                Internships
              </button>
            </div>
          </div>

          {filteredJobs.length === 0 ? (
            <div className={styles.noJobs}>
              <p>No positions found matching your filter.</p>
            </div>
          ) : (
            <div className={styles.jobsList}>
              {filteredJobs.map((job) => (
                <div key={job.id} className={styles.jobCard}>
                  <button
                    className={styles.jobHeader}
                    onClick={() => toggleJob(job.id)}
                    aria-expanded={expandedJob === job.id}
                  >
                    <div className={styles.jobInfo}>
                      <h3>{job.title}</h3>
                      <div className={styles.jobMeta}>
                        <span className={styles.department}>
                          <Briefcase size={14} />
                          {job.department}
                        </span>
                        <span className={styles.location}>
                          <MapPin size={14} />
                          {job.location}
                        </span>
                        <span className={styles.type}>{typeLabels[job.type]}</span>
                      </div>
                    </div>
                    <ChevronDown
                      size={20}
                      className={`${styles.chevron} ${expandedJob === job.id ? styles.rotated : ''}`}
                    />
                  </button>

                  {expandedJob === job.id && (
                    <div className={styles.jobContent}>
                      <div className={styles.jobDescription}>
                        <h4>About the Role</h4>
                        <p>{job.description}</p>
                      </div>

                      <div className={styles.jobRequirements}>
                        <h4>Requirements</h4>
                        <ul>
                          {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                          ))}
                        </ul>
                      </div>

                      <div className={styles.jobBenefits}>
                        <h4>Benefits</h4>
                        <ul>
                          {job.benefits.map((benefit, index) => (
                            <li key={index}>{benefit}</li>
                          ))}
                        </ul>
                      </div>

                      <a
                        href={`mailto:careers@itravel.com?subject=Application for ${job.title}`}
                        className={styles.applyBtn}
                      >
                        Apply Now
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className={styles.ctaSection}>
          <h3>Don&apos;t See Your Role?</h3>
          <p>
            We&apos;re always looking for talented people. Send us your CV and tell us how you can
            contribute.
          </p>
          <a href="mailto:careers@itravel.com" className={styles.ctaBtn}>
            Send Open Application
          </a>
        </section>
      </div>
    </div>
  );
}
