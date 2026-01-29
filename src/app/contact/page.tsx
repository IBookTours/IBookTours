'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
} from 'lucide-react';
import { validateEmail, validateName, getFieldError } from '@/utils/validation';
import { TIMING } from '@/lib/constants';
import styles from './contact.module.scss';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Our Office',
    details: ['IBookTours Headquarters', 'Tirana, Albania', '1001'],
  },
  {
    icon: Phone,
    title: 'Phone',
    details: ['+355 4 234 5678', '+355 69 234 5678'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['hello@ibooktours.com', 'support@ibooktours.com'],
  },
  {
    icon: Clock,
    title: 'Working Hours',
    details: ['Sun - Thu: 9:00 - 18:00', 'Fri - Sat: Closed'],
  },
];

const faqs = [
  {
    question: 'How do I book a trip?',
    answer: 'Browse our destinations, select your package, and complete the booking form. Our team will confirm within 24 hours.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Free cancellation up to 30 days before departure. Partial refunds for 15-29 days prior.',
  },
  {
    question: 'Do you offer group discounts?',
    answer: 'Yes! Groups of 6 or more receive 10% off. Contact us for custom packages.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form fields
    const errors: Record<string, string> = {};

    if (!validateName(formData.name)) {
      errors.name = getFieldError('name', formData.name) || 'Please enter a valid name';
    }
    if (!validateEmail(formData.email)) {
      errors.email = getFieldError('email', formData.email) || 'Please enter a valid email address';
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return; // Don't submit if validation fails
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, TIMING.PAYMENT_SIMULATION_DELAY));

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <Image
          src="https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=1920&h=600&fit=crop&q=90"
          alt="Albanian landscape - Contact us"
          fill
          priority
          quality={90}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <span className={styles.badge}>Get in Touch</span>
          <h1>We&apos;d Love to Hear From You</h1>
          <p>Have a question or ready to plan your next adventure? Reach out to us.</p>
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.mainGrid}>
          {/* Contact Form */}
          <div className={styles.formSection}>
            <div className={styles.formCard}>
              {isSubmitted ? (
                <div className={styles.successMessage}>
                  <CheckCircle />
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. We&apos;ll get back to you within 24 hours.</p>
                  <button onClick={() => setIsSubmitted(false)}>
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <div className={styles.formHeader}>
                    <MessageSquare />
                    <h2>Send us a Message</h2>
                    <p>Fill out the form below and we&apos;ll respond as soon as possible.</p>
                  </div>

                  <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                      <div className={styles.inputGroup}>
                        <label htmlFor="name">Full Name</label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          autoComplete="name"
                          aria-required="true"
                          aria-invalid={!!formErrors.name}
                          aria-describedby={formErrors.name ? 'name-error' : undefined}
                          className={formErrors.name ? styles.inputError : ''}
                        />
                        {formErrors.name && (
                          <span id="name-error" className={styles.fieldError} role="alert">
                            {formErrors.name}
                          </span>
                        )}
                      </div>
                      <div className={styles.inputGroup}>
                        <label htmlFor="email">Email Address</label>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          autoComplete="email"
                          aria-required="true"
                          aria-invalid={!!formErrors.email}
                          aria-describedby={formErrors.email ? 'email-error' : undefined}
                          className={formErrors.email ? styles.inputError : ''}
                        />
                        {formErrors.email && (
                          <span id="email-error" className={styles.fieldError} role="alert">
                            {formErrors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="subject">Subject</label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a topic</option>
                        <option value="booking">Booking Inquiry</option>
                        <option value="support">Customer Support</option>
                        <option value="partnership">Partnership</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        placeholder="Tell us about your travel plans or questions..."
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className={styles.submitButton}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className={styles.spinner} />
                      ) : (
                        <>
                          Send Message
                          <Send />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* Contact Info Sidebar */}
          <div className={styles.sidebar}>
            <div className={styles.infoCards}>
              {contactInfo.map((info) => (
                <div key={info.title} className={styles.infoCard}>
                  <div className={styles.infoIcon}>
                    <info.icon />
                  </div>
                  <div className={styles.infoContent}>
                    <h3>{info.title}</h3>
                    {info.details.map((detail, index) => (
                      <p key={index}>{detail}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Google Maps Embed */}
            <div className={styles.mapCard}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d47895.05332029656!2d19.7866848!3d41.3275459!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350310470fac5db%3A0x40092af10653720!2sTirana%2C%20Albania!5e0!3m2!1sen!2s!4v1706000000000!5m2!1sen!2s"
                width="100%"
                height="250"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="IBookTours Office Location - Tirana, Albania"
              />
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className={styles.faqSection}>
          <div className={styles.faqHeader}>
            <h2>Frequently Asked Questions</h2>
            <p>Quick answers to common questions</p>
          </div>
          <div className={styles.faqGrid}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.faqCard}>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
