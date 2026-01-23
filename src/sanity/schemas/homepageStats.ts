// ============================================
// HOMEPAGE STATS SCHEMA
// ============================================
// Singleton document for homepage statistics

import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homepageStats',
  title: 'Homepage Stats',
  type: 'document',
  // Note: Singleton behavior is enforced in sanity.config.ts structure
  fields: [
    defineField({
      name: 'happyTravelersCount',
      title: 'Happy Travelers Count',
      type: 'number',
      description: 'Total number of happy travelers (e.g., 1000)',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'happyTravelersSuffix',
      title: 'Happy Travelers Suffix',
      type: 'string',
      description: 'Suffix to display (e.g., "+")',
      initialValue: '+',
    }),
    defineField({
      name: 'destinationsCount',
      title: 'Destinations Count',
      type: 'number',
      description: 'Number of world destinations (e.g., 72)',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'positiveFeedbackPercent',
      title: 'Positive Feedback Percentage',
      type: 'number',
      description: 'Percentage of positive feedback (e.g., 94)',
      validation: (Rule) => Rule.required().min(0).max(100),
    }),
    defineField({
      name: 'yearsExperience',
      title: 'Years of Experience',
      type: 'number',
      description: 'Years in business',
      validation: (Rule) => Rule.positive(),
    }),
    defineField({
      name: 'tripsBooked',
      title: 'Trips Booked',
      type: 'string',
      description: 'Total trips booked (e.g., "8.4K")',
    }),
    defineField({
      name: 'partnerHotels',
      title: 'Partner Hotels',
      type: 'string',
      description: 'Number of partner hotels (e.g., "2.1K")',
    }),
    defineField({
      name: 'userRating',
      title: 'User Rating',
      type: 'number',
      description: 'Average user rating (e.g., 4.9)',
      validation: (Rule) => Rule.min(1).max(5).precision(1),
    }),
    defineField({
      name: 'travelersLabel',
      title: 'Travelers Label',
      type: 'string',
      description: 'Label text for travelers stat',
      initialValue: 'Happy travelers',
    }),
    defineField({
      name: 'destinationsLabel',
      title: 'Destinations Label',
      type: 'string',
      description: 'Label text for destinations stat',
      initialValue: 'World destinations',
    }),
    defineField({
      name: 'feedbackLabel',
      title: 'Feedback Label',
      type: 'string',
      description: 'Label text for feedback stat',
      initialValue: 'Positive feedback',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage Statistics',
        subtitle: 'Edit site-wide statistics',
      };
    },
  },
});
