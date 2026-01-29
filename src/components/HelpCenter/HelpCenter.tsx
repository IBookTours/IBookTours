'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronDown,
  Search,
  Calendar,
  CreditCard,
  XCircle,
  Map,
  User,
  MessageCircle,
  Phone,
  Mail,
} from 'lucide-react';
import { FAQCategory } from '@/data/helpData';
import styles from './HelpCenter.module.scss';

interface HelpCenterProps {
  categories: FAQCategory[];
}

const iconMap: Record<string, React.ReactNode> = {
  calendar: <Calendar size={20} />,
  'credit-card': <CreditCard size={20} />,
  'x-circle': <XCircle size={20} />,
  map: <Map size={20} />,
  user: <User size={20} />,
};

export default function HelpCenter({ categories }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    return categories
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            item.question.toLowerCase().includes(query) ||
            item.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.items.length > 0);
  }, [categories, searchQuery]);

  const toggleItem = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const displayCategories = activeCategory
    ? filteredCategories.filter((c) => c.id === activeCategory)
    : filteredCategories;

  return (
    <div className={styles.helpCenter}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          <ChevronLeft size={16} />
          Back to Home
        </Link>

        <header className={styles.header}>
          <h1>Help Center</h1>
          <p>Find answers to your questions about bookings, payments, and more.</p>
        </header>

        <div className={styles.searchBox}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search help topics"
          />
        </div>

        <div className={styles.categoryTabs}>
          <button
            className={`${styles.tab} ${!activeCategory ? styles.active : ''}`}
            onClick={() => setActiveCategory(null)}
          >
            All Topics
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`${styles.tab} ${activeCategory === category.id ? styles.active : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {iconMap[category.icon]}
              <span>{category.name}</span>
            </button>
          ))}
        </div>

        <div className={styles.content}>
          {displayCategories.length === 0 ? (
            <div className={styles.noResults}>
              <p>No results found for &quot;{searchQuery}&quot;</p>
              <button onClick={() => setSearchQuery('')}>Clear search</button>
            </div>
          ) : (
            displayCategories.map((category) => (
              <section key={category.id} className={styles.categorySection}>
                <h2>
                  {iconMap[category.icon]}
                  {category.name}
                </h2>

                <div className={styles.faqList}>
                  {category.items.map((item) => (
                    <div key={item.id} className={styles.faqItem}>
                      <button
                        className={`${styles.question} ${expandedItems.has(item.id) ? styles.expanded : ''}`}
                        onClick={() => toggleItem(item.id)}
                        aria-expanded={expandedItems.has(item.id)}
                        aria-controls={`answer-${item.id}`}
                      >
                        <span>{item.question}</span>
                        <ChevronDown
                          size={20}
                          className={expandedItems.has(item.id) ? styles.rotated : ''}
                        />
                      </button>
                      {expandedItems.has(item.id) && (
                        <div id={`answer-${item.id}`} className={styles.answer}>
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>

        <div className={styles.contactCta}>
          <h3>Still need help?</h3>
          <p>Our support team is here to assist you.</p>
          <div className={styles.contactOptions}>
            <a href="mailto:support@ibooktours.com" className={styles.contactBtn}>
              <Mail size={20} />
              Email Support
            </a>
            <a href="tel:+972506566211" className={styles.contactBtn}>
              <Phone size={20} />
              Call Us
            </a>
            <Link href="/contact" className={styles.contactBtn}>
              <MessageCircle size={20} />
              Contact Form
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
